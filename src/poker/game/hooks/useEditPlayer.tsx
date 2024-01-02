import {useContext, useState} from "react";
import {LeagueContext, LeagueContextType} from "../../league/components/League";
import gameClient from "../../clients/gameClient";
import {GamePlayerData} from "../model/GameDataTypes";
import {NotificationDataBuilder} from "../../league/model/NotificationDataBuilder";
import {GameContext, GameContextType} from "../components/Game";

function useEditPlayer(gamePlayer: GamePlayerData) {
  const {server, newNotification} = useContext(LeagueContext) as LeagueContextType;
  const {refreshGame} = useContext(GameContext) as GameContextType;

  const [accordionOpen, setAccordionOpen] = useState(false);
  const [accordionBodyKey, setAccordionBodyKey] = useState(Math.random());

  const [buyInChecked, setBuyInChecked] = useState(gamePlayer.boughtIn);
  const [rebuyChecked, setRebuyChecked] = useState(gamePlayer.rebought);
  const [annualTocChecked, setAnnualTocChecked] = useState(gamePlayer.annualTocParticipant);
  const [qTocChecked, setQTocChecked] = useState(gamePlayer.quarterlyTocParticipant);
  const [alertChecked, setAlertChecked] = useState(gamePlayer.roundUpdates);
  const [place, setPlace] = useState(gamePlayer.place);
  const [chop, setChop] = useState(gamePlayer.chop);

  const resetGamePlayer = () => {
    refreshGame(gamePlayer.gameId);
  }

  const deleteGamePlayer = async (gamePlayerId: number) => {
    try {
      await gameClient.deletePlayer(server, gamePlayer.gameId, gamePlayerId);
      refreshGame(gamePlayer.gameId);
    } catch (error) {
      newNotification(new NotificationDataBuilder()
        .withObj(error)
        .withMessage("Problem deleting player")
        .build());
    }
  }

  const updateGamePlayer = async (e: any) => {
    try {
      e.preventDefault();
      const updatedPlayer = {
        ...gamePlayer,
        boughtIn: e.target.elements.buyInId.checked,
        annualTocParticipant: e.target.elements.tocId.checked,
        quarterlyTocParticipant: e.target.elements.qtocId.checked,
        rebought: e.target.elements.rebuyId.checked,
        clockAlert: e.target.elements.clockAlertId.checked
      }
      if (e.target.elements.placeId.value) {
        updatedPlayer.place = parseInt('' + e.target.elements.placeId.value);
      }
      if (e.target.elements.chopId.value) {
        updatedPlayer.chop = parseInt('' + e.target.elements.chopId.value);
      }

      await gameClient.updatePlayer(server, updatedPlayer.gameId, updatedPlayer);
      await refreshGame(gamePlayer.gameId);
    } catch (error) {
      newNotification(new NotificationDataBuilder()
        .withObj(error)
        .withMessage("Problem updating player")
        .build());
    }
  }

  return {
    accordionOpen, setAccordionOpen,
    accordionBodyKey, setAccordionBodyKey,
    buyInChecked, setBuyInChecked,
    rebuyChecked, setRebuyChecked,
    annualTocChecked, setAnnualTocChecked,
    qTocChecked, setQTocChecked,
    alertChecked, setAlertChecked,
    place, setPlace,
    chop, setChop,
    deleteGamePlayer,
    updateGamePlayer,
    resetGamePlayer
  };
}

export default useEditPlayer;