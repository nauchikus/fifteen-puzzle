import {
  CustomDragEvent,
  DragGlobalState,
  EndFunctionLifeCycle,
  PostAbortActionLifeCycle,
  PostActionLifeCycle,
  WithDragEndEvent,
} from "../drag-types";
import { Container } from "pixi.js";
import { DragDirection } from "../../../enums/DragDirection";
import { Chip } from "../../Chip";
import { Point } from "../../../utils/Point";

export interface TargetToEndPositionEvent {
  isMoveMade: boolean;
  chipIndex: number;
}

export class TargetToEndPositionRule implements
  WithDragEndEvent<Container, DragGlobalState, TargetToEndPositionEvent>,
  EndFunctionLifeCycle<Container, DragGlobalState>,
  PostActionLifeCycle<Container, DragGlobalState>,
  PostAbortActionLifeCycle<Container, DragGlobalState>{
  private postFxTween: gsap.core.Tween | null = null;
  private isHorizontal(direction: DragDirection){
    return direction === DragDirection.Right || direction === DragDirection.Left;
  }
  private isVertical(direction: DragDirection){
    return direction === DragDirection.Top || direction === DragDirection.Bottom;
  }


  toDragEndEvent({ target, cursor }: CustomDragEvent<Container>, { finishPosition, axisConstraint: {endPosition} }: DragGlobalState){
    const isMoveMade = finishPosition.x === endPosition.x && finishPosition.y === endPosition.y;
    const chipIndex = ( target as Chip ).index;

    return {
      isMoveMade,
      chipIndex,
    }
  }

  end( { target, cursor }: CustomDragEvent<Container>, { direction:{direction}, axisConstraint: {startPosition, endPosition} }: DragGlobalState ){
    let s = startPosition;
    let e = endPosition;
    let t = target;


    const isToFinishPosition = direction === DragDirection.Right || direction === DragDirection.Left ?
      direction === DragDirection.Right ? s.x + t.width / 2 <= t.x : s.x - t.width / 2 >= t.x :
      direction === DragDirection.Bottom ? s.y + t.height / 2 <= t.y : s.y - t.height / 2 >= t.y;


    const nextFinishPosition = isToFinishPosition ? endPosition : startPosition;


    return {
      finishPosition: Point.clone( nextFinishPosition )
    }
  }
  post ( { target, cursor }: CustomDragEvent<Container>, { finishPosition }: DragGlobalState ) {
    return new Promise((resolve, reject) => {
      this.postFxTween = gsap.to( target, {
        x: finishPosition.x,
        y: finishPosition.y,
        duration: .2,
        onComplete: resolve
      } );
    })

  }
  postAbort (  ) {
    if ( this.postFxTween ) {
      this.postFxTween.kill();
      this.postFxTween = null;
    }

  }
}