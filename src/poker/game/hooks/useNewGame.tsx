import _ from "lodash";
import {useContext, useEffect, useState} from "react";
import gameClient from "../../clients/gameClient";
import leagueStore from "../../league/redux/leagueStore";
import {LeagueContext, LeagueContextType} from "../../league/components/League";
import {NotificationDataBuilder} from "../../league/model/NotificationDataBuilder";
import {getSeasonId} from "../../season/seasonUtils";
import {setSeasonId} from "../../season/redux/seasonActions";
import {LeaguePlayerData} from "../../league/model/LeagueDataTypes";
import leagueClient from "../../clients/leagueClient";
import refreshLeaguePlayersAction from "../../league/redux/refreshLeaguePlayersAction";
import refreshGameAction from "../redux/refreshGameAction";
import {useNavigate} from "react-router-dom";

function useNewGame() {
  const [startDate, setStartDate] = useState((new Date()))
  const [currentSeasonId, setCurrentSeasonId] = useState(0)
  const [leaguePlayers, setLeaguePlayers] = useState([] as Array<LeaguePlayerData>);
  const {server, toggleLoadingGlobal, newNotification, routePrefix} = useContext(LeagueContext) as LeagueContextType;
  const navigate = useNavigate();

  useEffect(() => {
    async function init() {
      try {
        let seasonId: number = leagueStore.getState().seasonId;
        if (seasonId < 1) {
          seasonId = await getSeasonId(server, newNotification);
          leagueStore.dispatch(setSeasonId(seasonId));
        }
        setCurrentSeasonId(seasonId);
      } catch (error) {
        newNotification(new NotificationDataBuilder()
          .withObj(error)
          .withMessage("Problem getting the season")
          .build());
      }

      try {
        let currentLeaguePlayers: Array<LeaguePlayerData> = leagueStore.getState().leaguePlayers;
        if (_.isEmpty(currentLeaguePlayers)) {
          currentLeaguePlayers = await leagueClient.getPlayers(server);
          leagueStore.dispatch(refreshLeaguePlayersAction(currentLeaguePlayers));
        }
        setLeaguePlayers(currentLeaguePlayers);
      } catch (error) {
        newNotification(new NotificationDataBuilder()
          .withObj(error)
          .withMessage("Problem getting league players")
          .build());
      }
    }

    init();
    // eslint-disable-next-line
  }, [])

  const addNewGame = async (e: any) => {
    e.preventDefault();
    try {
      const game = await gameClient.addNewGame(server,
        currentSeasonId,
        startDate.getMonth(),
        startDate.getDate(),
        startDate.getFullYear(),
        parseInt(e.target.elements.hostId.value));
      refreshGame(game.id);
      navigate(`${routePrefix}/current-game/${game.id}`)
    } catch (error) {
      newNotification(new NotificationDataBuilder()
        .withObj(error)
        .withMessage("Problem creating a new game")
        .build());
    }
  }

  const refreshGame = async (gameId : number): Promise<void> => {
    try {
      toggleLoadingGlobal(true);
      const game = await gameClient.getGame(server, gameId);
      leagueStore.dispatch(refreshGameAction(game));
    } catch (error) {
      newNotification(new NotificationDataBuilder()
        .withObj(error)
        .withMessage(`Problem getting game ${gameId}`)
        .build());
    } finally {
      toggleLoadingGlobal(false);
    }
  }

  return {
    startDate,
    setStartDate,
    leaguePlayers,
    addNewGame
  };
}

export default useNewGame