import {useContext, useEffect, useState} from "react";
import seasonClient from "../../clients/seasonClient";
import gameClient from "../../clients/gameClient";
import leagueClient from "../../clients/leagueClient";
import {LeagueContext, LeagueContextType} from "../../league/components/League";
import {LeaguePlayerData} from "../../league/model/LeagueDataTypes";
import {SeasonPlayerData} from "../../season/model/SeasonDataTypes";
import {NotificationDataBuilder} from "../../league/model/NotificationDataBuilder";
import {AddExistingPlayerData, AddNewPlayerData} from "../model/GameDataTypes";

function useAddPlayer(seasonId: number,
                      gameId: number,
                      setShowAddPlayer: (value: (((prevState: boolean) => boolean) | boolean)) => void,
                      refreshGame: (n: number) => void) {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [leaguePlayers, setLeaguePlayers] = useState<Array<LeaguePlayerData>>([])
  const [seasonPlayers, setSeasonPlayers] = useState<Array<SeasonPlayerData>>([])
  const [activeTabKey, setActiveTabKey] = useState<string>('league-player');

  const {server, newNotification} = useContext(LeagueContext) as LeagueContextType;

  useEffect(() => {
    async function init() {
      try {
        setIsLoading(true);
        const currentLeaguePlayers : Array<LeaguePlayerData> = await leagueClient.getPlayers(server);
        // No need to use a function for the setLeaguePlayers but doing it just to show
        // that it can be done.
        setLeaguePlayers(() => currentLeaguePlayers);
      } catch (error) {
        newNotification(new NotificationDataBuilder()
          .withObj(error)
          .withMessage("Problem getting league players")
          .build());
      } finally {
        setIsLoading(false);
      }
      try {
        setIsLoading(true);
        const season = await seasonClient.getSeason(server, seasonId);
        if (season.players) {
          setSeasonPlayers(season.players);
        }
      } catch (error) {
        newNotification(new NotificationDataBuilder()
          .withObj(error)
          .withMessage("Problem getting season")
          .build());
      } finally {
        setIsLoading(false);
      }
    }

    init();
    // eslint-disable-next-line
  }, [])

  const addGamePlayer = async (e: any): Promise<void> => {
    e.preventDefault();
    if (activeTabKey === 'league-player') {
      if (e.target.elements.playerId.value === '0') {
        alert("Select a player");
        return;
      }
      setShowAddPlayer(false);
      try {
        const existingPlayer: AddExistingPlayerData = {
          gameId: gameId,
          playerId: parseInt('' + e.target.elements.playerId.value),
          boughtIn: e.target.elements.buyInId.checked,
          annualTocParticipant: e.target.elements.tocId.checked,
          quarterlyTocParticipant: e.target.elements.qtocId.checked
        };
        await gameClient.addExistingPlayer(server, gameId, existingPlayer);
        // TODO call this asynchronously
        await refreshGame(gameId);
      } catch (error) {
        newNotification(new NotificationDataBuilder()
          .withObj(error)
          .withMessage("Problem adding player to the game")
          .build());
      }
    } else {
      if (!e.target.elements.firstNameId.value && !e.target.elements.lastNameId.value) {
        alert("Enter a name");
        return;
      }
      setShowAddPlayer(false);
      try {
        const newPlayer: AddNewPlayerData = {
          gameId: gameId,
          firstName: e.target.elements.firstNameId.value,
          lastName: e.target.elements.lastNameId.value,
          email: e.target.elements.emailId.value,
          boughtIn: e.target.elements.buyInId.checked,
          annualTocParticipant: e.target.elements.tocId.checked,
          quarterlyTocParticipant: e.target.elements.qtocId.checked
        }
        await gameClient.addNewPlayer(server, gameId, newPlayer);
        // TODO call this asynchronously
        await refreshGame(gameId);
      } catch (error) {
        newNotification(new NotificationDataBuilder()
          .withObj(error)
          .withMessage("Problem adding player to the game")
          .build());
      }
    }
    refreshGame(gameId);
  }

  return {
    activeTabKey,
    addGamePlayer,
    isLoading,
    leaguePlayers,
    seasonPlayers,
    setActiveTabKey
  };
}

export default useAddPlayer;