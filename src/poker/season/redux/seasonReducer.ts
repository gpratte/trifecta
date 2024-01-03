import {SeasonData} from "../model/SeasonDataTypes";
import {RefreshSeasonAction, SetSeasonIdAction} from "./seasonActions";
import {SeasonActionTypes} from "./seasonActionTypes"

export function seasonReducer(state: SeasonData | {} = {}, action: RefreshSeasonAction): SeasonData | {} {
  switch (action.type) {
    case SeasonActionTypes.REFRESH_SEASON:
      return action.season;
    default:
      return state;
  }
}

export function seasonIdReducer(state: number = 0, action: SetSeasonIdAction): number {
  switch (action.type) {
    case SeasonActionTypes.SET_SEASON_ID:
      return action.seasonId;
    default:
      return state;
  }
}
