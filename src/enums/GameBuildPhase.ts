export enum GameBuildPhase {
  Empty = "",
  AddPreloader = "addPreloader",
  LoadingStart = "loadingStart",
  LoadingComplete = "loadingComplete",
  RemovePreloader = "removePreloader",
  AddGame = "addGame",
  AddGameDone = "addGameComplete",
  WinGame = "winGame",
}