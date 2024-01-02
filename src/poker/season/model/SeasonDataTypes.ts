export type SeasonPlayerData = {
    id: number;
    playerId: number;
    seasonId: number;
    name: string;
    entries: number;
    points: number;
    place: number;
    forfeit: boolean;
}
export type SeasonData = {
    id: number;
    start: Array<number>;
    ended: Array<number>;
    buyInCollected: number;
    totalCombinedAnnualTocCalculated: number;
    kittyCalculated: number;
    prizePotCalculated: number;
    numGames: number;
    numGamesPlayed: number;
    finalized: boolean;
    players: Array<SeasonPlayerData>;
}