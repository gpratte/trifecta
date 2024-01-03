import React from 'react'
import Table from 'react-bootstrap/Table';
import {SeasonPlayerData} from "../model/SeasonDataTypes";

// @ts-ignore
function SeasonStandings(props) {

  const players: Array<SeasonPlayerData> = props.players;

  const renderStandings = (players: Array<SeasonPlayerData>) => {
    if (players) {
      return players.map((player, index) => {
        const {id, place, name, points, entries} = player;
        let tocPayoutEligible = false;
        if (points && points >= 250) {
          tocPayoutEligible = true;
        }
        if (entries >= 10) {
          tocPayoutEligible = true;
        }
        return (
          <tr key={id}>
            <td>{place ? place : ''}</td>
            <td>{name}</td>
            <td>{points ? points : ''}</td>
            <td>{entries}</td>
            <td>{tocPayoutEligible ? String.fromCharCode(10004) : String.fromCharCode(10005)}</td>
          </tr>
        )
      })
    }
  }

  return (
    <div>
      <Table striped bordered size="sm">
        <thead>
        <tr key={0}>
          <th><i className="fas fa-clipboard-list"/></th>
          <th>Name</th>
          <th>Points</th>
          <th>Entries</th>
          <th>TOC<br/>Payout<br/>Eligible<sup>*</sup></th>
        </tr>
        </thead>
        <tbody>
        {renderStandings(players)}
        </tbody>
      </Table>
      <p><sup>*</sup>TOC Payout Eligible: Must have played at least 10 games or have 250 points</p>
    </div>
  )
}

export default SeasonStandings
