import { Cell, Grid } from "../utils/Grid";
import { DragDirection } from "../enums/DragDirection";
import { Subject } from "rxjs";
import { GamePhase } from "../enums/GamePhase";

export class FifteenModel extends Subject<GamePhase> {
  static createGrid = () => {
    let shuffled = new Array( 15 )
      .fill(0)
      .map( ( _, i ) => i + 1 )
      .sort(() => Math.random() - .5);

    let grid = new Grid<number>( 4, 4 );
    grid.fill( ...shuffled );

    return grid;
  }

  grid: Grid<number>;


  constructor (  ) {
    super();

    this.grid = FifteenModel.createGrid();
  }

  private isWinGame(){
    return this.grid.cells.every( ( cell, index ) => cell.value === index );
  }

  getEmpty(cell: Cell<number>){
    if ( cell.top && !cell.top.value ) {
      return cell.top;
    }else if ( cell.right && !cell.right.value ) {
      return cell.right;
    }else if ( cell.bottom && !cell.bottom.value ) {
      return cell.bottom;
    }else if ( cell.left && !cell.left.value ) {
      return cell.left;
    }

    throw new Error( `Empty chip not found.` );
  }

  restart = () => {
    this.grid = FifteenModel.createGrid();
    this.next( GamePhase.Restart );
  };
  getValues = () => this.grid.cells.map( cell => cell.value );
  getChipByValue = ( value: number ) => this.grid.cells.find( cell => cell.value === value );
  hasActive = ( value: number ) => this.grid.someNeighborByValue(
    value,
    cell => {
      return cell ? cell.value == null : false;
    }
  );
  getDirectionByValue = (value: number): DragDirection | null => {
    let cell = this.grid.getByValue( value ) as Cell<number>;

    if ( cell.top && cell.top.value == null ) {
      return DragDirection.Top;
    }else if ( cell.right && cell.right.value == null ) {
      return DragDirection.Right;
    }else if ( cell.bottom && cell.bottom.value == null ) {
      return DragDirection.Bottom;
    }else if ( cell.left && cell.left.value == null ) {
      return DragDirection.Left;
    }

    return null;
  }

  swap(a: Cell<number>, b: Cell<number>){
    this.grid.swap( a, b );
  }
  makeMove ( index: number ) {
    let chip = this.getChipByValue( index );

    if ( !chip ) {
      throw new Error( `Chip with value "${ index }" not found.` );
    }

    const empty = this.getEmpty( chip );

    this.swap( chip, empty );

    if ( this.isWinGame() ) {
      this.next( GamePhase.Win );
    }
  }
}