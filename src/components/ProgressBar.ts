import { Sprite, Graphics, Container, ObservablePoint } from "pixi.js";

export class ProgressBar extends Container {
  static drawRect = (graphics: Graphics, color: number, width: number, height: number) => {
    graphics.clear();
    graphics.beginFill(color);
    graphics.drawRoundedRect(0, 0, width, height, 3);

    return graphics;
  }

  private progress: Graphics;

  private size = {
    width: Math.min( 256, document.documentElement.clientWidth - 48 ),
    height: 16
  };

  constructor () {
    super();

    this.progress = new Graphics();

    this.once(`added`, this.addedHandler)

  }

  readonly addedHandler = () => {
    const bg = ProgressBar.drawRect( new Graphics(), 0x6D319C, this.size.width, this.size.height );
    this.addChild(bg);


    this.progress = ProgressBar.drawRect(new Graphics(), 0x511381, this.size.width, this.size.height);
    this.progress.scale.x = 0;
    this.addChild(this.progress);
  }
  readonly update = (percent: number) => {
    this.progress.scale.x = percent / 100;
  }
}