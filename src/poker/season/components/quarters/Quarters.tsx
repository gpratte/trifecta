import React from "react";
import {quarterlyName} from "../../quarterlyUtils";
import {Accordion} from "react-bootstrap";
import useQuarterlySeasons from "../../hooks/useQuarterlySeasons";
import {QuarterlySeasonData} from "../../model/QuarterlySeasonDataTypes";
import {connect} from "react-redux";
import _ from "lodash";
import QuarterlySeason from "./QuarterlySeason";

// @ts-ignore
function Quarters(props) {

  const seasonId: number = props.seasonId;
  const quarterlies: Array<QuarterlySeasonData> | [] = props.quarterlies;

  useQuarterlySeasons(seasonId);

  const renderQuarters = (quarters : Array<any>) => {
    return quarters.map(quarter => {
      return (
        <Accordion.Item key={quarter.quarter} eventKey={quarterlyName(quarter.quarter)}>
          <Accordion.Header>{quarterlyName(quarter.quarter)}</Accordion.Header>
          <Accordion.Body>
            <QuarterlySeason quarter={quarter}/>
          </Accordion.Body>
        </Accordion.Item>
      )
    })
  }

  if (_.isEmpty(quarterlies)) {
    return (
      <>
        <h1>No Quarterly Season</h1>
      </>
    )
  }

  return (
    <Accordion>
      {renderQuarters(quarterlies)}
    </Accordion>
  )
}

// @ts-ignore
function mapStateToProps(state) {
  return {
    quarterlies: state.quarterlies
  };
}

export default connect(mapStateToProps)(Quarters);
