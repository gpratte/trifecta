import {GameData} from "../model/GameDataTypes";
import useClockPolling from "../hooks/useClockPolling";
import {Button} from "react-bootstrap";
import React from "react";

// @ts-ignore
export default function ClockPolling(props) {

  const game: GameData = props.game;

  const {
    clock,
    stepBack,
    back,
    pause,
    resume,
    forward,
    stepForward
  } = useClockPolling(game.id);

  let seconds = '' + clock.seconds;
  if (clock.seconds < 10) {
    seconds = seconds.padStart(2, '0');
  }

  return (
    <>
      <br/>
      {
        clock &&
        <div>
          <span className={'bigger-round'}>{clock.thisRound.name}</span>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <span className={'bigger-round'}>{clock.minutes}</span>:<span className={'bigger-round'}>{seconds}</span>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <span className={'bigger-round'}>{clock.thisRound.bigBlind}</span>/
          <span className={'bigger-round'}>{clock.thisRound.smallBlind}</span>/
          <span className={'bigger-round'}>{clock.thisRound.ante}</span>
          <br/>
          {
            !clock.playing &&
            <Button variant="link"
                    onClick={stepBack}>
              <i className="fas fa-step-backward"></i>
            </Button>
          }
          {
            !clock.playing &&
            <Button variant="link"
                    onClick={back}>
              <i className="fas fa-backward"></i>
            </Button>
          }
          {
            clock.playing &&
            <Button variant="link"
                    onClick={pause}>
              <i className="fas fa-pause"/>
            </Button>
          }
          {
            !clock.playing &&
            <Button variant="link"
                    onClick={resume}>
              <i className="fas fa-play"/>
            </Button>
          }
          {
            !clock.playing &&
            <Button variant="link"
                    onClick={forward}>
              <i className="fas fa-forward"/>
            </Button>
          }
          {
            !clock.playing &&
            <Button variant="link"
                    onClick={stepForward}>
              <i className="fas fa-step-forward"/>
            </Button>
          }
          <br/>
          <span>{clock.nextRound.name}</span>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <span>{clock.nextRound.bigBlind}</span>/
          <span>{clock.nextRound.smallBlind}</span>/
          <span>{clock.nextRound.ante}</span>
        </div>
      }
      <br/>
    </>
  )
}