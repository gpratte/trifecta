import '../style/league.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import React, {createContext} from "react";
import {connect} from "react-redux";
import {Route, Routes} from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Home from "../../home/components/Home";
import Game from "../../game/components/Game";
import NewGame from "../../game/components/NewGame";
import Season from "../../season/components/Season";
import Loading from "../../common/components/Loading";
import Login from "../../login/components/Login";
import useNotifications from "../hooks/useNotifications";
import {NotificationData} from "../model/NotificationDataBuilder";
import useLeague from "../hooks/useLeague";
import Navigation from "./Navigation";
import ErrorNotification from "./ErrorNotification";
import Notifications from "./Notifications";
import Footer from "./Footer";
import LeaguePlayers from "./LeaguePlayers";
import Rounds from "./Rounds";
import Points from "./Points";
import {AxiosInstance} from "axios";
import {Modal} from "react-bootstrap";
import Button from "react-bootstrap/Button";
import {prefixRoute} from "../../utils/util";

export interface LeagueContextType {
  newNotification(notify: NotificationData): void;
  isGlobalLoading: boolean;
  toggleLoadingGlobal(show: boolean): void;
  server: AxiosInstance;
  routePrefix: string;
}
export const LeagueContext = createContext<LeagueContextType | null>(null);

// @ts-ignore
function League(props) {

  const seasonId : number = props.seasonId;
  const routePrefix: string = prefixRoute();

  const {
    newNotification,
    toggleLoadingGlobal,
    notification,
    notifications,
    showNotifications,
    closeNotification,
    deleteNotification,
    deleteAllNotifications,
    showNotificationsPanel,
    hideNotificationsPanel,
    isGlobalLoading
  } = useNotifications(30000);

  const {
    server,
    isFirstTime,
    setIsFirstTime
  } = useLeague(seasonId, newNotification, routePrefix);

  const handleClose = () => setIsFirstTime(false);

  return (
    <LeagueContext.Provider value={{server, newNotification, isGlobalLoading,
      toggleLoadingGlobal, routePrefix}}>
      <div>
        <Loading isLoading={isGlobalLoading}/>
        <Navigation notifications={notifications} showNotifications={showNotificationsPanel}/>
        <Container className="main-view">
          <Row className="justify-content-center text-center">
            <Col>
              <ErrorNotification notification={notification}
                                 deleteNotification={deleteNotification}
                                 closeNotification={closeNotification}
              />
              <Notifications show={showNotifications}
                             hide={hideNotificationsPanel}
                             deleteNotification={deleteNotification}
                             deleteAllNotifications={deleteAllNotifications}
                             notifications={notifications}/>
            </Col>
          </Row>
          <Row>
            <Col>
              <Modal show={isFirstTime} onHide={handleClose}>
                <Modal.Body>Welcome to (a staging version of) my poker application.
                  <br/><br/>
                  The production version can be found at www.texastoc.com since 2004.
                  <br/><br/>
                  Once a game has
                  <ul>
                    <li>1st through 10th place assigned if 10 or more players </li>
                    <li>all places assigned if less than 10 players </li>
                  </ul>
                  then the game can be ended which will adjust the season standings.
                  <br/><br/>
                  Login with email "guest@gilpratte.com" password "password"
                  <br/><br/>
                  Refresh the browser to see this message again.
                </Modal.Body>
                <Modal.Footer style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}>
                  <Button variant="primary" onClick={handleClose}>
                    Close
                  </Button>
                </Modal.Footer>
              </Modal>
            </Col>
          </Row>
          <Row className="justify-content-center text-center">
            <Col>
              <Routes>
                <Route path="/home" element={<Home />} />
                <Route path='/login' element={<Login />} />
                <Route path="/current-game" element={<Game seasonId={seasonId}/>} />
                <Route path="/current-game/:editGameId" element={<Game seasonId={seasonId}/>} />
                <Route path="/new-game" element={<NewGame />} />
                <Route path="/season" element={<Season seasonId={seasonId}/>} />
                <Route path="/players" element={<LeaguePlayers />} />
                <Route path="/rounds" element={<Rounds />} />
                <Route path="/points" element={<Points />} />
              </Routes>
            </Col>
          </Row>
          <Row className="justify-content-center text-center">
            <Col>
              <Footer/>
            </Col>
          </Row>
        </Container>
      </div>
    </LeagueContext.Provider>
  )
}

// @ts-ignore
function mapStateToProps(state) {
  return {
    seasonId: state.seasonId,
  };
}

export default connect(mapStateToProps)(League);
