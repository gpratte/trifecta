import {useEffect} from "react";
import {NotificationData} from "../model/NotificationDataBuilder";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import {clearToken, getToken, tokenExpired} from "../../utils/util";

const server = axios.create({
  baseURL: process.env.REACT_APP_SERVER_URL,
  timeout: 30000
});

export default function useLeague(seasonId : number, newNotification: (n: NotificationData) => void) {
  const navigate = useNavigate();
  useEffect(() => {
    server.interceptors.request.use(config => {
      const token = getToken();
      if (token) {
        if (tokenExpired(token)) {
          clearToken();
          navigate("/poker/login");
        } else {
          config.headers['Authorization'] = `Bearer ${token}`;
        }
      } else if ("/api/v4/login" !== config.url && "/api/v4/settings" !== config.url) {
        // login and settings do not need a token but all others do
        navigate("/poker/login");
      }
      return config;
    });

    navigate("/poker/home")

    // eslint-disable-next-line
  }, [])

  return {
    server
  };
}