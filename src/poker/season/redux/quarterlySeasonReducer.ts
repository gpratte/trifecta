import {QuarterlySeasonData} from "../model/QuarterlySeasonDataTypes";
import {RefreshQuarterlySeasonAction} from "./refreshQuarterlySeasonAction";
import {QuarterlySeasonActionTypes} from "./quarterlySeasonActionTypes";

export default function quarterlySeasonReducer(state: Array<QuarterlySeasonData> | [] = [], action: RefreshQuarterlySeasonAction): Array<QuarterlySeasonData> | [] {
  switch (action.type) {
    case QuarterlySeasonActionTypes.REFRESH_QUARTERLY_SEASONS:
      return action.quarterlies;
    default:
      return state;
  }
}