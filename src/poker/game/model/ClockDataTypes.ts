export type RoundData = {
  name: string;
  smallBlind: number;
  bigBlind: number;
  ante: number;
  duration: number;
}
export type ClockData = {
  gameId: number;
  minutes: number;
  seconds: number;
  playing: boolean;
  thisRound: RoundData;
  nextRound: RoundData;
  millisRemaining: number;
}