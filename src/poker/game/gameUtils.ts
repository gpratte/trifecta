import {GamePlayerData} from "./model/GameDataTypes";
import _ from "lodash";

export function gameOver(gamePlayers: Array<GamePlayerData>) {
  if (!gamePlayers || gamePlayers.length === 0) {
    return false;
  }
  const numPlaces = gamePlayers.length > 10 ? 10 : gamePlayers.length;
  let places = 0
  _.forEach(gamePlayers, function(gamePlayer) {
    if (gamePlayer.place && gamePlayer.place <= 10) {
      ++places;
    }
  });
  return places === numPlaces;
}

export function isThereChop(gamePlayers: Array<GamePlayerData>) {
  if (!gamePlayers) return false;
  for (let i = 0; i < gamePlayers.length; i++) {
    if (gamePlayers[i].chop) {
      return true;
    }
  }
  return false;
}
