import React from "react";
import Navbar from "react-bootstrap/Navbar";
import Col from "react-bootstrap/Col";
import {Link, useNavigate} from "react-router-dom";
import {Badge, Button, Dropdown} from "react-bootstrap";
import loginClient from "../../clients/loginClient";
import {NotificationData} from "../model/NotificationDataBuilder";

function Navigation (props: { notifications: Array<NotificationData>, showNotifications: () => void }) {
  const navigate = useNavigate();
  const signOut = () => {
    loginClient.logout();
    navigate("/poker/login");
  }

  return (
    <Navbar expand="lg" bg="dark" variant="dark">
      <Col>
        &nbsp;&nbsp;&nbsp;&nbsp;
        <Link to="/poker/home">
          <i className="nav-home fa-solid fa-house"></i>
        </Link>
        &nbsp;&nbsp;&nbsp;
        <Dropdown className={'nav-bar-right'}>
          <Dropdown.Toggle className={'nav-home'} variant="link" id="dropdown-basic">
            <i className="nav-home fa-regular fa-user"></i>
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item>
              <Button variant="link" onClick={signOut}>Log Out</Button>
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        <Dropdown className={'nav-bar-right'}>
          <Dropdown.Toggle className={'nav-home'} variant="link" id="dropdown-basic">
            <i className="nav-home fas fa-bars"/>
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item>
              <Link to="/new-game">
                <Button variant="link">New Game</Button>
              </Link>
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        {props.notifications.length === 0 &&
          <i className="nav-home fa-solid fa-bell-slash"></i>
        }
        {props.notifications.length > 0 &&
          <span style={{cursor: "pointer"}} onClick={() => props.showNotifications()}>
            <i className="nav-home fa-solid fa-bell"></i>
            <Badge bg={"warning"}>{props.notifications.length}</Badge>
          </span>
        }
      </Col>
    </Navbar>
  )
}

export default Navigation
