import {GameData} from "../../game/model/GameDataTypes"
import {RefreshGamesAction} from "./refreshGamesAction";
import {GamesActionTypes} from "./gamesActionTypes";

export default function gamesReducer(state: Array<GameData> | [] = [], action: RefreshGamesAction): Array<GameData> | [] {
  switch (action.type) {
    case GamesActionTypes.REFRESH_GAMES:
      return action.games;
    default:
      return state;
  }
}