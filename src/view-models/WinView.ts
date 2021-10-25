import { Container, Sprite, BLEND_MODES } from "pixi.js";
import { Store } from "../stores/Store";
import { AppResources } from "../loaders/app-loader";
import { StoreBundleKey } from "../enums/StoreBundleKey";
import { RATIO } from "../sizes";

export class WinView extends Container {
  constructor () {
    super();

    const resources = Store.getBundle<AppResources>( StoreBundleKey.App );

    const winGlow = new Sprite( resources.win_glow.texture );
    winGlow.pivot.set( winGlow.width / 2, winGlow.height / 2 );
    winGlow.scale.set( RATIO, RATIO );
    winGlow.blendMode = BLEND_MODES.ADD;
    winGlow.x = innerWidth / 2;
    winGlow.y = innerHeight / 2;

    this.addChild( winGlow );

    gsap.to(winGlow, {
      angle: 360,

      ease: Linear.easeNone,
      duration: 6,
      repeat: -1
    })
    gsap.timeline( { repeat: -1 } )
      .add( gsap.to( winGlow, {
        alpha: .7,
        ease: Linear.easeIn,
        duration: 2,
      } ) )
      .add( gsap.to( winGlow, {
        alpha: 1,
        ease: Linear.easeOut,
        duration: 2,
      } ) );

    const youText = new Sprite( resources.win_you.texture );
    youText.pivot.set( youText.width / 2, youText.height / 2 );
    youText.scale.set( RATIO, RATIO );


    const winText = new Sprite( resources.win_win.texture );
    winText.pivot.set( winText.width / 2, winText.height / 2 );
    winText.scale.set( RATIO, RATIO );

    const textContainer = new Container();
    textContainer.addChild( winText );
    textContainer.addChild( youText );


    textContainer.pivot.set( textContainer.width / 2, textContainer.height / 2 );
    textContainer.x = innerWidth / 2;
    textContainer.y = innerHeight / 2;
    this.addChild( textContainer );



    winText.x = textContainer.width / 2;
    winText.y = textContainer.height / 2;

    youText.x = textContainer.width / 2;

    gsap.timeline({repeat: -1})
      .add(gsap.to(youText, {x: youText.x + 24, ease: Linear.easeNone, duration: 2}))
      .add(gsap.to(youText, {x: youText.x - 48, ease: Linear.easeNone, duration: 4}))
      .add(gsap.to(youText, {x: textContainer.width / 2, ease: Linear.easeNone, duration: 2}))
    gsap.timeline({repeat: -1})
      .add(gsap.to(winText, {x: winText.x - 8, ease: Linear.easeNone, duration: 2}))
      .add(gsap.to(winText, {x: winText.x + 16, ease: Linear.easeNone, duration: 4}))
      .add(gsap.to(winText, {x: textContainer.width / 2, ease: Linear.easeNone, duration: 2}))
  }
}