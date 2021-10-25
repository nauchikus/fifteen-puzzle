import { FifteenModel } from "../models/FifteenModel";
import { DragEventType } from "../enums/DragEventType";
import { Drag } from "../components/drag/Drag";

export class FifteenViewModel {
  constructor (private fifteenModel: FifteenModel,
               private drag: Drag<any, any>) {
    this.drag.observable.subscribe({
      next: event => {
        if ( event.type === DragEventType.DragStop ) {
          if ( event.data.isMoveMade ) {
            this.fifteenModel.makeMove( event.data.chipIndex );
          }
        }
      }
    })
  }
}