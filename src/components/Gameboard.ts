import { Container, Sprite } from "pixi.js";
import { Store } from "../stores/Store";
import { StoreBundleKey } from "../enums/StoreBundleKey";
import { AppResources } from "../loaders/app-loader";
import { fifteenModel, gameModel } from "../facade";
import { GamePhase } from "../enums/GamePhase";
import { Chip } from "./Chip";
import { LidGameboard } from "./LidGameboard";
import { MAX_SIZE, RATIO } from "../sizes";
import { GameField } from "./GameField";

export class Gameboard extends Container {
  private gameboard: Sprite;
  private lid: LidGameboard;


  private lidInitialRect;

  constructor (  ) {
    super(  );

    const resources = Store.getBundle<AppResources>( StoreBundleKey.App );

    const MIN_SIZE = Math.min( innerWidth, innerHeight );

    const WIDTH = Math.min( MAX_SIZE, Math.round(MIN_SIZE ) );
    const HEIGHT = Math.min( MAX_SIZE, Math.round(MIN_SIZE ) );

    /* GAMEBOARD */

    this.gameboard = new Sprite( resources.gameboard.texture );
    this.gameboard.scale.set(RATIO, RATIO)
    this.gameboard.alpha = 0;
    this.addChild( this.gameboard );


    /* GAME_FIELD */


    const gameField = new GameField();
    gameField.x = ( this.gameboard.width - gameField.width ) / 2;
    gameField.y = ( this.gameboard.height - gameField.height ) / 2;
    gameField.alpha = 0;

    this.addChild( gameField );


    /* LID */

    this.lid = new LidGameboard();
    this.lid.x = ( this.width - this.lid.width ) / 2;
    this.lid.y = ( this.height - this.lid.height ) / 2;
    this.addChild( this.lid );

    this.lidInitialRect = {
      width: this.lid.width,
      height: this.lid.height,
      x: this.lid.x,
      y: this.lid.y,
    };


    gameModel.subscribe({
      next: (phase) => {
        if ( phase === GamePhase.Start ) {
          this.gameboard.alpha = 1;
          gameField.alpha = 1;
          this.openLid();
        }else if ( phase === GamePhase.Restart ) {
          this.closeLid();
        }
      }
    })
  }


  private openLid = () => {
    this.lid.once(`rotateComplete`, () => {
      let size = 24
      let offset = size / 2;

      gsap.timeline({
        onComplete: () => {
          gameModel.game();
        }
      })
        .add( gsap.to( this.lid, {
          width: this.lid.width + size,
          height: this.lid.height + size,
          x: this.lid.x - offset,
          y: this.lid.y - offset,
          duration: .2
        } ), 0 )
        .add( gsap.to( this.lid, {
          x: this.lid.x + this.lid.width,
          alpha: 0,
          duration: .2
        } ), .3 )
    })
    this.lid.animate()
  }
  private closeLid = () => {
    let size = 24
    let offset = size / 2;

    gsap.timeline({
      onComplete: () => {
        gameModel.startGame();
      }
    })
      .add( gsap.to( this.lid, {
        x: 0,
        alpha: 1,
        duration: .2
      } ), 0 )
      .add( gsap.to( this.lid, {
        width: this.lidInitialRect.width,
        height: this.lidInitialRect.height,
        x: this.lidInitialRect.x,
        y: this.lidInitialRect.y,
        duration: .2
      } ), .3 )
  }

}