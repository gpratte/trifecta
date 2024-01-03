import React from "react";
import {LeaguePlayerData} from "../model/LeagueDataTypes";
import {obfuscateEmail, obfuscatePhone} from "../../utils/util";
import Table from "react-bootstrap/Table";
import useLeaguePlayers from "../hooks/useLeaguePlayers";
import {connect} from "react-redux";

// @ts-ignore
function LeaguePlayers(props) {

  const leaguePlayers: Array<LeaguePlayerData> = props.leaguePlayers;

  useLeaguePlayers();

  const renderLeaguePlayers = (leaguePlayers: Array<LeaguePlayerData>) => {
    if (!leaguePlayers) {
      return;
    }
    return leaguePlayers.map((leaguePlayer, index) => {
      const {id, firstName, lastName, phone, email} = leaguePlayer;
      let fullName = firstName ? firstName : '';
      fullName += firstName && lastName ? ' ' : '';
      fullName += lastName ? lastName : '';

      let obfuscatedPhone = obfuscatePhone(phone);
      let obfuscatedEmail = obfuscateEmail(email);

      return (
        <tr key={id}>
          <td>
            {fullName}
          </td>
          <td>{obfuscatedPhone}</td>
          <td>{obfuscatedEmail}</td>
        </tr>
      )
    })
  }

  return (
    <>
      <Table striped bordered size="sm">
        <thead>
        <tr>
          <th>Name</th>
          <th>Phone</th>
          <th>Email</th>
        </tr>
        </thead>
        <tbody>
        {renderLeaguePlayers(leaguePlayers)}
        </tbody>
      </Table>
      {/*TODO*/}
      {/*<EditLeaguePlayer league={league}/>*/}
    </>
  )
}

// @ts-ignore
function mapStateToProps(state) {
  return {
    leaguePlayers: state.leaguePlayers,
  };
}

export default connect(mapStateToProps)(LeaguePlayers);
