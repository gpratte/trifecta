import React from "react";
import {Col, Container, Row} from "react-bootstrap";
import {Route, Routes} from "react-router-dom";
import Info from "./info/Info";
import Two from "./blog/Two";

function App() {
  return (
    <Container>
      <Row className="justify-content-center text-center">
        <Col>
          <Routes>
            <Route path="*" element={<Info/>}/>
            <Route path="/two" element={<Two />}/>
          </Routes>
        </Col>
      </Row>
    </Container>
  );
}

export default App;
