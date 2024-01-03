import {Settings} from "../model/LeagueDataTypes"
import {LeagueActionTypes} from "./leagueActionTypes"

export type RefreshSettingsAction = {
  "type": string;
  "settings": Settings;
}
export default function refreshSettingsAction(settings: Settings): RefreshSettingsAction {
  return { type: LeagueActionTypes.REFRESH_SETTINGS, settings}
}