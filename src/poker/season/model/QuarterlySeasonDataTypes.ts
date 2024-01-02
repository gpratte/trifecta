export type QuartlerySeasonPlayerData = {
    id: number;
    playerId: number;
    seasonId: number;
    name: string;
    entries: number;
    points: number;
    place: number;
    qseasonId: number;
}
export type QuarterlySeasonPayout = {
    id: number;
    seasonId: number;
    place: number;
    amount: number;
    chopAmount: number;
}
export type QuarterlySeasonData = {
    id: number;
    seasonId: number;
    start: Array<number>;
    ended: Array<number>;
    quarter: string;
    numPayouts: number;
    qtocCollected: number;
    numGames: number;
    numGamesPlayed: number;
    finalized: boolean;
    players: Array<QuartlerySeasonPlayerData>;
    payouts: Array<QuarterlySeasonPayout>;
}