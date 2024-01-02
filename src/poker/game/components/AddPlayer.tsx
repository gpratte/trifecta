import {useContext} from "react";
import _ from "lodash";
import {Button, Form, Modal, Spinner, Tab, Tabs} from "react-bootstrap";
import {LeaguePlayerData} from "../../league/model/LeagueDataTypes";
import {SeasonPlayerData} from "../../season/model/SeasonDataTypes";
import useAddPlayer from "../hooks/useAddPlayer";
import {GameData, GamePlayerData} from "../model/GameDataTypes";
import {GameContext, GameContextType} from "./Game";

// @ts-ignore
function AddPlayer(props) {
  const game: GameData = props.game;
  const showAddPlayer: boolean = props.showAddPlayer;
  const setShowAddPlayer: (value: (((prevState: boolean) => boolean) | boolean)) => void = props.setShowAddPlayer;

  const {
    refreshGame
  } = useContext(GameContext) as GameContextType;
  const gamePlayers = game.players;

  const {
    activeTabKey,
    addGamePlayer,
    isLoading,
    leaguePlayers,
    seasonPlayers,
    setActiveTabKey
  } = useAddPlayer(game.seasonId, game.id, setShowAddPlayer, refreshGame);

  const renderPlayers = (leaguePlayers: Array<LeaguePlayerData>,
                         seasonPlayers: Array<SeasonPlayerData>,
                         gamePlayers: Array<GamePlayerData>) => {
    // Sort season players by name
    seasonPlayers.sort((sp1, sp2) => sp1.name.localeCompare(sp2.name));

    // Remove players already in game
    const playersFiltered = _.filter(leaguePlayers,
      (p: LeaguePlayerData) => {
        let index = _.findIndex(gamePlayers, function (gp: GamePlayerData) {
          return gp.playerId === p.id;
        });
        // return true if not found (i.e. the player is not
        // filtered out of the players to choose from
        return index === -1;
      }
    );

    let seasonPlayersFiltered: Array<SeasonPlayerData>;
    if (seasonPlayers) {
      // Remove season players already in game
      seasonPlayersFiltered = _.filter(seasonPlayers,
        (sp: SeasonPlayerData) => {
          let index = _.findIndex(gamePlayers, function (gp: GamePlayerData) {
            return gp.playerId === sp.playerId;
          });
          // return true if not found (i.e. the player is not
          // filtered out of the players to choose from
          return index === -1;
        }
      );
    } else {
      seasonPlayersFiltered = [];
    }

    // Remove players in that are in the season
    const playersFiltered2 = _.filter(playersFiltered,
      (p: LeaguePlayerData) => {
        let index = _.findIndex(seasonPlayersFiltered, function (sp: SeasonPlayerData) {
          return sp.playerId === p.id;
        });
        // return true if not found (i.e. the player is not
        // filtered out of the players to choose from
        return index === -1;
      }
    );

    // Separator
    if (seasonPlayersFiltered && seasonPlayersFiltered.length > 0) {
      const separator: SeasonPlayerData =
        {id: 0, playerId: 0, seasonId: 0, name: '----------------------',
         entries: 0, points: 0, place: 0, forfeit: false};
      seasonPlayersFiltered.push(separator);
    }

    const seasonPlayerMapped = seasonPlayersFiltered.map((player) => {
      const {
        id, playerId, name
      } = player;
      let ident = playerId ? playerId : id;
      return (
        <option key={ident} value={ident}>{name}</option>
      )
    })

    const playerMapped = playersFiltered2.map((player) => {
      const {
        id, firstName, lastName, name
      } = player;

      let text;
      if (!name) {
        text = firstName ? firstName : '';
        text += (firstName && lastName) ? ' ' : '';
        text += lastName ? lastName : '';
      } else {
        text = name;
      }

      let ident = id;

      return (
        <option key={ident} value={ident}>{text}</option>
      )
    })

    // Combine season players followed by players
    const allPlayersMapped = [];
    allPlayersMapped.push(...seasonPlayerMapped);
    allPlayersMapped.push(...playerMapped);
    return allPlayersMapped;
  }

  return (
    <div>
      <Modal show={showAddPlayer}
             backdrop={'static'}
             onHide={() => setShowAddPlayer(false)}>
        <Modal.Body>
          <Form onSubmit={addGamePlayer}>
            <Tabs className="style1"
                  defaultActiveKey={activeTabKey}
                  onSelect={key => setActiveTabKey(key as string)}
                  id="uncontrolled-tab-example">
              <Tab className="style2" eventKey="league-player" title="League Player&nbsp;&nbsp;&nbsp;&nbsp;">
                <Form.Group>
                  <Form.Control as="select" id="playerId">
                    {renderPlayers(leaguePlayers, seasonPlayers, gamePlayers)}
                  </Form.Control>
                </Form.Group>
              </Tab>
              <Tab className="style2" eventKey="new-player" title="&nbsp;&nbsp;&nbsp;&nbsp;New Player">
                <Form.Group>
                  <Form.Label>Name</Form.Label>
                  <Form.Control type="text" placeholder="First" id={'firstNameId'}/>
                  <Form.Control type="text" placeholder="Last" id={'lastNameId'}/>
                </Form.Group>
                <Form.Group>
                  <Form.Label>Email address</Form.Label>
                  <Form.Control type="email" placeholder="Needed to login" id={'emailId'}/>
                  <Form.Text className="text-muted">
                  </Form.Text>
                </Form.Group>
              </Tab>
            </Tabs>

            <Form.Check inline
                        type={'checkbox'}
                        id={'buyInId'}
                        label={'Buy-In'}
            />
            <Form.Check inline
                        type={'checkbox'}
                        id={'tocId'}
                        label={'Annual TOC'}
            />
            <Form.Check inline
                        type={'checkbox'}
                        id={'qtocId'}
                        label={'Quarterly TOC'}
            />
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowAddPlayer(false)}>
                Cancel
              </Button>
              <Button variant="primary" disabled={isLoading} type="submit">
                {isLoading &&
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />
                }
                Add Player
              </Button>
            </Modal.Footer>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  )
}

export default AddPlayer;