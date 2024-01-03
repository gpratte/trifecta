import {useContext, useEffect} from "react";
import {NotificationDataBuilder} from "../model/NotificationDataBuilder";
import {LeagueContext, LeagueContextType} from "../components/League";
import leagueStore from "../../league/redux/leagueStore";
import leagueClient from "../../clients/leagueClient";
import {Settings} from "../model/LeagueDataTypes";
import refreshSettingsAction from "../redux/refreshSettingsAction";

export default function usePoints() {
  const {server, toggleLoadingGlobal, newNotification} = useContext(LeagueContext) as LeagueContextType;

  useEffect(() => {
    async function init() {
      try {
        toggleLoadingGlobal(true);
        const settings : Settings = await leagueClient.getSettings(server);
        leagueStore.dispatch(refreshSettingsAction(settings));
      } catch (error) {
        newNotification(new NotificationDataBuilder()
          .withObj(error)
          .withMessage('Problem getting points')
          .build());
      } finally {
        toggleLoadingGlobal(false);
      }
    }

    init();
    // eslint-disable-next-line
  }, [])
}