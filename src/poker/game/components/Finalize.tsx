import React from "react";
import {areAllPlacesAssigned} from "../gameUtils";
import {Button} from "react-bootstrap";
import useFinalize from "../hooks/useFinalize";
import {GameData} from "../model/GameDataTypes";
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

// @ts-ignore
function Finalize(props) {

  const game: GameData = props.game;

  const {
    finalize,
    unfinalize
  } = useFinalize(game.id);

  const isAllPlacesAssigned = areAllPlacesAssigned(game.players);

  if (game.finalized) {
    return (
      <OverlayTrigger
        placement={"top"}
        overlay={
          <Tooltip>
            Press to unlock
          </Tooltip>
        }
      >
        <Button variant="primary" onClick={unfinalize}>
          <i className="fas fa-lock"/>
        </Button>
      </OverlayTrigger>
    )
  }

  if (!isAllPlacesAssigned) {
    return null;
  }

  return (
    <div>
      <Button variant="primary" onClick={finalize}>
        End game  <i className="fas fa-lock-open"/>
      </Button>
    </div>
  )
}

export default Finalize