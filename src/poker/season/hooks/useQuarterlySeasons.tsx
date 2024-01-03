import {useContext, useEffect} from "react";
import {NotificationDataBuilder} from "../../league/model/NotificationDataBuilder";
import {LeagueContext, LeagueContextType} from "../../league/components/League";
import leagueStore from "../../league/redux/leagueStore";
import quarterlySeasonClient from "../../clients/quarterlySeasonClient";
import refreshQuarterlySeasonAction from "../redux/refreshQuarterlySeasonAction";

export default function useQuarterlySeasons(seasonId: number) {
  const {server, newNotification} = useContext(LeagueContext) as LeagueContextType;

  useEffect(() => {
    async function init() {
      try {
        const quarterlies = await quarterlySeasonClient.getQuarterlies(server, seasonId);
        leagueStore.dispatch(refreshQuarterlySeasonAction(quarterlies));
      } catch (error) {
        newNotification(new NotificationDataBuilder()
          .withObj(error)
          .withMessage(`Problem getting quarterly seasion ${seasonId}`)
          .build());
      }
    }

    init();
    // eslint-disable-next-line
  }, [])
}