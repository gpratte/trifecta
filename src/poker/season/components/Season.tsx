import React, {useState} from "react";
import './season.css';
import {connect} from "react-redux";
import _ from "lodash";
import {Accordion, Tab, Tabs} from "react-bootstrap";
import {SeasonData} from "../model/SeasonDataTypes";
import SeasonDetails from "./SeasonDetails";
import SeasonStandings from "./SeasonStandings";
import Quarters from "./quarters/Quarters";
import useSeason from "../hooks/useSeason";
import Games from "./games/Games";
import {convertDateToString} from "../../utils/util";

// @ts-ignore
function Season(props) {
  const seasonId : number = props.seasonId;
  const season: SeasonData | undefined = props.season;
  const [detailsAccordionOpen, setDetailsAccordionOpen] = useState(false)

  useSeason(seasonId);

  if (_.isEmpty(season)) {
    return (
      <>
        <h1>No Season</h1>
        {/*TODO*/}
        {/*/!*<p>*!/*/}
        {/*  <Link to="/season/new">*/}
        {/*    <Button variant="outline-secondary"> Create a new season </Button>*/}
        {/*  </Link>*/}
        {/*</p>*/}
      </>
    )
  }

  const startDate = convertDateToString(season.start);
  const endedDate = convertDateToString(season.ended);

  return (
    <>
      <h3>{'' + startDate + ' - '  + endedDate}</h3>
      <Accordion>
        <Accordion.Item eventKey="0">
          <Accordion.Button onClick={() => setDetailsAccordionOpen(!detailsAccordionOpen)}>
            Details {detailsAccordionOpen && <i className="fa-solid fa-chevron-up"></i>}{!detailsAccordionOpen &&
            <i className="fa-solid fa-chevron-down"></i>}
          </Accordion.Button>
          <Accordion.Body>
            <SeasonDetails season={season}/>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>

      <SeasonStandings players={ season.players }/>

      <Tabs className="style1" defaultActiveKey="profile" id="uncontrolled-tab-example">
        <Tab className="style2" eventKey="quarters" title="&nbsp;&nbsp;&nbsp;Quarters&nbsp;&nbsp;&nbsp;">
          <Quarters seasonId={season.id}/>
        </Tab>
        <Tab className="style2" eventKey="games" title="&nbsp;&nbsp;&nbsp;Games&nbsp;&nbsp;&nbsp;">
          <Games seasonId={season?.id}/>
        </Tab>
      </Tabs>
      {/*<Finalize seasonId={season.id} finalized={season.finalized}/>*/}
    </>
  )
}

// @ts-ignore
function mapStateToProps(state) {
  return {
    season: state.season,
  };
}

export default connect(mapStateToProps)(Season);
