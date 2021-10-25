import { CustomDragEvent, DragValidator } from "../drag-types";
import type { FifteenModel } from "../../../models/FifteenModel";
import { Chip } from "../../Chip";
import { Container } from "pixi.js";

export class StartDragValidator<Target, State> implements DragValidator<Container, State> {
  constructor ( private fifteenModel: FifteenModel ) {

  }

  validate ( event: CustomDragEvent<Chip>, state: State ): boolean {
    return this.fifteenModel.hasActive( (event.target).index );
  }

}