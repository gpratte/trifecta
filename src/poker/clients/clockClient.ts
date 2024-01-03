import {NavigateFunction} from "react-router-dom";
import {ClockData} from "../game/model/ClockDataTypes";
import {AxiosInstance} from "axios";

const clockClient = {
  getClock: async (server: AxiosInstance, gameId: number, navigate: NavigateFunction): Promise<ClockData> => {
    const result = await server.get(`/api/v4/games/${gameId}/clock`);
    return result.data;
  },
  stepBack: async (server: AxiosInstance, gameId: number, navigate: NavigateFunction): Promise<void> => {
    await clockClient.clockControl(server, 'clock-step-back', gameId, navigate);
  },
  back: async (server: AxiosInstance, gameId: number, navigate: NavigateFunction): Promise<void> => {
    await clockClient.clockControl(server, 'clock-back', gameId, navigate);
  },
  pause: async (server: AxiosInstance, gameId: number, navigate: NavigateFunction): Promise<void> => {
    await clockClient.clockControl(server, 'clock-pause', gameId, navigate);
  },
  resume: async (server: AxiosInstance, gameId: number, navigate: NavigateFunction): Promise<void> => {
    await clockClient.clockControl(server, 'clock-resume', gameId, navigate);
  },
  forward: async (server: AxiosInstance, gameId: number, navigate: NavigateFunction): Promise<void> => {
    await clockClient.clockControl(server, 'clock-forward', gameId, navigate);
  },
  stepForward: async (server: AxiosInstance, gameId: number, navigate: NavigateFunction): Promise<void> => {
    await clockClient.clockControl(server, 'clock-step-forward', gameId, navigate);
  },
  clockControl: async (server: AxiosInstance, action: string, gameId: number, navigate: NavigateFunction): Promise<void> => {
    await server.post('/api/v4/games/' + gameId + '/clock', {}, {
      headers: {
        'Content-Type': `application/vnd.texastoc.${action}+json`
      }
    });
  }
}

export default clockClient;
