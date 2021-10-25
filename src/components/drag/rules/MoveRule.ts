import { Container } from "pixi.js";
import { Point } from "../../../utils/Point";
import {
  CustomDragEvent,
  DragFunctionLifeCycle,
  DragGlobalState,
  DragUtils,
  StartFunctionLifeCycle,
  WithState
} from "../drag-types";

export interface MoveState {
  offsetPosition: Point;
  startPosition: Point;
  currentPosition: Point;
  finishPosition: Point;
}

export class MoveRule implements WithState<MoveState>,
  StartFunctionLifeCycle<Container, DragGlobalState>,
  DragFunctionLifeCycle<Container, DragGlobalState>{
  defaultState = () => ({
    offsetPosition: new Point(),
    startPosition: new Point(),
    currentPosition: new Point(),
    finishPosition: new Point(),
  });

  start( { target, cursor }: CustomDragEvent<Container>, state: MoveState, utils: DragUtils ) {
    let local = target.toLocal( cursor );

    return {
      offsetPosition: new Point( local.x, local.y ),
      startPosition: utils.isPure ? new Point(
        target.x,
        target.y
      ) : Point.clone( state.finishPosition ),
      currentPosition: new Point(target.x, target.y),
      finishPosition: new Point(target.x, target.y),
    };
  }
  drag( { target, cursor }: CustomDragEvent<Container>, { offsetPosition }: MoveState, utils: DragUtils ) {
    let local = target.parent.toLocal( cursor );

    return {
      currentPosition: new Point(target.x, target.y),
      finishPosition: new Point(
        local.x - offsetPosition.x,
        local.y - offsetPosition.y
      ),
    };
  }

}
