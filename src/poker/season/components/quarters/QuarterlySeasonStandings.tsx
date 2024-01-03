import React from "react";
import {QuartlerySeasonPlayerData} from "../../model/QuarterlySeasonDataTypes";
import Table from "react-bootstrap/Table";

// @ts-ignore
function QuarterlySeasonStandings(props) {

  const players : Array<QuartlerySeasonPlayerData> = props.players;
  let now = new Date();

  const renderStandings = (players: Array<QuartlerySeasonPlayerData>) => {
    if (players) {
      return players.map((player, index) => {
        const {id, place, name, points, entries} = player
        return (
          <tr key={id}>
            <td>{place ? place : ''}</td>
            <td>{name}</td>
            <td>{points ? points : ''}</td>
            <td>{entries}</td>
          </tr>
        )
      })
    }
  }

  return (
    <Table striped bordered size="sm">
      <thead>
      <tr key={now.getTime()}>
        <th><i className="fas fa-clipboard-list"/></th>
        <th>Name</th>
        <th>Points</th>
        <th>Entries</th>
      </tr>
      </thead>
      <tbody>
      {renderStandings(players)}
      </tbody>
    </Table>
  );
}

export default QuarterlySeasonStandings