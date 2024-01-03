import {useContext, useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import clockClient from "../../clients/clockClient";
import {Round} from "../../league/model/LeagueDataTypes";
import {ClockData} from "../model/ClockDataTypes";
import {LeagueContext, LeagueContextType} from "../../league/components/League";

function useClockPolling(gameId: number) {
  const {server} = useContext(LeagueContext) as LeagueContextType;
  const [clock, setClock] = useState<ClockData>(initializeClock());
  const navigate = useNavigate();

  const checkClock = async () => {
    try {
      const currentClock: ClockData | null = await clockClient.getClock(server, gameId, navigate);
      setClock(currentClock);
    } catch (error) {
      // @ts-ignore
      console.log(`error getting clock ${error.message}`)
    }
  };

  useEffect(() => {
    const timer = setInterval(checkClock, 900);
    return () => {
      clearInterval(timer)
    }
    // eslint-disable-next-line
  }, [])

  const stepBack = () => {
    clockClient.stepBack(server, gameId, navigate);
  }
  const back = () => {
    clockClient.back(server, gameId, navigate);
  }
  const pause = () => {
    clockClient.pause(server, gameId, navigate);
  }
  const resume = () => {
    clockClient.resume(server, gameId, navigate);
  }
  const forward = () => {
    clockClient.forward(server, gameId, navigate);
  }
  const stepForward = () => {
    clockClient.stepForward(server, gameId, navigate);
  }

  return {
    clock,
    stepBack,
    back,
    pause,
    resume,
    forward,
    stepForward
  };
}

const initializeClock = () => {
  const thisRound: Round = {
    name: 'Round 1',
    smallBlind: 25,
    bigBlind: 50,
    ante: 0,
    duration: 20
  }
  const nextRound: Round = {
    name: 'Round 2',
    smallBlind: 50,
    bigBlind: 100,
    ante: 0,
    duration: 20
  }
  const clock: ClockData = {
    gameId: 1,
    minutes: 20,
    seconds: 0,
    playing: false,
    thisRound: thisRound,
    nextRound: nextRound,
    millisRemaining: 0
  }
  return clock;
}

export default useClockPolling;