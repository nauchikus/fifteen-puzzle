import { Container, Sprite } from "pixi.js";
import { ButtonService } from "../services/ButtonService";

export class ToggleButton extends Container {
  private btnInvertMap = new Map<string, Sprite>();
  private btnService = new ButtonService( this );

  constructor ( private onState: Sprite, private offState: Sprite) {
    super(  );

    this.onState.name = `on`;
    this.offState.name = `off`;

    this.btnInvertMap.set( this.onState.name, this.offState );
    this.btnInvertMap.set( this.offState.name, this.onState );

    this.interactive = true;
    this.buttonMode = true;

    this.addChild( this.onState );

    this.on( `click`, this.clickHandler );
  }

  readonly clickHandler = () => {
    let currentName = this.children[ 0 ].name;

    this.removeChild( this.children[ 0 ] );
    this.addChild( this.btnInvertMap.get( currentName ) as Sprite);
  }
}