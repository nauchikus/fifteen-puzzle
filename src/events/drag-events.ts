import { DragEventType } from "../enums/DragEventType";

export interface StopDragDragDataEvent<Data> {
  type: DragEventType.DragStop;
  data: Data;
}