import {LeaguePlayerData} from "../model/LeagueDataTypes"
import {LeagueActionTypes} from "./leagueActionTypes"

export type RefreshLeaguePlayersAction = {
  "type": string;
  "leaguePlayers": Array<LeaguePlayerData>;
}
export default function refreshLeaguePlayersAction(leaguePlayers: Array<LeaguePlayerData>): RefreshLeaguePlayersAction {
  return { type: LeagueActionTypes.REFRESH_LEAGUE_PLAYERS, leaguePlayers}
}