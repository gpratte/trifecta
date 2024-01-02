import {AxiosInstance} from "axios";
import {QuarterlySeasonData} from "../season/model/QuarterlySeasonDataTypes";

const quarterlySeasonClient = {
  getQuarterlies: async (server: AxiosInstance, id: number): Promise<Array<QuarterlySeasonData>> => {
    const result = await server.get(`/api/v4/seasons/${id}/quarterlies`);
    return result.data;
  }
}

export default quarterlySeasonClient;
