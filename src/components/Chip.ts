import { Container, Sprite } from "pixi.js";
import { Store } from "../stores/Store";
import { AppResources, NumImageResourceName } from "../loaders/app-loader";
import { StoreBundleKey } from "../enums/StoreBundleKey";
import { RATIO } from "../sizes";
import { Explosion } from "./Explosion";

export class Chip extends Container {
  private chip: Sprite;
  private chipGlow: Sprite;
  private exposion: Explosion;

  constructor (readonly index: number) {
    super();

    const resources = Store.getBundle<AppResources>( StoreBundleKey.App );

    this.interactive = true;
    this.buttonMode = true;

    /* CHIP */

    this.chip = new Sprite( resources.chip.texture );
    this.chip.scale.set( RATIO, RATIO );

    this.addChild( this.chip );

    /* CHIP_GLOW */

    this.chipGlow = new Sprite( resources.chip_glow.texture );
    this.chipGlow.scale.set( RATIO, RATIO );
    this.chipGlow.alpha = 0;

    this.addChild( this.chipGlow );

    /* EXPLOSION */

    this.exposion = new Explosion({
      width: this.chip.width,
      height: this.chip.height,
    });
    this.exposion.width = this.chip.width;
    this.exposion.height = this.chip.height;

    this.addChild( this.exposion );
    /* NUM */

    const num = new Sprite( resources[`num_${index}` as NumImageResourceName].texture );
    num.scale.set( RATIO, RATIO );
    num.x = ( this.chip.width - num.width ) / 2;
    num.y = ( this.chip.height - num.height ) / 2;

    this.addChild( num );

    this.once( `mouseover`, this.mouseoverHandler );
    this.on( `pointerdown`, this.clickHandler );

  }

  private clickHandler = () => {
    setTimeout( () => this.exposion.animate() );
  };

  private mouseoverHandler = ()=>{
    this.once( `mouseout`, this.mouseoutHandler );

    gsap.to( this.chipGlow, { alpha: 1 } );
  }
  private mouseoutHandler = ()=>{
    this.once( `mouseover`, this.mouseoverHandler );

    gsap.to( this.chipGlow, { alpha: 0 } );
  }
}