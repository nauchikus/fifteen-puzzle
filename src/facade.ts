import { AppModel } from "./models/AppModel";
import { GameModel } from "./models/GameModel";
import { MainView } from "./view-models/MainView";
import { FifteenModel } from "./models/FifteenModel";
import { DragDirectionRule } from "./components/drag/rules/DragDirectionRule";
import { Container } from "pixi.js";
import { ApplyChange } from "./components/drag/rules/ApplyChange";
import { AxisConstraintRule } from "./components/drag/rules/AxisConstraintRule";
import { TargetToEndPositionRule } from "./components/drag/rules/TargetToEndPositionRule";
import { DragGlobalState, DragRule, DragValidator } from "./components/drag/drag-types";
import { FifteenViewModel } from "./view-models/FifteenViewModel";
import { Drag } from "./components/drag/Drag";
import { StartDragValidator } from "./components/drag/validators/StartDragValidator";
import { MoveRule } from "./components/drag/rules/MoveRule";
import { GamePhase } from "./enums/GamePhase";

export const appModel = new AppModel();
export const fifteenModel = new FifteenModel();
export const gameModel = new GameModel(fifteenModel);
export const mainView = new MainView(appModel, gameModel);

export const getRules = () => [
  new MoveRule(),
  new DragDirectionRule(fifteenModel),
  new AxisConstraintRule(),
  new ApplyChange(),
  new TargetToEndPositionRule(),
];
export const getValidators = () => [
  new StartDragValidator( fifteenModel )
];
export const dragManager = new Drag(
  getRules() as DragRule<Container, DragGlobalState>[],
  getValidators() as DragValidator<Container, DragGlobalState>[]
);
export const fifteenViewModel = new FifteenViewModel( fifteenModel, dragManager );

