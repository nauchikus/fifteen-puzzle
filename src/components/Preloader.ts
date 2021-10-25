import { Container, Sprite } from "pixi.js";
import { Observable, Subject } from "rxjs";
import { ProgressBar } from "./ProgressBar";
import gsap from "gsap";


export class Preloader extends Container {
  constructor ( private observable: Observable<number> ) {
    super();

    this.once(`added`, this.addedHandler)
  }

  readonly addedHandler = (event: any) => {
    const progressBar = new ProgressBar();
    this.addChild( progressBar );

    progressBar.x = document.documentElement.clientWidth / 2 - progressBar.width / 2;
    progressBar.y = document.documentElement.clientHeight / 2 - progressBar.height / 2;



    this.observable.subscribe({
      next: ( percent ) => {
        progressBar.update( percent );
      },
      complete: () => {
        gsap.to( progressBar, {
          y: progressBar.y + 100, alpha: 0, duration: .3, onComplete: () => {
            this.emit( `complete` );
          }
        } );
      }
    });
  }

}