import {useContext, useEffect} from "react";
import {NotificationDataBuilder} from "../../league/model/NotificationDataBuilder";
import {LeagueContext, LeagueContextType} from "../../league/components/League";
import leagueStore from "../../league/redux/leagueStore";
import gameClient from "../../clients/gameClient";
import refreshGamesAction from "../redux/refreshGamesAction";
import {GameData} from "../../game/model/GameDataTypes";

export default function useGames(seasonId: number) {
  const {server, newNotification} = useContext(LeagueContext) as LeagueContextType;

  useEffect(() => {
    async function init() {
      try {
        const games : Array<GameData> = await gameClient.getGames(server, seasonId);
        leagueStore.dispatch(refreshGamesAction(games));
      } catch (error) {
        newNotification(new NotificationDataBuilder()
          .withObj(error)
          .withMessage(`Problem getting games for season ${seasonId}`)
          .build());
      }
    }

    init();
    // eslint-disable-next-line
  }, [])
}