import { Container } from "pixi.js";


export class ButtonService {
  static getInfo = (x=0,y=0,width=0,height=0) => ( { x, y, width, height } );

  private overInfo = ButtonService.getInfo();
  private outInfo = ButtonService.getInfo();
  private clickStartInfo = ButtonService.getInfo();
  private clickEndInfo = ButtonService.getInfo();

  constructor (private target: Container) {
    this.target.once( `added`, () => {
      this.overInfo = ButtonService.getInfo(this.target.x - 4, this.target.y - 4, this.target.width + 8, this.target.height + 8)
      this.outInfo = ButtonService.getInfo( this.target.x, this.target.y, this.target.width, this.target.height );
      this.clickStartInfo = ButtonService.getInfo( this.target.x + 2, this.target.y + 2, this.target.width - 4, this.target.height - 4 );
      this.clickEndInfo = { ...this.overInfo };
    } );
    this.target.once( `mouseover`, this.mouseoverHandler );
  }

  private mouseoverHandler = () => {
    this.target.once( `mouseout`, this.mouseoutHandler );
    this.target.on( `click`, this.clickHandler );
    this.target.on( `pointertap`, this.clickHandler );

    this.over();
  }
  private mouseoutHandler = () => {
    this.target.once( `mouseover`, this.mouseoverHandler );
    this.target.off( `click`, this.clickHandler );
    this.target.off( `pointertap`, this.clickHandler );

    this.out();
  }
  private clickHandler = () => {
    this.click();
  }

  readonly over = () => {
    gsap.to( this.target, {
      width: this.overInfo.width,
      height: this.overInfo.height,

      x: this.overInfo.x,
      y: this.overInfo.y,

      ease: Circ.easeOut,
      duration: .2
    } );
  }
  readonly out = () => {
    gsap.to( this.target, {
      width: this.outInfo.width,
      height: this.outInfo.height,

      x: this.outInfo.x,
      y: this.outInfo.y,

      ease: Circ.easeOut,
      duration: .2
    } );
  }
  readonly click = () => {
    let timeline = gsap.timeline()
      .add( gsap.to( this.target, {
        width: this.clickStartInfo.width,
        height: this.clickStartInfo.height,

        x: this.clickStartInfo.x,
        y: this.clickStartInfo.y,


        ease: Bounce.easeIn,
        duration: .1
      } ), 0 )
      .add( gsap.to( this.target, {
        width: this.clickEndInfo.width,
        height: this.clickEndInfo.height,

        x: this.clickEndInfo.x,
        y: this.clickEndInfo.y,

        ease: Bounce.easeOut,
        duration: .1
      } ), .2 )

  }
}