/** @jsxImportSource $react */
/** @jsxRuntime automatic */

import { Character, CharacterKind } from "../../character.ts";
import { keys } from "../../utils.ts";
import { Component } from "$react";
import { Navigate } from "$react-router";
import { Button, ButtonGroup, Card, Col, Container, Form, Nav, Navbar, NavDropdown, Offcanvas, Row } from "$react-bootstrap";
import { Alert } from "./dialog/alert.ts";
import { Confirm } from "./dialog/confirm.ts";
import { dialog } from "./dialog/dialog.ts";
import { format } from "./fields/common.tsx";
import { locale } from "./i18n/locale.ts";
import { allCharacters, getCharacter, myId, removeCharacter, saveCharacter } from "./services/characterService.ts";
import { isDark, dark } from "./services/preferencesService.ts";
import { observeCharacter } from "./services/webSocketService.ts";

export class Home extends Component<{}, {
  showOffcanvas: boolean,
  dark: boolean,
  characters: Record<string, Character>,
  redirect?: string,
}> {
  constructor() {
    super({});

    const characters: Record<string, Character> = {}

    for (const key of allCharacters()) {
      characters[key] = getCharacter(key);
    }

    this.state = {
      showOffcanvas: false,
      dark: isDark(),
      characters
    }

    observeCharacter(character => {
      if (this.state.characters[character._id]) {
        this.state.characters[character._id] = character;
        this.setState({ characters: this.state.characters });
      }
    });
  }

  private onSwitchDark(value: boolean): void {
    dark(value);
    this.setState({ dark: value });
  }

  private async onOwnership(character: Character, owner: boolean) {
    character.owner = myId;
    this.state.characters[character._id].owner = myId;
    saveCharacter(character);
    this.setState({ characters: this.state.characters });
    await dialog(new Alert(format(owner ? locale.takeOwnership : locale.leaveOwnership, character.name)));
  }

  private async onRemove(character: Character): Promise<void> {
    if (await dialog(new Confirm(format(locale.onRemove.characters, character.name)))) {
      removeCharacter(character._id);
      delete this.state.characters[character._id];
      this.setState({ characters: this.state.characters });
    }
  }

  private parseKind(kind: CharacterKind): string {
    let result = "";

    switch (kind) {
      case CharacterKind.Vampire:
        result = "vampire";
        break;
      case CharacterKind.Werewolf:
        result = "werewolf";
        break;
    }

    return result
  }

  public override render() {
    if (this.state.redirect) {
      return <Navigate to={this.state.redirect} replace />;
    }

    const array = keys(this.state.characters);

    return <><Navbar expand className="bg-body-tertiary border-bottom">
      <Nav className="me-auto">
        <NavDropdown title={<i className="bi bi-person-fill-add" />} drop="end">
          <NavDropdown.Item href="#/vampire">{locale.vampire}</NavDropdown.Item>
          <NavDropdown.Item href="#/werewolf">{locale.werewolf}</NavDropdown.Item>
        </NavDropdown>
      </Nav>
      <Nav className="ms-auto">
        <Nav.Link onClick={() => this.setState({ showOffcanvas: true })}>
          <i className="bi bi-person-badge" />
        </Nav.Link>
      </Nav>
    </Navbar><Offcanvas show={this.state.showOffcanvas} placement="end" onHide={() => this.setState({ showOffcanvas: false })}>
        <Offcanvas.Header closeButton />
        <Offcanvas.Body className="d-flex flex-column">
          <div className="mt-auto border-top pt-3">
            <Form.Check className="mb-2" onChange={e => this.onSwitchDark(e.target.checked)} defaultChecked={this.state.dark}
              type="switch"
              label={<i className={`bi ${this.state.dark ? "bi-moon-fill" : "bi-sun-fill"}`} />}
            />
          </div>
        </Offcanvas.Body>
      </Offcanvas>{array.length == 0 && <Container>
        <Row className="text-center p-5">
          <h3 className="mt-3">{locale.emptyCharacters}</h3>
          <p className="text-muted">{locale.addCharacters}</p>
          <a className="btn btn-primary mt-2" href="#/vampire">{locale.createVampire}</a>
          <a className="btn btn-primary mt-2" href="#/werewolf">{locale.createWerewolf}</a>
        </Row>
      </Container>}<Container className="mt-3">
        <Row className="g-3">
          {array.map(key => {
            const character = this.state.characters[key];
            const path = this.parseKind(character.kind);
            const characterKey = btoa(character._id);
            return <Col lg={2} sm={2} xs={6} key={`character-${character._id}`}><Card className="h-100"
              onClick={() => this.setState({ redirect: `/${path}?key=${characterKey}` })}>
              <Card.Img variant="top" src={character.image} />
              <Card.Body>
                <Card.Title><a onClick={e => e.stopPropagation()} href={`#/${path}?key=${characterKey}`}>{character.name}</a></Card.Title>
                <Card.Text><Row className="align-items-center mb-1">
                  <Col className="text-end">
                    <b>{locale.player}:</b>
                  </Col>
                  <Col className="text-start">{character.player}</Col>
                </Row></Card.Text>
                <ButtonGroup>
                  <Button variant={character.owner === null ? "outline-secondary" : "secondary"} onClick={async e => {
                    e.stopPropagation();
                    await this.onOwnership(character, character.owner === null);
                  }}><i className={`bi ${character.owner === null ? "bi-person-fill-lock" : "bi-person-fill-x"}`} /></Button>
                  <Button variant="danger" onClick={async e => {
                    e.stopPropagation();
                    await this.onRemove(character);
                  }}><i className="bi bi-trash3" /></Button>
                </ButtonGroup>
              </Card.Body>
            </Card></Col>
          })}
        </Row>
      </Container></>;
  }
}
