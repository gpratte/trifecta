import "./info.css"
import React from "react";
import {Button} from "react-bootstrap";
import {useNavigate} from "react-router-dom";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

export default function Info() {

  const navigate = useNavigate();
  const goToBlog = () => {
    navigate("/blog");
  }
  const goToPoker = () => {
    navigate("/poker");
  }
  return (
    <div className="info-body">
      <Row>
        <Col>
          <h1>Gil Pratte</h1>
          <p>30 years of software development</p>
          <p>B.S. Mathematics at Ohio State University</p>
          <p>M.S. Computer Science at Florida State University</p>
          <p>Captain and 4 year letterman Ohio State soccer</p>
        </Col>
      </Row>
      <Row>
        <Col>
          <Button variant="link" href="https://www.linkedin.com/in/gil-pratte" >
            <i title="LinkedIn" className="fa-brands fa-linkedin fa-2x"></i>
            &nbsp;<span className="info-link-text">LinkedIn</span>
          </Button>
          &nbsp;&nbsp;&nbsp;
          <Button variant="link" href="https://github.com/gpratte" >
            <i title="GitHub" className="fa-brands fa-github-square fa-2x"></i>
            &nbsp;<span className="info-link-text">GitHub</span>
          </Button>
        </Col>
      </Row>
      <Row>
        <Col>
          <Button variant="link"
                  onClick={goToBlog} >
            <i title="Blog" className="fa-solid fa-blog fa-2x"></i>
            &nbsp;<span className="info-link-text">Blog</span>
          </Button>
          &nbsp;&nbsp;&nbsp;
          <Button variant="link"
                  onClick={goToPoker} >
            <span className="info-link-text">Poker App</span>
          </Button>
        </Col>
      </Row>
    </div>
  )
}