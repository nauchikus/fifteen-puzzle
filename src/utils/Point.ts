export class Point {
  static clone(point: Point){
    return new Point( point.x, point.y );
  }
  constructor (public x = 0, public y = 0) {
  }

}