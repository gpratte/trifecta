import {AxiosInstance} from "axios";
import {SeasonData} from "../season/model/SeasonDataTypes";

const seasonClient = {
  getCurrentSeasonId: async (server: AxiosInstance): Promise<number> => {
    const result = await server.get('/api/v4/seasons');
    if (result.data.length > 0) {
      const season: SeasonData = result.data[result.data.length - 1];
      return season.id;
    }
    return 0;
  },
  getSeason: async (server: AxiosInstance, id: number): Promise<SeasonData> => {
    const result = await server.get(`/api/v4/seasons/${id}`);
    return result.data;
  }
}

export default seasonClient;
