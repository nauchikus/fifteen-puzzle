import { Container, Resource, Sprite, Texture } from "pixi.js";
import { Store } from "../stores/Store";
import { AppResources } from "../loaders/app-loader";
import { StoreBundleKey } from "../enums/StoreBundleKey";
import { RATIO } from "../sizes";

export class Explosion extends Container {
  private texture:  Texture<Resource>;

  constructor (private size: {width: number, height: number}, private num = 8) {
    super();

    this.width = 120

    const resources = Store.getBundle<AppResources>( StoreBundleKey.App );

    this.texture = resources.blink_circle_gold.texture as Texture<Resource>;
  }


  readonly animate = () => {

    const start = {
      x: this.size.width / 2,
      y: this.size.height / 2
    };
    const radius = Math.floor( Math.min( this.size.width, this.size.height ) / 2 - 4 );
    const distance = Math.floor( 360 / this.num );

    const startAngle = Math.floor( Math.random() * 360 );

    for ( let i = 0; i < this.num; i++ ) {
      let blink = new Sprite( this.texture );
      blink.scale.set( RATIO, RATIO );
      blink.x = start.x - blink.width / 2;
      blink.y = start.y - blink.height / 2;

      this.addChild( blink );
    }


    const timeline = gsap.timeline( {
      onComplete: () => {
        this.children.length = 0;
      }
    } );

    this.children.reduce( ( timeline, blink, index ) => {
      let angle = ( Math.floor( startAngle + distance * index ) ) % 360  * Math.PI / 180;
      let finish = {
        x: start.x + Math.cos( angle ) * radius,
        y: start.y + Math.sin( angle ) * radius
      };

      let animationSettings = {
        x: finish.x,
        y: finish.y,
        alpha: 0,
        ease: Expo.easeOut,
        duration: .4
      }

      return timeline.add( gsap.to( blink, animationSettings ), 0 );
    }, timeline );
  };
}