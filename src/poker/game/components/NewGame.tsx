import "react-datepicker/dist/react-datepicker.css";
import React from "react";
import {Button, Form} from "react-bootstrap";
import {LeaguePlayerData} from "../../league/model/LeagueDataTypes";
import useNewGame from "../hooks/useNewGame";
// @ts-ignore
import DatePicker from "react-datepicker";

function NewGame() {

  const {
    startDate,
    setStartDate,
    leaguePlayers,
    addNewGame
  } = useNewGame();

  const renderPlayers = (players: Array<LeaguePlayerData>) => {
    return players.map((player, index) => {
      const {
        id, firstName, lastName
      } = player;
      return (
        <option key={id} value={id}>{firstName}{(firstName && lastName) ? ' ' : ''}{lastName}</option>
      )
    })
  }

  return (
    <div>
      <br/>
      <h1>New Game</h1>
      <br/>
      <Form onSubmit={addNewGame}>
        <Form.Group>
          <Form.Label>Date</Form.Label>
          <br/>
          <DatePicker
            selected={startDate}
            onChange={setStartDate}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Host</Form.Label>
          <Form.Control as="select" id="hostId">
            {renderPlayers(leaguePlayers)}
          </Form.Control>
        </Form.Group>
        <br/>
        <Button variant="primary" type="submit">New Game</Button>
      </Form>
    </div>
  )
}

export default NewGame
