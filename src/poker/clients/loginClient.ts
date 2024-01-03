import {setToken, clearToken} from '../utils/util';
import {AxiosInstance} from "axios";

const loginClient = {
  login: async (server: AxiosInstance, email: string, password: string) => {
    const result = await server.post('/api/v4/login',
      {email: email, password: password},
      {
        headers: {'Content-Type': 'application/json'}
      });
    if (result.data?.token) {
      setToken(result.data.token);
    } else {
      throw new Error('Problem logging in, no token returned');
    }
  },
  logout: () => {
    clearToken();
  }
}

export default loginClient