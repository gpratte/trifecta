import {SeasonData} from "../model/SeasonDataTypes";
import {SeasonActionTypes} from "./seasonActionTypes"

export type RefreshSeasonAction = {
  "type": string;
  "season": SeasonData;
}
export type SetSeasonIdAction = {
  "type": string;
  "seasonId": number;
}

export function refreshSeasonAction(season: SeasonData): RefreshSeasonAction {
  return { type: SeasonActionTypes.REFRESH_SEASON, season}
}
export function setSeasonId(seasonId: number): SetSeasonIdAction {
  return { type: SeasonActionTypes.SET_SEASON_ID, seasonId}
}
