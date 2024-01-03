import {Table} from "react-bootstrap";
import {GameData, GamePayout} from "../model/GameDataTypes";
import {convertDateToString} from "../../utils/util";

// @ts-ignore
function Details(props) {
  const game: GameData = props.game;
  let {
    date, hostName, totalCollected, totalCombinedTocCalculated,
    kittyCalculated, prizePotCalculated, payouts
  } = game;

  const gameDate = convertDateToString(date);
  hostName = hostName ? hostName : 'Unknown';
  let tocPlusKitty = 0;
  if (totalCombinedTocCalculated || kittyCalculated) {
    tocPlusKitty = totalCombinedTocCalculated + kittyCalculated;
  }
  totalCollected = totalCollected ? totalCollected : 0;
  prizePotCalculated = prizePotCalculated ? prizePotCalculated : 0;
  payouts = payouts ? payouts : [];

  const renderPayouts = (payouts: Array<GamePayout>) => {
    if (!payouts) {
      return;
    }
    return payouts.map((payout: GamePayout, index: number) => {
      const {id, place, amount, chopAmount} = payout
      return (
        <tr key={id}>
          <td>{place}</td>
          {
            chopAmount &&
            <td>
              <del>${amount}</del>
              ${chopAmount}</td>
          }
          {
            !chopAmount &&
            <td>${amount}</td>
          }
        </tr>
      )
    })
  }

  return (
    <div>
      <p><span>Date: {gameDate} | Host: {hostName}</span></p>
      <p>
        <span>Money Collected: ${totalCollected} | TOC+QTOC+Kitty: ${tocPlusKitty} | POT: ${prizePotCalculated}</span>
      </p>
      <Table striped bordered size="sm">
        <thead>
        <tr>
          <th>Place</th>
          <th>Amount</th>
        </tr>
        </thead>
        <tbody>
        {renderPayouts(payouts)}
        </tbody>
      </Table>
      <hr/>
    </div>
  );


}

export default Details