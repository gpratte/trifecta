import React from "react";
import {GameData} from "../../../game/model/GameDataTypes";
import {convertDateToString} from "../../../utils/util";
import Table from "react-bootstrap/Table";
import GameStandings from "./GameStandings";
import Payouts from "../Payouts";
import {Button} from "react-bootstrap";
import {Link} from "react-router-dom";

// @ts-ignore
function Game(props) {
  const game : GameData = props.game;
  const {date, hostName, seasonGameNum, quarterlyGameNum, totalCollected, annualTocCollected, annualTocFromRebuyAddOnCalculated, payouts, players, prizePotCalculated, quarterlyTocCollected, kittyCalculated} = game;
  const annualToc = annualTocCollected + annualTocFromRebuyAddOnCalculated;
  const gameDate = convertDateToString(date);

  return (
    <>
      <div>
        <Table borderless={true} size="sm">
          <tbody>
          <tr>
            <td>Date</td>
            <td>{gameDate}</td>
          </tr>
          <tr>
            <td>Host</td>
            <td>{hostName}</td>
          </tr>
          <tr>
            <td>Season game</td>
            <td>{seasonGameNum}</td>
          </tr>
          <tr>
            <td>Quarterly game</td>
            <td>{quarterlyGameNum}</td>
          </tr>
          <tr>
            <td>Number of players</td>
            <td>{players ? players.length : 0}</td>
          </tr>
          <tr>
            <td>Amount collected</td>
            <td>${totalCollected}</td>
          </tr>
          <tr>
            <td>TOC amount</td>
            <td>${annualToc}</td>
          </tr>
          <tr>
            <td>Quarterly TOC amount</td>
            <td>${quarterlyTocCollected}</td>
          </tr>
          <tr>
            <td>Kitty</td>
            <td>${kittyCalculated}</td>
          </tr>
          <tr>
            <td>Prize Pot</td>
            <td>${prizePotCalculated}</td>
          </tr>
          </tbody>
        </Table>

        <GameStandings players={players}/>
        <Payouts payouts={payouts}/>

        <Link to={`/current-game/${game.id}`} >
          <Button variant="outline-secondary"> Edit </Button>
        </Link>
      </div>
    </>
  )
}

export default Game