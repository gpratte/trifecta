import React from "react";
import {QuarterlySeasonPayout} from "../model/QuarterlySeasonDataTypes";
import Table from "react-bootstrap/Table";

// @ts-ignore
function Payouts(props) {

  const payouts : Array<QuarterlySeasonPayout> = props.payouts;

  const renderPayouts = (payouts : Array<QuarterlySeasonPayout>) => {
    if (payouts) {
      return payouts.map((payout, index) => {
        const {id, place, amount, chopAmount} = payout
        return (
          <tr key={id}>
            <td>{place}</td>
            {
              chopAmount &&
              <td><del>${amount}</del> ${chopAmount}</td>
            }
            {
              !chopAmount &&
              <td>${amount}</td>
            }
          </tr>
        )
      })
    }
  }

  return (
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
  )
}

export default Payouts