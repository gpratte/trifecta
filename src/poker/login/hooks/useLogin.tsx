import loginClient from "../../clients/loginClient";
import {NotificationDataBuilder} from "../../league/model/NotificationDataBuilder";
import {LeagueContext, LeagueContextType} from "../../league/components/League";
import {useNavigate} from "react-router-dom";
import {useContext} from "react";

export default function useLogin() {
  const {server, toggleLoadingGlobal, newNotification, routePrefix} = useContext(LeagueContext) as LeagueContextType;
  const navigate = useNavigate();

  const login = async (email: string, password: string) => {
    try {
      toggleLoadingGlobal(true);
      await loginClient.login(server, email, password);
      navigate(`${routePrefix}/home`);
    } catch (error) {
      newNotification(new NotificationDataBuilder()
        .withObj(error)
        .withMessage("Problem logging in")
        .build());
    } finally {
      toggleLoadingGlobal(false);
    }
  }

  return {
    login,
  };
}