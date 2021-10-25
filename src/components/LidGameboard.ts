import { Container, Graphics, Sprite } from "pixi.js";
import { Store } from "../stores/Store";
import { AppResources } from "../loaders/app-loader";
import { StoreBundleKey } from "../enums/StoreBundleKey";
import { RATIO } from "../sizes";

type RotateSettings = {
  forward: {
    angle: number;
    duration: number;
    delay: number;
  };
  backward: {
    angle: number;
    duration: number;
    delay: number;
  };
}

export class LidGameboard extends Container {
  private lid: Sprite;
  private topRectLid: Sprite;
  private middleRectLid: Sprite;
  private bottomRectLid: Sprite;
  private numLid: Sprite;

  constructor (  ) {
    super(  );

    const resources = Store.getBundle<AppResources>( StoreBundleKey.App );

    this.lid = new Sprite( resources.lid.texture );
    this.lid.scale.set( RATIO, RATIO );

    this.addChild( this.lid );



    const PIVOT = this.lid.width;
    const OFFSET = PIVOT / 2;

    this.bottomRectLid = new Sprite( resources.lid_rect_bottom.texture );
    this.bottomRectLid.pivot.set( this.bottomRectLid.width/2, this.bottomRectLid.height/2 );
    this.bottomRectLid.scale.set(RATIO,RATIO)
    this.bottomRectLid.position.set( this.bottomRectLid.width/2, this.bottomRectLid.height/2 );
    this.addChild( this.bottomRectLid );


    this.middleRectLid = new Sprite( resources.lid_rect_middle.texture );
    this.middleRectLid.pivot.set( this.middleRectLid.width/2, this.middleRectLid.height/2 );
    this.middleRectLid.scale.set(RATIO,RATIO)
    this.middleRectLid.position.set( this.middleRectLid.width/2, this.middleRectLid.height/2 );
    this.addChild( this.middleRectLid );

    this.topRectLid = new Sprite( resources.lid_rect_top.texture );
    this.topRectLid.pivot.set( this.topRectLid.width/2, this.topRectLid.height/2 );
    this.topRectLid.scale.set(RATIO,RATIO)
    this.topRectLid.position.set( this.topRectLid.width/2, this.topRectLid.height/2 );
    this.addChild( this.topRectLid );


    this.numLid = new Sprite( resources.lid_num.texture );
    this.numLid.scale.set( RATIO, RATIO );
    this.addChild( this.numLid );
  }

  readonly animate = () => {
    let timeline = gsap.timeline({
      onComplete: () => {
        this.emit( `rotateComplete` );
      }
    });
    this.rotate( timeline, this.bottomRectLid, {
      forward: {
        angle: 16,
        delay: 0,
        duration: .4
      },
      backward: {
        angle: 0,
        delay: .1,
        duration: .3
      }
    } );
    this.rotate( timeline, this.middleRectLid, {
      forward: {
        angle: 24,
        delay: .1,
        duration: .3
      },
      backward: {
        angle: -360,
        delay: .1,
        duration: 1
      }
    } );
    this.rotate( timeline, this.topRectLid, {
      forward: {
        angle: 36,
        delay: .2,
        duration: .2
      },
      backward: {
        angle: -720,
        delay: 0,
        duration: 1.3
      }
    } );
  }

  private rotate = (timeline: GSAPTimeline, target: Container, settings: RotateSettings) => {
    timeline
      .add(gsap.to(target, settings.forward), 0)
      .add(gsap.to(target, settings.backward), .5)
  }

}