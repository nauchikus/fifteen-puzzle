export class Store {
  static bundles = new Map<string, any>();
  static addBundle = ( key: string, bundle: any ) =>
    Store.bundles.set( key, bundle );
  static getBundle = <T>( key: string ) =>
    Store.bundles.get( key ) as T;
  static removeBundle = ( key: string ) =>
    Store.bundles.delete( key );
}