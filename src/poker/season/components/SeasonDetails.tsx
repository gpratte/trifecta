import {SeasonData} from "../model/SeasonDataTypes";
import {Table} from "react-bootstrap";
import {convertDateToString} from "../../utils/util";

// @ts-ignore
export default function SeasonDetails(props) {
  const season: SeasonData = props.season;
  const {start, ended, numGamesPlayed, totalCombinedAnnualTocCalculated, kittyCalculated} = season;
  const startDate = convertDateToString(start);
  const endedDate = convertDateToString(ended);
  return (
    <Table borderless={true} size="sm">
      <tbody>
      <tr>
        <td>Start date</td>
        <td>{startDate}</td>
      </tr>
      <tr>
        <td>End date</td>
        <td>{endedDate}</td>
      </tr>
      <tr>
        <td>Games</td>
        <td>{numGamesPlayed}</td>
      </tr>
      <tr>
        <td>Kitty</td>
        <td>${kittyCalculated}</td>
      </tr>
      <tr>
        <td>Annual TOC</td>
        <td>${totalCombinedAnnualTocCalculated}</td>
      </tr>
      </tbody>
    </Table>
  );
}