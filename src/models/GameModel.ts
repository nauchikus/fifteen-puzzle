import { Subject } from "rxjs";
import { GamePhase } from "../enums/GamePhase";
import type { FifteenModel } from "./FifteenModel";


export class GameModel extends Subject<GamePhase> {
  phase: GamePhase = GamePhase.Empty;

  constructor ( private fifteenModel: FifteenModel ) {
    super(  );

    this.fifteenModel.subscribe({
      next: phase => {
        if ( phase === GamePhase.Win ) {
          this.winGame();
        }
      }
    })
  }


  next ( value: GamePhase ) {
    this.phase = value;
    super.next( value );
  }

  startGame = () => {
    this.next( GamePhase.Start );
  };
  game = () => {
    this.next( GamePhase.Game );
  }
  winGame = () => {
    this.next( GamePhase.Win );
  }
  restartGame = () => {
    this.next( GamePhase.Restart );
  }


}