import { tap } from "rxjs";
import { Store } from "./stores/Store";
import { StoreBundleKey } from "./enums/StoreBundleKey";
import { createLoader, LoaderStatus } from "./loaders/app-loader";

export class Loader {
  static appAssets$ = () => createLoader()
    .pipe(
      tap(event => {
        if ( event.type === LoaderStatus.Complete ) {
          Store.addBundle( StoreBundleKey.App, event.resources );
        }
      })
    )
}