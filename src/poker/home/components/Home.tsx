import React from "react";
import '../style/home.css';
import {Link} from 'react-router-dom';
import Button from 'react-bootstrap/Button';

const Home = () => {
  return (
    <div>
      <br/>
      <h1>Welcome to Texas TOC</h1>
      <p>The stuff you are most interested in...</p>
      <p>
        <Link to="/poker/season">
          <Button variant="outline-secondary"> Season </Button>
        </Link>
        &nbsp;
        <Link to="/poker/current-game/0">
          <Button variant="outline-secondary"> Game </Button>
        </Link>
      </p>
      <p>The stuff you'll look at from time to time...</p>
      <p>
        <Link to="/poker/players">
          <Button variant="outline-secondary">Players</Button>
        </Link>
      </p>
      <p>The stuff you might look at once...</p>
      <p>
        <Link to="/poker/rounds">
          <Button variant="outline-secondary">Rounds</Button>
        </Link>
        &nbsp;
        <Link to="/poker/points">
          <Button variant="outline-secondary">Points</Button>
        </Link>
      </p>
    </div>
  )
}

export default Home;
