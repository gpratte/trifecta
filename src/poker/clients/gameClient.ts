import {AxiosInstance} from "axios";
import {
  AddExistingPlayerData,
  AddNewPlayerData,
  GameData,
  GamePlayerData,
  NewGameData
} from "../game/model/GameDataTypes";

const gameClient = {
  getGames: async (server: AxiosInstance, seasonId: number): Promise<Array<GameData>> => {
    const result = await server.get(`/api/v4/seasons/${seasonId}/games`);
    return result.data;
  },
  getGame: async (server: AxiosInstance, id: number): Promise<GameData> => {
    const result = await server.get(`/api/v4/games/${id}`);
    return result.data;
  },
  addExistingPlayer: async (server: AxiosInstance, gameId: number, player: AddExistingPlayerData): Promise<GamePlayerData> => {
    const result = await server.post(`/api/v4/games/${gameId}/players`,
      player,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      });
    return result.data;
  },
  addNewPlayer: async (server: AxiosInstance, gameId: number, player: AddNewPlayerData): Promise<GamePlayerData> => {
    const result = await server.post(`/api/v4/games/${gameId}/players`,
      player,
      {
        headers: {
          'Content-Type': 'application/vnd.texastoc.first-time+json'
        }
      });
    return result.data;
  },
  updatePlayer: async (server: AxiosInstance, gameId: number, gamePlayer: GamePlayerData): Promise<GamePlayerData> => {
    const result = await server.patch(`/api/v4/games/${gameId}/players/${gamePlayer.id}`,
      gamePlayer,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      });
    return result.data;
  },
  deletePlayer: async (server: AxiosInstance, gameId: number, gamePlayerId: number): Promise<void> => {
    await server.delete(`/api/v4/games/${gameId}/players/${gamePlayerId}`);
  },
  finalize: async (server: AxiosInstance, gameId: number): Promise<void> => {
    await server.put(`/api/v4/games/${gameId}`,
      {},
      {
        headers: {
          'Content-Type': 'application/vnd.texastoc.finalize+json'
        }
      });
  },
  unfinalize: async (server: AxiosInstance, gameId: number): Promise<void> => {
    await server.put(`/api/v4/games/${gameId}`,
      {},
      {
        headers: {
          'Content-Type': 'application/vnd.texastoc.unfinalize+json'
        }
      });
  },
  addNewGame: async (server: AxiosInstance, seasonId: number, month: number, day: number, year: number, hostId: number): Promise<GameData> => {
    const monthText = ('' + ++month).padStart(2, '0');
    const dayText = ('' + day).padStart(2, '0');
    const createGameRequest: NewGameData = {
      hostId: hostId,
      date: year + '-' + monthText + '-' + dayText,
      transportRequired: false
    };
    const result = await server.post(`/api/v4/seasons/${seasonId}/games`,
      createGameRequest, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    return result.data;
  }
}

export default gameClient;