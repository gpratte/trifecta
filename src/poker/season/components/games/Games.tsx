import React from "react";
import {connect} from "react-redux";
import {GameData} from "../../../game/model/GameDataTypes";
import useGames from "../../hooks/useGames";
import _ from "lodash";
import {Accordion} from "react-bootstrap";
import {convertDateToString} from "../../../utils/util";
import Game from "./Game";

// @ts-ignore
function Games(props) {

  const seasonId: number = props.seasonId;
  const games : Array<GameData> = props.games;

  useGames(seasonId);

  if (_.isEmpty(games)) {
    return (
      <>
        <h1>No Games</h1>
      </>
    )
  }

  const renderGames = (games: Array<GameData>) => {
    return games.map((game : GameData) => {
      return (
        <Accordion key={game.id}>
          <Accordion.Item eventKey={game.id.toString()}>
            <Accordion.Header>
              {convertDateToString(game.date)}&nbsp;&nbsp;
              {
                game.finalized && <i className="fas fa-lock"/>
              }
              {
                !game.finalized && <i className="fas fa-lock-open"/>
              }
            </Accordion.Header>
            <Accordion.Body>
              <Game game={game}/>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      )
    })
  }

  return (
    <>
      {renderGames(games)}
    </>
  )
}

// @ts-ignore
function mapStateToProps(state) {
  return {
    games: state.games
  };
}

export default connect(mapStateToProps)(Games);
