export type Role = {
  id: number;
  type: string;
}

export type LeaguePlayerData = {
  id : number;
  firstName? : string;
  lastName? : string;
  phone? : string;
  email? : string;
  roles?: Array<Role>;
  name? : string;
}

export type Round = {
  name : string;
  smallBlind : number;
  bigBlind : number;
  ante : number;
  duration : number;
}

export type Settings = {
  id: number;
  version: any;
  tocConfigs : any;
  payouts : any;
  // TODO asked about this in slack
  points: any;
}
