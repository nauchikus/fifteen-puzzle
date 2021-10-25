import { Container, Sprite } from "pixi.js";
import { LoaderStatus, ProgressLoaderEvent } from "../loaders/app-loader";
import {
  filter,
  interval,
  map,
  Observable, scan,
  Subject, switchMap, take,
} from "rxjs";
import { Loader } from "../Loader";
import { Preloader } from "../components/Preloader";
import { appModel } from "../facade";

export class PreloaderView extends Container {
  constructor () {
    super();

    this.once(`added`, this.addedHandler)
  }

  readonly addedHandler = (event: any) => {
    let loader = Loader.appAssets$();

    let progress = loader.pipe(
      filter( ( { type } ) => type === LoaderStatus.Progress ),
      scan( ( acc, event: any ) => {
        let stop = event.percent;
        let current = acc[ acc.length - 1 ] ?? 0

        while ( current < stop ) {
          acc.push( ++current );
        }

        return acc;
      }, [] as number[] ),
      switchMap(values => {
        return interval( 5 ).pipe(
          take( values.length ),
          map( ( i ) => values[ i ] )
        );
      })
    ) as Observable<number>;

    this.addPreloaderView( progress );
  }

  private addPreloaderView = (observable: Observable<number>) => {
    let preloaderView = new Preloader( observable );
    preloaderView.once( `complete`, () => {
      this.removeChild( preloaderView );
      appModel.removePreloader();
    } );
    this.addChild( preloaderView );
  }
}