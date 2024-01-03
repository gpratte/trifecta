import React, {Dispatch, SetStateAction} from "react";
import {Button, Col, Container, Dropdown, Row} from "react-bootstrap";
import {EntiesPerPage} from "./Blog"

// @ts-ignore
export default function BlogNavigation(props) {

  const numEntries: number = props.numEntries;
  const page: number = props.page;
  const setPage: Dispatch<SetStateAction<number>> = props.setPage;
  const numPerPage: number = props.numPerPage;
  const setNumPerPage: Dispatch<SetStateAction<number>> = props.setNumPerPage;

  const maxPage = Math.ceil(numEntries / numPerPage);
  const changeNumPerPage = (num: number) => {
    setNumPerPage(num);
  }
  const previousPage = () => {
    if (page > 1) {
      setPage(page - 1);
      window.scrollTo(0,0);
    }
  }
  const nextPage = () => {
    if (page < maxPage) {
      setPage(page + 1);
      window.scrollTo(0,0);
    }
  }

  return (
    <Container className="blog-nav">
      <Row>
        <Col />
        <Col style={{textAlign: "center"}}>
          {

          }
          {
            page > 1 &&
            <Button variant="link" onClick={previousPage}>
              <i className="fa-solid fa-circle-chevron-left fa-2x"></i>
            </Button>
          }
          {
            page <= 1 &&
            <Button variant="link" onClick={previousPage} disabled>
              <i className="fa-solid fa-circle-chevron-left fa-2x"></i>
            </Button>
          }
          &nbsp;&nbsp;&nbsp;Page {page} of {maxPage}&nbsp;&nbsp;&nbsp;
          {
            page !== maxPage &&
            <Button variant="link" onClick={nextPage}>
              <i className="fa-solid fa-circle-chevron-right fa-2x"></i>
            </Button>
          }
          {
            page === maxPage &&
            <Button variant="link" onClick={nextPage} disabled>
              <i className="fa-solid fa-circle-chevron-right fa-2x"></i>
            </Button>
          }
        </Col>
        <Col style={{textAlign: "right"}}>
          <Dropdown>
            <Dropdown.Toggle variant="dark" id="dropdown-basic">
              Number per page: {numPerPage}
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item onClick={(e) => changeNumPerPage(EntiesPerPage.FIVE)}>{EntiesPerPage.FIVE}</Dropdown.Item>
              <Dropdown.Item onClick={(e) => changeNumPerPage(EntiesPerPage.TEN)}>{EntiesPerPage.TEN}</Dropdown.Item>
              <Dropdown.Item onClick={(e) => changeNumPerPage(EntiesPerPage.TWENTY_FIVE)}>{EntiesPerPage.TWENTY_FIVE}</Dropdown.Item>
              <Dropdown.Item onClick={(e) => changeNumPerPage(EntiesPerPage.FIFTY)}>{EntiesPerPage.FIFTY}</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Col>
      </Row>
    </Container>
  )
}