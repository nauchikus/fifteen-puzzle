
export class DragProcessController {
  private _isBreak = false;
  get isBreak(){
    return this._isBreak;
  }

  readonly break = () => this._isBreak = true;
}