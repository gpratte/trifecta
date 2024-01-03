import {Round} from "../model/LeagueDataTypes"
import {LeagueActionTypes} from "./leagueActionTypes"

export type RefreshRoundsAction = {
  "type": string;
  "rounds": Array<Round>;
}
export default function refreshRoundsAction(rounds: Array<Round>): RefreshRoundsAction {
  return { type: LeagueActionTypes.REFRESH_ROUNDS, rounds}
}