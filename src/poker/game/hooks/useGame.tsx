import {useContext, useEffect} from "react";
import { useParams } from 'react-router-dom';
import gameClient from "../../clients/gameClient";
import {GameData} from "../model/GameDataTypes";
import {NotificationDataBuilder} from "../../league/model/NotificationDataBuilder";
import {LeagueContextType, LeagueContext} from "../../league/components/League";
import leagueStore from "../../league/redux/leagueStore";
import refreshGameAction from "../redux/refreshGameAction";
import {convertDateToMoment, convertDateToString} from "../../utils/util";
import {getSeasonId} from "../../season/seasonUtils";

function useGame(seasonId: number, gameId : number) {
  const {server, toggleLoadingGlobal, newNotification} = useContext(LeagueContext) as LeagueContextType;
  const { editGameId } = useParams();

  useEffect(() => {
    async function init() {
      try {
        toggleLoadingGlobal(true);
        let currentSeasonId = seasonId;
        if (currentSeasonId === 0) {
          currentSeasonId = await getSeasonId(server, newNotification);
        }
        let currentGameId: number = editGameId ? parseInt(editGameId) : gameId;
        if (currentSeasonId !== 0 && currentGameId === 0) {
          const games : Array<GameData> | null = await gameClient.getGames(server, currentSeasonId);
          // Use the first unfinalized game (only one should be unfinalized)
          const unfinalizedGame = games.find(g => {
            return !g.finalized;
          });
          if (unfinalizedGame) {
            currentGameId = unfinalizedGame.id;
          } else {
            // Use the game with this latest date
            let mostRecentGame : GameData | undefined;
            games.forEach(game => {
              if (!mostRecentGame) {
                mostRecentGame = game;
                return;
              }
              if (convertDateToMoment(game.date).isAfter(convertDateToString(mostRecentGame.date))) {
                mostRecentGame = game;
              }
            })
            if (mostRecentGame) {
              currentGameId = mostRecentGame.id;
            }
          }
        }
        const game: GameData = await gameClient.getGame(server, currentGameId);
        leagueStore.dispatch(refreshGameAction(game));
      } catch (error) {
        newNotification(new NotificationDataBuilder()
          .withObj(error)
          .withMessage("Problem getting game")
          .build());
      } finally {
        toggleLoadingGlobal(false);
      }
    }

    init();
    // eslint-disable-next-line
  }, [])

  const refreshGame = async (gameId : number): Promise<void> => {
    try {
      toggleLoadingGlobal(true);
      const game = await gameClient.getGame(server, gameId);
      leagueStore.dispatch(refreshGameAction(game));
    } catch (error) {
      newNotification(new NotificationDataBuilder()
        .withObj(error)
        .withMessage("Problem getting game")
        .build());
    } finally {
      toggleLoadingGlobal(false);
    }
  }

  return {
    refreshGame
  };
}

export default useGame;