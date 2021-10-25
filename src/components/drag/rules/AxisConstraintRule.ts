import { Container } from "pixi.js";
import {
  CustomDragEvent,
  DragFunctionLifeCycle,
  DragGlobalState,
  StartFunctionLifeCycle,
  WithState
} from "../drag-types";
import { Point } from "../../../utils/Point";
import { DragDirectionRuleState } from "./DragDirectionRule";
import { DragDirection } from "../../../enums/DragDirection";
import { MoveState } from "./MoveRule";

export interface AxisConstraintRuleState {
  axisConstraint: {
    startPosition: Point;
    endPosition: Point;
  }
}
export class AxisConstraintRule implements
  WithState<AxisConstraintRuleState>,
  StartFunctionLifeCycle<Container, DragGlobalState>,
  DragFunctionLifeCycle<Container, DragGlobalState>{

  static minMax(min: number, current: number, max: number){
    return Math.min(Math.max(current, min), max);
  }


  private isHorizontal(direction: DragDirection){
    return direction === DragDirection.Right || direction === DragDirection.Left;
  }
  private isVertical(direction: DragDirection){
    return direction === DragDirection.Top || direction === DragDirection.Bottom;
  }



  defaultState(){
    return {
      axisConstraint: {
        startPosition: new Point(),
        endPosition: new Point(),
      }
    }
  }

  start ( { target, cursor }: CustomDragEvent<Container>, { direction:{direction}, ...positions }: DragDirectionRuleState & MoveState ) {
    const startPosition = new Point(
      positions.startPosition.x,
      positions.startPosition.y
    );
    const endPosition = Point.clone(startPosition);

    if ( direction === DragDirection.Right ) {
      endPosition.x += target.width;
    }else if ( direction === DragDirection.Left ) {
      endPosition.x -= target.width;
    }else if ( direction === DragDirection.Top ) {
      endPosition.y -= target.height;
    }else if ( direction === DragDirection.Bottom ) {
      endPosition.y += target.height;
    }


    return {
      axisConstraint: {
        startPosition,
        endPosition,
      }
    };
  }
  drag ( { target, cursor }: CustomDragEvent<Container>, { direction, axisConstraint: {startPosition, endPosition}, ...positions }: DragDirectionRuleState & AxisConstraintRuleState & MoveState ) {
    const isHorizontal = this.isHorizontal( direction.direction );
    const isVertical = this.isVertical( direction.direction );

    const finishPosition = new Point( startPosition.x, startPosition.y );



    if ( isHorizontal ) {
      finishPosition.x = AxisConstraintRule.minMax(
        Math.min(startPosition.x, endPosition.x),
        positions.finishPosition.x,
        Math.max(startPosition.x, endPosition.x),
      );
    }else if ( isVertical ) {
      finishPosition.y = AxisConstraintRule.minMax(
        Math.min(startPosition.y, endPosition.y),
        positions.finishPosition.y,
        Math.max(startPosition.y, endPosition.y),
      );
    }


    return {
      finishPosition
    };
  }


}