import { CellSwapGrid } from "./CellSwapGrid";

export class Cell<T> {
  top: Cell<T> | null = null;
  right: Cell<T> | null = null;
  bottom: Cell<T> | null = null;
  left: Cell<T> | null = null;

  constructor ( public value: T ) {

  }

}
export class Grid<T> {
  cells: Cell<T>[] = [];

  constructor (readonly x = 4, readonly y = 4) {

  }

  fill = ( ...values: T[] ) => {
    this.cells = new Array( this.x * this.y )
      .fill( null )
      .map(() => new Cell(values.shift() as T))
      .map( ( current, index, source: (Cell<T>|null)[] ) => {
        let top = source[ index - this.x ] ?? null;
        let left = source[ index - 1 ] ?? null;

        current.top = top;
        current.left = left;



        top && (top.bottom = current);
        left && (left.right = current);

        return current;
      } );
  };

  getByValue = ( value: T ) => this.cells.find( cell => cell.value === value );
  someNeighborByValue = ( value: T, predicate: ( cell: Cell<T> | null ) => boolean ): boolean => {
    let currentCell = this.getByValue( value );

    if ( !currentCell ) {
      return false;
    }

    return ( ["top", "right", "bottom", "left"] as const ).some( key => {
      let neighborCell = (currentCell && currentCell[ key ]) ?? null;
      return predicate( neighborCell );
    } );
  };

  swap(a: Cell<T>, b:Cell<T>){
    let value = a.value;
    a.value = b.value;
    b.value = value;
  }
}