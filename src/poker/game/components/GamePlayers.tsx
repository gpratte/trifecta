import {Button, Table} from "react-bootstrap";
import AddPlayer from "./AddPlayer";
import React from "react";
import EditPlayer from "./EditPlayer";
import {GameData, GamePlayerData} from "../model/GameDataTypes";
import useGamePlayers from "../hooks/useGamePlayers";
import {areAllPlacesAssigned, isThereChop} from "../gameUtils";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Finalize from "./Finalize";

// @ts-ignore
function GamePlayers(props) {
  const game: GameData = props.game;
  const isAllPlacesAssigned = areAllPlacesAssigned(game.players);

  const {
    showAddPlayer,
    setShowAddPlayer
  }: { setShowAddPlayer: (value: (((prevState: boolean) => boolean) | boolean)) => void; showAddPlayer: boolean } = useGamePlayers();

  const gamePlayers = game.players;
  const isChop = isThereChop(gamePlayers);
  const numPaidPlayers = game.numPaidPlayers;

  const renderGamePlayers = (gamePlayers: Array<GamePlayerData>, isChop: boolean) => {
    if (!gamePlayers) {
      return;
    }

    return gamePlayers.map((gamePlayer: GamePlayerData, index: number) => {
      const {
        id, boughtIn, rebought, annualTocParticipant,
        quarterlyTocParticipant, chop, tocPoints, tocChopPoints,
        qtocPoints, qtocChopPoints, place} = gamePlayer;
      let originalPoints;
      let points;
      if (tocChopPoints) {
        points = tocChopPoints;
        originalPoints = tocPoints;
      } else if (qtocChopPoints) {
        points = qtocChopPoints;
        originalPoints = qtocPoints;
      } else if (tocPoints) {
        points = tocPoints;
      } else if (qtocPoints) {
        points = qtocPoints;
      }
      return (
        <tr key={id}>
          <td>{place ? (place < 11 ? place : '') : ''}</td>
          <td>
            <EditPlayer key={gamePlayer.id} gamePlayer={gamePlayer} gamePlayers={gamePlayers}/>
          </td>
          <td>{boughtIn ? String.fromCharCode(10004) : ''}</td>
          <td>{rebought ? String.fromCharCode(10004) : ''}</td>
          <td>{annualTocParticipant ? String.fromCharCode(10004) : ''}</td>
          <td>{quarterlyTocParticipant ? String.fromCharCode(10004) : ''}</td>
          {
            isChop && <td>{chop ? chop : ''}</td>
          }
          {
            originalPoints && <td>
              <del>{originalPoints}</del>
              {points}</td>
          }
          {
            !originalPoints && <td>{points ? points : ''}</td>
          }
        </tr>
      )
    })
  }

  // @ts-ignore
  return (
    <div>
      <p>Paid Players: {numPaidPlayers}</p>
      <Table striped bordered size="sm">
        <thead>
        <tr>
          <th><i className="fa-solid fa-clipboard-list"></i></th>
          <th>Name</th>
          <th>B<br/>u<br/>y<br/>I<br/>n</th>
          <th>R<br/>e<br/>B<br/>u<br/>y</th>
          <th>T<br/>O<br/>C</th>
          <th>Q<br/>T<br/>O<br/>C</th>
          {
            isChop && <th>Chop</th>
          }
          <th>Pts</th>

        </tr>
        </thead>
        <tbody>
        {renderGamePlayers(gamePlayers, isChop)}
        </tbody>
      </Table>

      <Container>
        <Row>
          {
            !game.finalized && !isAllPlacesAssigned &&
            <Col>
              <AddPlayer showAddPlayer={showAddPlayer} setShowAddPlayer={setShowAddPlayer} game={game}/>
              <div>
                <Button variant="primary" onClick={() => setShowAddPlayer(true)}>
                  Add Player
                </Button>
              </div>
            </Col>
          }
          {
            !game.finalized && isAllPlacesAssigned &&
            <Col className="d-flex justify-content-end">
              <AddPlayer showAddPlayer={showAddPlayer} setShowAddPlayer={setShowAddPlayer} game={game}/>
              <div>
                <Button variant="primary" onClick={() => setShowAddPlayer(true)}>
                  Add Player
                </Button>
              </div>
            </Col>
          }
          {
            game.finalized && isAllPlacesAssigned &&
            <Col>
              <Finalize game={game}/>
            </Col>
          }
          {
            !game.finalized && isAllPlacesAssigned &&
            <Col className="d-flex justify-content-start">
              <Finalize game={game}/>
            </Col>
          }
        </Row>
      </Container>
    </div>
  )
}

export default GamePlayers;