import seasonClient from "../clients/seasonClient";
import leagueStore from "../league/redux/leagueStore";
import {setSeasonId} from "./redux/seasonActions";
import {NotificationData, NotificationDataBuilder} from "../league/model/NotificationDataBuilder";
import {AxiosInstance} from "axios";

export async function getSeasonId(server: AxiosInstance, newNotification : (notify: NotificationData) => void) : Promise<number> {
  let seasonId : number = 0;
  try {
    seasonId = await seasonClient.getCurrentSeasonId(server);
    leagueStore.dispatch(setSeasonId(seasonId));
  } catch (error) {
    newNotification(new NotificationDataBuilder()
      .withObj(error)
      .withMessage('Problem getting the season Id')
      .build());
  }
  return seasonId;
}
