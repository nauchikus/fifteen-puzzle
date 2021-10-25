import { Container } from "pixi.js";
import { DragController, DragNode } from "./drag-types";
import { Point } from "../../utils/Point";

export class PixiDragNode<Target extends Container> implements DragNode<Target> {
  private dragController: DragController<Target> | null = null;

  constructor (private target: Target) {

  }

  private startTouchHandler = (event: any) => {
    this.dragController?.start( this, {
      target: this.target,
      cursor: event.data.global
    } );
  }
  private moveHandler = (event: MouseEvent) => {
    this.dragController?.drag( this, {
      target: this.target,
      cursor: new Point( event.clientX, event.clientY )
    } );
  }
  private stopTouchHandler = (event: MouseEvent) => {
    this.dragController?.end( this, {
      target: this.target,
      cursor: new Point( event.clientX, event.clientY )
    } );


    let result = this.dragController?.post( this, {
      target: this.target,
      cursor: new Point( event.clientX, event.clientY )
    } );

    // result instanceof Promise ? result.then( restart ) : restart();

  }

  public install(dragController: DragController<Target>){
    this.dragController = dragController;
  }

  /* Drag Event Node Controllable */

  activateAwaitDrag (): void {
    this.target.on( `pointerdown`, this.startTouchHandler );
  }

  activateDrag (): void {
    document.addEventListener( `pointermove`, this.moveHandler );
    document.addEventListener( `pointerup`, this.stopTouchHandler );
  }

  deactivateAwaitDrag (): void {
    this.target.off( `mousedown`, this.startTouchHandler );
  }

  deactivateDrag (): void {
    document.removeEventListener( `pointermove`, this.moveHandler );
    document.removeEventListener( `pointerup`, this.stopTouchHandler );
  }
}