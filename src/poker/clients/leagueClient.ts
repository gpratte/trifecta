import {AxiosInstance} from "axios";
import {LeaguePlayerData, Round, Settings} from "../league/model/LeagueDataTypes";

const leagueClient = {
  getPlayers: async (server: AxiosInstance): Promise<Array<LeaguePlayerData>> => {
    const result = await server.get('/api/v4/players');
    return result.data;
  },
  getPlayer: async (server: AxiosInstance, id: number): Promise<LeaguePlayerData> => {
    const result = await server.get(`/api/v4/players/${id}`);
    return result.data;
  },
  getRounds: async (server: AxiosInstance): Promise<Array<Round>> => {
    const result = await server.get('/api/v4/clock/rounds');
    return result.data;
  },
  getSettings: async (server: AxiosInstance): Promise<Settings> => {
    const result = await server.get('/api/v4/settings');
    return result.data;
  }
}

export default leagueClient;
