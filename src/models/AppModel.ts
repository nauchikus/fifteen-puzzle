import { Subject } from "rxjs";
import { GameBuildPhase } from "../enums/GameBuildPhase";

export class AppModel extends Subject<GameBuildPhase> {
  phase: GameBuildPhase = GameBuildPhase.Empty;


  next ( value: GameBuildPhase ) {
    this.phase = value;
    super.next( value );
  }

  addPreloader = () => this.next( GameBuildPhase.AddPreloader );
  loadingStart = () => this.next( GameBuildPhase.LoadingStart );
  loadingComplete = () => this.next( GameBuildPhase.LoadingComplete );
  removePreloader = () => this.next( GameBuildPhase.RemovePreloader );
  addGame = () => this.next( GameBuildPhase.AddGame );
  addGameDone = () => this.next( GameBuildPhase.AddGameDone );
}