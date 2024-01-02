import {GameData} from "../model/GameDataTypes";
import {RefreshGameAction} from "./refreshGameAction";
import {GameActionTypes} from "./gameActionTypes"

export default function gameReducer(state: GameData | {} = {}, action: RefreshGameAction): GameData | {} {
  switch (action.type) {
    case GameActionTypes.REFRESH_GAME:
      return action.game;
    default:
      return state;
  }
}