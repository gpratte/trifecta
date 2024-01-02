import {QuarterlySeasonData} from "../model/QuarterlySeasonDataTypes";
import {QuarterlySeasonActionTypes} from "./quarterlySeasonActionTypes";

export type RefreshQuarterlySeasonAction = {
  "type": string;
  "quarterlies": Array<QuarterlySeasonData>;
}
export default function refreshQuarterlySeasonAction(quarterlies: Array<QuarterlySeasonData>): RefreshQuarterlySeasonAction {
  return { type: QuarterlySeasonActionTypes.REFRESH_QUARTERLY_SEASONS, quarterlies}
}
