import React from "react";
import {connect} from "react-redux";
import {Settings} from "../model/LeagueDataTypes";
import _ from "lodash";
import Table from "react-bootstrap/Table";
import usePoints from "../hooks/usePoints";

// @ts-ignore
function Points(props) {

  const settings : Settings = props.settings
  const points : any = settings?.points;
  const keys = points ? Object.keys(points) : null;

  usePoints();

  const renderPoints1Through10 = (point : any) => {
    return (
      <td>{point[1] ? point[1] : ''}</td>
    )
  }

  const renderPoints = (numPlayers : string, points : any) => {
    return (
      <tr key={numPlayers}>
        <td>{numPlayers}</td>
        {Object.entries(points).map(point =>
          renderPoints1Through10(point))}
      </tr>
    )
  }

  if (_.isEmpty(points)) {
    return (
      <h1>No Points</h1>
    )
  }

  return (
    <>
      <br/>
      <Table striped bordered size="sm">
        <tbody>
        <tr key={'Players'}>
          <th>Players</th>
          <th>1st</th>
          <th>2nd</th>
          <th>3rd</th>
          <th>4th</th>
          <th>5th</th>
          <th>6th</th>
          <th>7th</th>
          <th>8th</th>
          <th>9th</th>
          <th>10th</th>
        </tr>
        {keys!.map(key => {
          return renderPoints(key, points[`${key}`])
        })}
        </tbody>
      </Table>
    </>
  )
}

// @ts-ignore
function mapStateToProps(state) {
  return {
    settings: state.settings,
  };
}

export default connect(mapStateToProps)(Points);