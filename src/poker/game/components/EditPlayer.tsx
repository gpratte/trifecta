import '../../common/style/common.css'
import _ from "lodash";
import {useRef} from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import {Accordion, Button, Form} from "react-bootstrap";
import Container from "react-bootstrap/Container";
import ErrorBoundary from "../../common/components/ErrorBoundry";
import useEditPlayer from "../hooks/useEditPlayer";
import {GamePlayerData} from "../model/GameDataTypes";

function EditPlayerNoBoundry(props: {gamePlayer: GamePlayerData, gamePlayers: Array<GamePlayerData>}) {
  const accordionRef = useRef(null);
  const {accordionOpen, setAccordionOpen,
    accordionBodyKey, setAccordionBodyKey,
    buyInChecked, setBuyInChecked,
    rebuyChecked, setRebuyChecked,
    annualTocChecked, setAnnualTocChecked,
    qTocChecked, setQTocChecked,
    alertChecked, setAlertChecked,
    setPlace,
    chop, setChop,
    updateGamePlayer,
    deleteGamePlayer,
    resetGamePlayer} = useEditPlayer(props.gamePlayer);

  const update = (e: any) => {
    // @ts-ignore
    accordionRef.current.click();
    updateGamePlayer(e);
  }

  const renderPlaces = (gamePlayer: GamePlayerData, gamePlayers: Array<GamePlayerData>) => {
    // Build an array of the places taken
    const taken = [];
    for (const gp of gamePlayers) {
      if (gp.id === gamePlayer.id) {
        continue;
      }
      if (gp.place && gp.place < 11) {
        taken.push(gp.place);
      }
    }

    const numPlaces = Math.min(gamePlayers.length, 10);
    let placesLeft = [];
    for (let i = 1; i <= numPlaces; i++) {
      if (!taken.includes(i)) {
        placesLeft.push(i);
      }
    }

    return placesLeft.map((place) => {
      return (
        <option key={place} label={_.toString(place)} value={place}>{place}</option>
      )
    })
  }

  return (
    <Accordion flush>
      <Accordion.Item eventKey="0">
        <Accordion.Button ref={accordionRef} onClick={() => {
          const wasOpen = accordionOpen;
          setAccordionOpen(!accordionOpen);
          if (wasOpen) {
            resetGamePlayer();
            // Change the key and the body component will refresh
            setAccordionBodyKey(Math.random())
          }
        }}>
          {props.gamePlayer.roundUpdates ? <i className="fa-solid fa-bell"></i> : ''} {props.gamePlayer.name}
        </Accordion.Button>
        <Accordion.Body key={accordionBodyKey}>
          <Form onSubmit={update}>
            <Form.Control type={'hidden'} id={'gamePlayerId'} value={props.gamePlayer.id}/>
            <Form.Group style={{margin: "10px"}}>
              <Form.Check inline
                          onClick={() => setBuyInChecked(!buyInChecked)}
                          type={'checkbox'}
                          id={'buyInId'}
                          label={'Buy-In'}
                          defaultChecked={buyInChecked}
              />
              <Form.Check inline
                          onClick={() => setRebuyChecked(!rebuyChecked)}
                          type={'checkbox'}
                          id={'rebuyId'}
                          label={'Rebuy'}
                          defaultChecked={rebuyChecked}
              />
            </Form.Group>
            <Form.Group style={{margin: "10px"}}>
              <Form.Check inline
                          onClick={() => setAnnualTocChecked(!annualTocChecked)}
                          type={'checkbox'}
                          id={'tocId'}
                          label={'Annual TOC'}
                          defaultChecked={annualTocChecked}
              />
              <Form.Check inline
                          onClick={() => setQTocChecked(!qTocChecked)}
                          type={'checkbox'}
                          id={'qtocId'}
                          label={String.fromCharCode(188) + ' TOC'}
                          defaultChecked={qTocChecked}
              />
            </Form.Group>
            <Form.Group style={{margin: "10px"}}>
              <Form.Check inline
                          onClick={() => setAlertChecked(!alertChecked)}
                          type={'checkbox'}
                          id={'clockAlertId'}
                          label={'Clock Alert'}
                          defaultChecked={alertChecked}
              />
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label>&nbsp;&nbsp;Place</Form.Label>
              <Col>
                <Form.Control style={{textAlign: "center"}}
                              onChange={(e) => setPlace(Number.parseInt(e.target.value))}
                              as="select"
                              defaultValue={props.gamePlayer.place ? props.gamePlayer.place : 11}
                              id="placeId">
                  <option key={11} value={11}>---</option>
                  {renderPlaces(props.gamePlayer, props.gamePlayers)}
                </Form.Control>
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label>&nbsp;&nbsp;Chop</Form.Label>
              <Col>
                <Form.Control style={{textAlign: "center"}}
                              onChange={(e) => setChop(Number.parseInt(e.target.value))}
                              as="input"
                              defaultValue={chop}
                              placeholder={"Chop amount"}
                              id="chopId"/>
              </Col>
            </Form.Group>
            <Container style={{marginTop: "20px"}}>
              <Row>
                <Col>
                  <Button variant="danger" onClick={() => {
                    // eslint-disable-next-line no-restricted-globals
                    const doit = confirm('are you sure?');
                    if (doit) {
                      // @ts-ignore
                      accordionRef.current.click();
                      deleteGamePlayer(props.gamePlayer.id);
                    }
                  }}>
                    Delete
                  </Button>
                </Col>
                <Col>
                  <Button variant="secondary" onClick={() => {
                    // @ts-ignore
                    accordionRef.current.click();
                  }}>
                    Cancel
                  </Button>
                </Col>
                <Col>
                  <Button variant="primary" type="submit">
                    Update
                  </Button>
                </Col>
              </Row>
            </Container>
          </Form>
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  )
}

function EditPlayer(props: {gamePlayer: GamePlayerData, gamePlayers: Array<GamePlayerData>}) {
  return (
    <ErrorBoundary customUI={<div>Something is amiss <i className="fa-solid fa-triangle-exclamation"></i></div>}>
      <EditPlayerNoBoundry {...props} ></EditPlayerNoBoundry>
    </ErrorBoundary>
  )
}

export default EditPlayer;