import {GameData} from "../../game/model/GameDataTypes";
import {GamesActionTypes} from "./gamesActionTypes";

export type RefreshGamesAction = {
  "type": string;
  "games": Array<GameData>;
}
export default function refreshGamesAction(games: Array<GameData>): RefreshGamesAction {
  return { type: GamesActionTypes.REFRESH_GAMES, games}
}
