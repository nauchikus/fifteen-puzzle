import { Loader, LoaderResource, Texture } from "pixi.js";
import { Observable, share } from "rxjs";

/* RESOURCES */

export type NumImageResourceName = |
  `num_1` | `num_2` | `num_3` | `num_4` |
  `num_5` | `num_6` | `num_7` | `num_8` |
  `num_9` | `num_10` | `num_11` | `num_12` |
  `num_13` | `num_14` | `num_15`;
const numImageNameAll: NumImageResourceName[] = new Array( 15 )
  .fill( 0 )
  .map( ( _, index ) => `num_${ index + 1 }` ) as NumImageResourceName[];


const otherImageNameAll = [
  "blink_circle_gold",
  "btn_start",
  "btn_restart",
  "btn_sound_on",
  "btn_sound_off",
  "chip",
  "chip_glow",
  "gameboard",
  "lid",
  "lid_rect_top",
  "lid_rect_middle",
  "lid_rect_bottom",
  "lid_num",
  "logo",
  "win_glow",
  "win_you",
  "win_win",
] as const;

export type OtherImageResourceName = typeof otherImageNameAll[number];
export type ImageResourceName = NumImageResourceName | OtherImageResourceName;


/* LOADER */
export type LoaderImageInfo = {
  name: ImageResourceName,
  url: string;
}
export type AppResources = {
  [K in ImageResourceName]: LoaderResource
};

export enum LoaderStatus {
  Complete= "complete",
  Error = "error",
  Load = "load",
  Progress = "progress",
}
export interface CompleteLoaderEvent {
  type: LoaderStatus.Complete;

  resources: AppResources;
}
export interface ErroredLoaderEvent {
  type: LoaderStatus.Error;

  message: string;
}
export interface LoadLoaderEvent {
  type: LoaderStatus.Load;
}
export interface ProgressLoaderEvent {
  type: LoaderStatus.Progress;

  percent: number;
}

export type AppLoader = CompleteLoaderEvent | ErroredLoaderEvent | LoadLoaderEvent | ProgressLoaderEvent;


export const createLoader = () => new Observable<AppLoader>( subscriber => {
  const loader = new Loader();

  const data: LoaderImageInfo[] = [
    ...numImageNameAll.map( filename => ( {
      name: filename,
      url: `assets/images/nums/${ filename }.png`
    } ) ),

    ...otherImageNameAll.map( filename => ( {
      name: filename,
      url: `assets/images/${ filename }.png`
    } ) )
  ] as LoaderImageInfo[];


  loader.onError.add( error => {
    subscriber.next( {
      type: LoaderStatus.Error,
      message: error.message
    } );
  } );
  loader.onProgress.add( ( loader ) => {
    subscriber.next( {
      type: LoaderStatus.Progress,
      percent: Math.round( loader.progress )
    } );
  } );
  loader.onComplete.add( ( loader, resources ) => {
    subscriber.next( {
      type: LoaderStatus.Complete,
      resources: resources as unknown as AppResources
    } );
    subscriber.complete();
  } );

  loader.add( data );
  loader.load();

  subscriber.next( {
    type: LoaderStatus.Load
  } );


  return () => {
    loader.destroy();
  }
} ).pipe( share() );


