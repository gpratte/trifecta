import {createStore, applyMiddleware} from "redux";
// @ts-ignore
import reduxImmutableStateInvariant from  "redux-immutable-state-invariant";
import leagueReducer from "./leagueReducer";
import {GameData} from "../../game/model/GameDataTypes";
import {SeasonData} from "../../season/model/SeasonDataTypes";
import {QuarterlySeasonData} from "../../season/model/QuarterlySeasonDataTypes";
import {LeaguePlayerData, Round, Settings} from "../model/LeagueDataTypes";

export type LeagueData = {
  game: GameData | undefined;
  games: Array<GameData> | undefined;
  season: SeasonData | undefined;
  seasonId: number | undefined;
  quarterlies: Array<QuarterlySeasonData> | undefined;
  leaguePlayers: Array<LeaguePlayerData> | undefined;
  rounds: Array<Round> | undefined;
  settings: Settings | undefined;
}

const leagueStore = createStore(leagueReducer,
  {} as LeagueData,
  applyMiddleware(reduxImmutableStateInvariant()));

export default leagueStore;
