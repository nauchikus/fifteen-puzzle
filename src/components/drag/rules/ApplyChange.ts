import { Container } from "pixi.js";
import { CustomDragEvent, DragActionLifeCycle } from "../drag-types";
import { MoveState } from "./MoveRule";


export class ApplyChange implements DragActionLifeCycle<Container, MoveState > {
  drag ( event: CustomDragEvent<Container>, state: MoveState ) {
    let { target } = event;

    target.x = state.finishPosition.x;
    target.y = state.finishPosition.y;
  }

}
