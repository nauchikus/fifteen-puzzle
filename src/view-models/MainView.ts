import { Container } from "pixi.js";
import type { GameModel } from "../models/GameModel";
import type { AppModel } from "../models/AppModel";
import { GameViewModel } from "./GameViewModel";
import { PreloaderView } from "./PreloaderView";
import { GameBuildPhase } from "../enums/GameBuildPhase";
import { fifteenModel, gameModel } from "../facade";
import { WinView } from "./WinView";
import { GamePhase } from "../enums/GamePhase";

export class MainView extends Container {
  constructor ( private appModel: AppModel, private mainModel: GameModel ) {
    super(  );

    gameModel.subscribe( {
      next: phase => {
        if ( phase === GamePhase.Win ) {
          this.addChild( new WinView() );
        } else if ( phase === GamePhase.Restart ) {
          let winView = this.children.find( view => view instanceof WinView );

          if ( winView ) {
            this.removeChild( winView );
          }
        }
      }
    } );

    appModel.subscribe( {
      next: ( phase ) => {
        if ( phase === GameBuildPhase.AddPreloader ) {
          let preloaderViewModel = new PreloaderView(  );
          preloaderViewModel.x = 0;
          preloaderViewModel.y = 0;
          this.addChild( preloaderViewModel );
        } else if ( phase === GameBuildPhase.RemovePreloader ) {
          this.removeChildAt( 0 );
          appModel.addGame();
        }else if ( phase === GameBuildPhase.AddGame ) {
          let gameViewModel = new GameViewModel(  );
          this.addChild( gameViewModel );
        }else if ( phase === GameBuildPhase.AddGameDone ) {
          gameModel.startGame();
        }
      }
    } );

  }
}