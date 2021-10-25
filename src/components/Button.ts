import { Container, Sprite } from "pixi.js";
import { ButtonService } from "../services/ButtonService";

export class Button extends Container {
  private btnService = new ButtonService( this );

  constructor ( private sprite: Sprite ) {
    super(  );

    this.interactive = true;
    this.buttonMode = true;

    this.addChild( this.sprite );
  }


}