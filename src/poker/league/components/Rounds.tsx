import React from "react";
import {connect} from "react-redux";
import {Round} from "../model/LeagueDataTypes";
import _ from "lodash";
import Table from "react-bootstrap/Table";
import useRounds from "../hooks/useRounds";

// @ts-ignore
function Rounds(props) {

  const rounds: Array<Round> = props.rounds;

  useRounds();

  const renderRound = (round: Round) => {
    return (
      <tr key={round.name}>
        <td>{round.name}</td>
        <td>{round.smallBlind}</td>
        <td>{round.bigBlind}</td>
        <td>{round.ante}</td>
        <td>{round.duration}</td>
      </tr>
    )
  }

  if (_.isEmpty(rounds)) {
    return (
      <h1>No Rounds</h1>
    )
  }

  return (
    <>
      <br/>
      <Table striped bordered size="sm">
        <tbody>
        <tr>
          <th>Round</th>
          <th>Small</th>
          <th>Big</th>
          <th>Ante</th>
          <th>Time</th>
        </tr>
        {rounds.map(round => {
          return renderRound(round)
        })}
        </tbody>
      </Table>
    </>
  )
}

// @ts-ignore
function mapStateToProps(state) {
  return {
    rounds: state.rounds,
  };
}

export default connect(mapStateToProps)(Rounds);
