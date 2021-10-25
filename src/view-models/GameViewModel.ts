import { Container, Sprite } from "pixi.js";
import { Store } from "../stores/Store";
import { StoreBundleKey } from "../enums/StoreBundleKey";
import { AppResources } from "../loaders/app-loader";
import { ToggleButton } from "../components/ToggleButton";
import { Gameboard } from "../components/Gameboard";
import { appModel, fifteenModel, gameModel } from "../facade";
import { GamePhase } from "../enums/GamePhase";
import { RATIO } from "../sizes";
import { Button } from "../components/Button";
import { WinView } from "./WinView";

export class GameViewModel extends Container {
  private gameElementPlacingDuration = .3;

  constructor () {
    super();

    this.once( `added`, this.addedHandler );
  }
  readonly addedHandler = () => {
    const resources = Store.getBundle<AppResources>( StoreBundleKey.App );

    /* logo */

    const logo = new Sprite( resources.logo.texture );
    logo.scale.set( .8, .8 );
    this.addChild( logo );


    /* sound toggle btn */

    const soundToggleBtn = new ToggleButton(
      new Sprite( resources.btn_sound_on.texture ),
      new Sprite( resources.btn_sound_off.texture )
    );
    soundToggleBtn.scale.set( RATIO, RATIO );
    soundToggleBtn.x = innerWidth - soundToggleBtn.width - 24;
    soundToggleBtn.y = innerHeight - soundToggleBtn.height - 24;

    // this.addChild( soundToggleBtn );


    /* gameboard */

    const gameboard = new Gameboard();
    this.addChild( gameboard );

    gameboard.x = Math.round( ( innerWidth - gameboard.width ) / 2 );
    gameboard.y = Math.max( Math.round( ( innerHeight - gameboard.height ) / 2 ), logo.height  );


    /* logo position */

    logo.x = gameboard.x;
    logo.y = gameboard.y - logo.height;


    /* game restart btn */




    const gameRestartBthSkin = new Sprite( resources.btn_restart.texture );
    gameRestartBthSkin.scale.set( RATIO, RATIO );
    const gameRestartBtn = new Button(gameRestartBthSkin);
    gameRestartBtn.x = ( gameboard.width - gameRestartBtn.width ) / 2 + gameboard.x;
    gameRestartBtn.y = gameboard.y + gameboard.height + 8;
    gameRestartBtn.alpha = 0;

    gameRestartBtn.on( `pointerdown`, this.restartGame );

    this.addChild( gameRestartBtn );


    /* subscribe beginning of game */

    let gamePhaseSubscription = gameModel.subscribe({
      next: phase => {
        if ( phase === GamePhase.Game ) {
          gamePhaseSubscription.unsubscribe();
          this.animateToUp( gameRestartBtn );
        }
      }
    })

    gsap.timeline( {
      onComplete: () => {
        appModel.addGameDone();
      }
    } )
      .add( this.animateToDown( logo ), 0 )
      .add( this.animateToDown( gameboard, .1 ), 0 )
      .add( this.animateToUp( soundToggleBtn ), 0 );

  }

  private animateToDown = (target: Container, delay = 0) => {
    let y = target.y;

    return gsap.fromTo(
      target,
      { y: y - 50, alpha: 0 },
      { y: y, alpha: 1, duration: this.gameElementPlacingDuration, ease: "bounce.out", delay }
    );
  }
  private animateToUp = (target: Container, delay = 0) => {
    let y = target.y;

    return gsap.fromTo(
      target,
      { y: y + 50, alpha: 0 },
      { y: y, alpha: 1, duration: this.gameElementPlacingDuration, ease: "bounce.out", delay }
    );
  }

  private restartGame = () => {
    if ( gameModel.phase === GamePhase.Restart ) {
      return;
    }

    gameModel.restartGame();
  }
}