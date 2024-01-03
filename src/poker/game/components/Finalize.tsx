import React from "react";
import {gameOver} from "../gameUtils";
import {Button} from "react-bootstrap";
import useFinalize from "../hooks/useFinalize";
import {GameData} from "../model/GameDataTypes";

// @ts-ignore
function Finalize(props) {

  const game: GameData = props.game;

  const {
    finalize,
    unfinalize
  } = useFinalize(game.id);

  const isGameOver = gameOver(game.players);

  if (game.finalized) {
    return (
      <Button variant="primary" onClick={unfinalize}>
        <i className="fas fa-lock"/>
      </Button>
    )
  }

  if (!isGameOver) {
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