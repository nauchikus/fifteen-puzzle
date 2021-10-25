import type { Cell } from "./Grid";

export class CellSwapGrid {
  static horizontalSwap ( a: Cell<any>, b: Cell<any> ) {
    let { top: at, right: ar, bottom: ab, left: al } = a;
    let { top: bt, right: br, bottom: bb, left: bl } = b;

    at && ( at.bottom = b );
    ab && ( ab.top = b );


    bt && ( bt.bottom = a );
    bb && ( bb.top = a );

    if ( a.right === b ) {
      al && ( al.right = b );
      br && ( br.right = a );

      a.right = b;
      b.left = a;
    } else if ( a.left === b ) {
      ar && ( ar.left = b );
      bl && ( bl.right = a );

      a.left = b;
      b.right = a;
    }
  }
  static verticalSwap(a: Cell<any>, b: Cell<any>){
    let { top: at, right: ar, bottom: ab, left: al } = a;
    let { top: bt, right: br, bottom: bb, left: bl } = b;



    ar && ( ar.left = b );
    al && ( al.right = b );

    br && ( br.left = a );
    bl && ( bl.right = a );

    if ( a.top === b ) {
      ab && ( ab.top = b );
      bb && ( bb.bottom = a );

      a.right = b;
      b.left = a;
    } else if ( a.bottom === b ) {
      at && ( at.bottom = b );
      bb && ( bb.bottom = a );

      a.left = b;
      b.right = a;
    }
  }
}