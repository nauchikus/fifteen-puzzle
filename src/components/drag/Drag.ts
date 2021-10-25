import { Subject } from "rxjs";
import { DragEventType } from "../../enums/DragEventType";
import { StopDragDragDataEvent } from "../../events/drag-events";
import {
  CustomDragEvent,
  DragEventNodeControllable,
  DragController,
  DragRule,
  DragValidator,
  DragNode, DragContext, DragUtils
} from "./drag-types";
import { DragProcessController } from "./DragProcessController";



export class Drag<Target, State extends object> implements
  DragController<Target> {
  private nodes = new Set<DragNode<Target>>();
  private targetToStateMap = new Map<Target, DragContext<State>>();

  private defaultState: State;

  private cloneState = ( state: State ): State => JSON.parse( JSON.stringify( state ) );

  private subject = new Subject<StopDragDragDataEvent<any>>();

  get observable(){
    return this.subject.asObservable();
  }

  constructor ( private rules: DragRule<Target, State>[],
                private validators?: DragValidator<Target, State>[] ) {

    this.defaultState = this.rules.reduce( ( result: Partial<State>, rule ) => {
      if ( rule.defaultState ) {
        return Object.assign( result, rule.defaultState() );
      }

      return result;
    }, {} ) as State;
  }
  add = ( dragEventNode: DragNode<Target> ) => {
    dragEventNode.install( this );
    dragEventNode.activateAwaitDrag();
  };
  remove = ( dragEventNode: DragNode<Target> ) => {

  };
  clear = () => this.nodes.clear();

  /* Internal Events */
  private dispatchDragEvent(event: CustomDragEvent<Target>, state: State, utils: DragUtils){
    let data = this.rules.reduce( ( resultEvent, rule ) => {
      if ( rule.toDragEndEvent ) {
        let partEvent = rule.toDragEndEvent( event, state, utils );

        return Object.assign( resultEvent, partEvent );
      }

      return resultEvent;
    }, {} );

    this.subject.next( {
      type: DragEventType.DragStop,
      data
    } );
  }
  /* Internal Events */


  getDefaultContext(){
    return {
      isPure: true,
      state: this.cloneState( this.defaultState ),
      dragProcessController: new DragProcessController(),
    };
  }
  start ( node: DragEventNodeControllable, event: CustomDragEvent<Target> ): void {
    const isContextExists = this.targetToStateMap.has( event.target );
    const context = isContextExists ?
      this.targetToStateMap.get( event.target ) as DragContext<State> :
      this.getDefaultContext();

    if ( isContextExists ) {
      context.isPure = false;
    }

    const { state, ...utils } = context;


    if ( isContextExists ) {
      this.rules.forEach(rule=> {
        if ( rule.postAbort ) {
          rule.postAbort( event, state as State, utils );
        }
      })
    }

    let isDragBreak = this.validators && this.validators
      .some( validator => !validator.validate( event, state ) );

    if ( isDragBreak ) {
      return;
    }else{
      node.deactivateAwaitDrag();
      node.activateDrag();
    }

    for ( let rule of this.rules ) {
      if ( context.dragProcessController.isBreak ) {
        break;
      }

      if ( rule.start ) {
        let result = rule.start( event, state as State, utils );

        if ( result ) {
          Object.assign( state,  result);
        }
      }
    }

    if ( !isContextExists ) {
      this.targetToStateMap.set( event.target, context );
    }
  }
  drag ( node: DragEventNodeControllable, event: CustomDragEvent<Target> ): void {
    const { state, ...utils } = this.targetToStateMap.get( event.target ) as DragContext<State>;

    for ( let rule of this.rules ) {
      if ( utils.dragProcessController.isBreak ) {
        break;
      }

      if ( rule.drag ) {
        let result = rule.drag( event, state as State, utils );

        if ( result ) {
          Object.assign( state,  result);
        }
      }
    }
  }
  end ( node: DragEventNodeControllable, event: CustomDragEvent<Target> ): void {
    node.deactivateDrag();
    node.activateAwaitDrag();

    const { state, ...utils } = this.targetToStateMap.get( event.target ) as DragContext<State>;

    for ( let rule of this.rules ) {
      if ( utils.dragProcessController.isBreak ) {
        break;
      }

      if ( rule.end ) {
        let result = rule.end( event, state as State, utils );

        if ( result ) {
          Object.assign( state,  result);
        }
      }
    }

    this.dispatchDragEvent( event, state, utils );
  }

  post ( node: DragEventNodeControllable, event: CustomDragEvent<Target> ): void | Promise<void> {
    const { state, ...utils } = this.targetToStateMap.get( event.target ) as DragContext<State>;

    const result: Promise<void> | null = this.rules.reduce( ( returned: Promise<any> | null, rule ) => {
      let result = rule.post ? rule.post( event, state as State, utils ) : null;

      if ( result instanceof Promise && returned instanceof Promise ) {
        return returned.then( () => result );
      } else if ( result instanceof Promise ) {
        return result;
      }

      return returned;
    }, null );

    if ( result instanceof Promise) {
      result.then(() => {
        this.targetToStateMap.delete( event.target );
      })
    }else{
      this.targetToStateMap.delete( event.target );
    }
  }
}

