import { Container } from "pixi.js";
import { Point } from "../../../utils/Point";
import { FifteenModel } from "../../../models/FifteenModel";
import { Chip } from "../../Chip";
import { DragDirection } from "../../../enums/DragDirection";
import { CustomDragEvent, DragGlobalState, DragUtils, StartFunctionLifeCycle, WithState } from "../drag-types";

export interface DragDirectionRuleState {
  direction: {
    direction: DragDirection;
  }
}
export class DragDirectionRule implements WithState<DragDirectionRuleState>, StartFunctionLifeCycle<Container, DragGlobalState>{
  static getEndPosition = (target: Container, direction: DragDirection) => {
    let point = new Point( target.x, target.y );

    if ( direction === DragDirection.Top ) {
      point.y -= target.height;
    }else if ( direction === DragDirection.Right ) {
      point.x += target.width * 2;
    }else if ( direction === DragDirection.Bottom ) {
      point.y += target.height * 2;
    }else if ( direction === DragDirection.Left ) {
      point.x -= target.width;
    }


    return point;
  }
  constructor(private fifteenModel: FifteenModel){
  }

  defaultState = () => ({
    direction: {
      direction: DragDirection.Empty,
    }
  });
  start( event: CustomDragEvent<Container>, state: DragGlobalState, utils: DragUtils ) {
    let { target } = event;
    let direction = this.fifteenModel.getDirectionByValue( (target as Chip).index );

    if ( !direction ) {
      utils.dragProcessController.break();
      return this.defaultState();
    }


    return {
      direction: {
        direction,
      }
    };
  }

}

