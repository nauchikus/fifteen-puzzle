import { Application, Graphics } from "pixi.js";
import { appModel, mainView } from "./facade";
import { BG_COLOR } from "./config";

const app = new Application({
  width: window.innerWidth,
  height: window.innerHeight,
  backgroundColor: BG_COLOR,

});
document.body.appendChild( app.view );


app.stage.addChild( mainView );

appModel.addPreloader();
