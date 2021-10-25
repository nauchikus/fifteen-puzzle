import { ModelEventType } from "./event-types";

export interface InitializationGameEvent {
  type: ModelEventType.Initialization;
}
export interface StartGameEvent {
  type: ModelEventType.StartGame;
}



export type ModelEvent = InitializationGameEvent | StartGameEvent;