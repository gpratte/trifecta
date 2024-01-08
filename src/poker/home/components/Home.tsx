import React, {useContext} from "react";
import '../style/home.css';
import {Link} from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import {LeagueContext, LeagueContextType} from "../../league/components/League";

const Home = () => {
  const {routePrefix} = useContext(LeagueContext) as LeagueContextType;
  return (
    <div>
      <br/>
      <h1>Welcome to Texas TOC</h1>
      <p>The stuff you are most interested in...</p>
      <p>
        <Link to={`${routePrefix}/season`}>
          <Button variant="outline-secondary"> Season </Button>
        </Link>
        &nbsp;
        <Link to={`${routePrefix}/current-game/0`}>
          <Button variant="outline-secondary"> Game </Button>
        </Link>
      </p>
      <p>The stuff you'll look at from time to time...</p>
      <p>
        <Link to={`${routePrefix}/players`}>
          <Button variant="outline-secondary">Players</Button>
        </Link>
      </p>
      <p>The stuff you might look at once...</p>
      <p>
        <Link to={`${routePrefix}/rounds`}>
          <Button variant="outline-secondary">Rounds</Button>
        </Link>
        &nbsp;
        <Link to={`${routePrefix}/points`}>
          <Button variant="outline-secondary">Points</Button>
        </Link>
      </p>
    </div>
  )
}

export default Home;
