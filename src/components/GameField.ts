import { Container, DisplayObject } from "pixi.js";
import { dragManager, fifteenModel, gameModel } from "../facade";
import { Chip } from "./Chip";
import { GamePhase } from "../enums/GamePhase";
import { PixiDragNode } from "./drag/PixiDragNode";

export class GameField extends Container {
  constructor (  ) {
    super(  );

    gameModel.subscribe({
      next: phase => {
        if ( phase === GamePhase.Start ) {
          if ( this.children.length ) {
            this.children.forEach( chip => this.chipDestroy(chip) );
            this.children.length = 0;
          }

          fifteenModel.restart();

          this.build();
        }
      }
    })
    this.build();
  }

  private build = () => {
    fifteenModel.getValues()
      .filter( Boolean )
      .forEach( (value, index) => {
        const NUM_X_CELL = 4;
        const NUM_Y_CELL = 4;
        let x = index % NUM_X_CELL;
        let y = Math.floor(index / NUM_X_CELL) % NUM_Y_CELL;

        let chip = new Chip( value );
        chip.x = chip.width * x;
        chip.y = chip.height * y;

        dragManager.add( new PixiDragNode<Chip>(chip) );

        this.addChild( chip );
      } );
  }

  private chipDestroy = (chip: DisplayObject) => {
  }

}