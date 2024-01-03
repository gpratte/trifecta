import {useContext, useEffect} from "react";
import {NotificationDataBuilder} from "../model/NotificationDataBuilder";
import {LeagueContext, LeagueContextType} from "../components/League";
import leagueStore from "../../league/redux/leagueStore";
import leagueClient from "../../clients/leagueClient";
import {Round} from "../model/LeagueDataTypes";
import refreshRoundsAction from "../redux/refreshRoundsAction";

export default function useRounds() {
  const {server, toggleLoadingGlobal, newNotification} = useContext(LeagueContext) as LeagueContextType;

  useEffect(() => {
    async function init() {
      try {
        toggleLoadingGlobal(true);
        const rounds : Array<Round> = await leagueClient.getRounds(server);
        leagueStore.dispatch(refreshRoundsAction(rounds));
      } catch (error) {
        newNotification(new NotificationDataBuilder()
          .withObj(error)
          .withMessage('Problem getting rounds')
          .build());
      } finally {
        toggleLoadingGlobal(false);
      }
    }

    init();
    // eslint-disable-next-line
  }, [])
}