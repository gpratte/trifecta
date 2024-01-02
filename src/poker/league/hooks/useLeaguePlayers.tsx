import {useContext, useEffect} from "react";
import {NotificationDataBuilder} from "../model/NotificationDataBuilder";
import {LeagueContext, LeagueContextType} from "../components/League";
import leagueStore from "../../league/redux/leagueStore";
import leagueClient from "../../clients/leagueClient";
import {LeaguePlayerData} from "../model/LeagueDataTypes";
import refreshLeaguePlayersAction from "../redux/refreshLeaguePlayersAction";

export default function useLeaguePlayers() {
  const {server, toggleLoadingGlobal, newNotification} = useContext(LeagueContext) as LeagueContextType;

  useEffect(() => {
    async function init() {
      try {
        toggleLoadingGlobal(true);
        const leaguePlayers : Array<LeaguePlayerData> = await leagueClient.getPlayers(server);
        leagueStore.dispatch(refreshLeaguePlayersAction(leaguePlayers));
      } catch (error) {
        newNotification(new NotificationDataBuilder()
          .withObj(error)
          .withMessage('Problem getting league players')
          .build());
      } finally {
        toggleLoadingGlobal(false);
      }
    }

    init();
    // eslint-disable-next-line
  }, [])
}