import { Point } from "../../utils/Point";
import { getRules } from "../../facade";
import { Container } from "pixi.js";
import { DragProcessController } from "./DragProcessController";

export interface CustomDragEvent<T> {
  target: T;
  cursor: Point;
}
export interface DragEventNodeControllable {
  activateAwaitDrag(): void;
  activateDrag(): void;
  deactivateDrag(): void;
  deactivateAwaitDrag(): void;
}
export interface DragController<T> {
  start(node: DragEventNodeControllable, event: CustomDragEvent<T>): void;
  drag(node: DragEventNodeControllable, event: CustomDragEvent<T>): void;
  end(node: DragEventNodeControllable, event: CustomDragEvent<T>): void;
  post(node: DragEventNodeControllable, event: CustomDragEvent<T>): void | Promise<void>;
}

export interface DragNode<Target> extends DragEventNodeControllable {
  install ( dragController: DragController<Target> ): void;
}

export interface DragValidator<Target, State> {
  validate( event: CustomDragEvent<Target>, state: State ): boolean;
}


export interface DragContext<State> {
  isPure: boolean;
  state: State;
  dragProcessController: DragProcessController;
}

export interface DragRuleState<S> {
  defaultState?(): S;
}
export interface DragUtils {
  isPure: boolean;
  dragProcessController: DragProcessController;
}

export interface DragRule<Target, State> extends DragRuleState<Partial<State>>, WithEvents<Target, State, any>{
  start?: (event: CustomDragEvent<Target>, state: State, utils: DragUtils) => Partial<State>
  drag?: (event: CustomDragEvent<Target>, state: State, utils: DragUtils) => Partial<State>
  end?: (event: CustomDragEvent<Target>, state: State, utils: DragUtils) => Partial<State>
  post?: (event: CustomDragEvent<Target>, state: State, utils: DragUtils) => void | Promise<void>
  postAbort?: (event: CustomDragEvent<Target>, state: State, utils: DragUtils) => void
}

/*  */



export type WithDefaultState = {
  defaultState?: () => any;
}

type DefaultState<Instance extends WithDefaultState> = NonNullable<Instance["defaultState"]>
export type ToStore<T extends DragRuleState<any>> = ReturnType<NonNullable<T["defaultState"]>>;




type UnionKeys<T> = T extends object ? keyof T : never;
type UnionPick<T, PikedKey extends UnionKeys<T>> = T extends { [K in PikedKey]: any } ? T[PikedKey] : never;
type UnionMerge<T extends object> = {
  [K in UnionKeys<T>]: UnionPick<T, K>
}



type ExcludeActions<T> = T extends WithState<any> ? T : never;
type Rules = ReturnType<typeof getRules>[number];
type Functions = ExcludeActions<Rules>;
type GetState = ToStore<Functions>;
type CommonState = UnionMerge<Functions>;

// type RuleAll = ReturnType<typeof getRules>[number];
// type RuleState = ToStore<RuleAll>;
export type DragGlobalState = UnionMerge<GetState>




export interface PhaseElement<T, S, R> {
  (event: Readonly<CustomDragEvent<T>>, state: Readonly<S>, utils: DragUtils): R;
}


export interface WithState<S> {
  defaultState: () => Partial<S>;
}
export type WithEvents<T, S, E> = {
  toDragEndEvent?: PhaseElement<T, S, E>;
}
export type WithDragEndEvent<T, S, E> = {
  toDragEndEvent: PhaseElement<T, S, E>;
}

export interface ActionLifeCycle<T, S> extends PhaseElement<T, S, void>{
}
export interface FunctionLifeCycle<T, S> extends PhaseElement<T, S, Partial<S>>{
}


export interface StartActionLifeCycle<T, S> {
  start: ActionLifeCycle<T, S>;
}
export interface DragActionLifeCycle<T, S> {
  drag: ActionLifeCycle<T, S>;
}
export interface EndActionLifeCycle<T, S> {
  end: ActionLifeCycle<T, S>;
}


export interface StartFunctionLifeCycle<T, S>  {
  start: FunctionLifeCycle<T, S>;
}
export interface DragFunctionLifeCycle<T, S>  {
  drag: FunctionLifeCycle<T, S>;
}
export interface EndFunctionLifeCycle<T, S>  {
  end: FunctionLifeCycle<T, S>;
}


export interface PostActionLifeCycle<T, S> {
  post: PhaseElement<T, S, void>;
}
export interface PostAsyncActionLifeCycle<T, S> {
  post: PhaseElement<T, S, Promise<void>>;
}

export interface PostAbortActionLifeCycle<T, S> {
  postAbort: PhaseElement<T, S, void>;
}


export interface ActionOnlyLifeCycle<T, S> {
  start?: ActionLifeCycle<T, S>;
  drag?: ActionLifeCycle<T, S>;
  end?: ActionLifeCycle<T, S>;
}
export interface FunctionOnlyLifeCycle<T, S> {
  start?: FunctionLifeCycle<T, S>;
  drag?: FunctionLifeCycle<T, S>;
  end?: FunctionLifeCycle<T, S>;
}


interface BState {
  b: number;
}
interface CState {
  c: string;
}

type State = BState & CState;

class Rule {}
class ARule implements StartActionLifeCycle<Container, State>{
    start: ActionLifeCycle<Container, State> = () => {

    };
}
class BRule implements StartFunctionLifeCycle<Container, BState>{
  defaultState(){
    return {
      b: 5
    };
  }

  start: FunctionLifeCycle<Container, BState> = () => {
    return {
      b: 6
    }
  };

}
class CRule implements StartFunctionLifeCycle<Container, CState>, DragFunctionLifeCycle<Container, CState>{
  defaultState(){
    return {
      c: `5`
    };
  }

  start: FunctionLifeCycle<Container, CState> = () => {
    return {
      c: ``
    }
  }
  drag: FunctionLifeCycle<Container, CState> = () => {
    return {
      c: ``
    }
  }



}


const rules = () => [
  new ARule(),
  new BRule(),
  new CRule(),
];

type TExcludeActions<T> = T extends WithState<any> ? T : never;
type TRules = ReturnType<typeof rules>[number];
type TFunctions = TExcludeActions<TRules>;
type TGetState = ToStore<TFunctions>;
type TCommonState = UnionMerge<TGetState>;
