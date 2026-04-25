/** @jsxImportSource $react */
/** @jsxRuntime automatic */

import { Character, CharacterKind } from "../../domain/character.ts";
import { DiscordUser } from "../../types.ts";
import { keys } from "../../utils.ts";
import { BsImage, Button, ButtonGroup, Card, Col, Component, Container, Form, Nav, Navbar, NavDropdown, Navigate, Offcanvas, Row } from "./deps.ts";
import { Alert } from "./dialog/alert.ts";
import { Confirm } from "./dialog/confirm.ts";
import { dialog } from "./dialog/dialog.ts";
import { ImportShareCode } from "./dialog/importShareCode.tsx";
import { format } from "./fields/common.tsx";
import { locale } from "./i18n/locale.ts";
import { allCharacters, getCharacter, removeCharacter, ownership, importCharacter } from "./services/characterService.ts";
import { activitySignIn, avatar, discordSignOut, discordUser, isActivity } from "./services/discordService.ts";
import { isDark, dark, isBot, bot } from "./services/preferencesService.ts";
import { observeCharacter } from "./services/webSocketService.ts";

export class Home extends Component<{}, {
  user: DiscordUser | null;
  showOffcanvas: boolean,
  dark: boolean,
  bot: boolean,
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
      user: discordUser(),
      showOffcanvas: false,
      dark: isDark(),
      bot: isBot(),
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

  private onSwitchBot(value: boolean): void {
    bot(value);
    this.setState({ bot: value });
  }

  private async onOwnership(character: Character, owner: boolean) {
    this.state.characters[character._id].owner = await ownership(character._id, owner);
    this.setState({ characters: this.state.characters });
    await dialog(new Alert(format(owner ? locale.takeOwnership : locale.leaveOwnership, character.name)));
  }

  private async onShareCode(character: Character) {
    if (isActivity) {
      await dialog(new Alert(format(locale.shareCodeActivity, character._id, character.name)));
    }
    else {
      await navigator.clipboard.writeText(character._id);
      await dialog(new Alert(format(locale.shareCodeCopied, character.name)));
    }
  }

  private async onRemove(character: Character): Promise<void> {
    if (await dialog(new Confirm(format(locale.onRemove.characters, character.name)))) {
      removeCharacter(character._id);
      delete this.state.characters[character._id];
      this.setState({ characters: this.state.characters });
    }
  }

  private async onSignOut() {
    if (await dialog(new Confirm(locale.confirmSignOut))) {
      discordSignOut();
      this.setState({ user: null });
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

  private async onImportShareCode() {
    const code = await dialog(new ImportShareCode());
    if (code) {
      const character = await importCharacter(code);
      if (character) {
        this.state.characters[character._id] = character;
        this.setState({ characters: this.state.characters });
      }
    }
  }

  public override render() {
    if (this.state.redirect) {
      return <Navigate to={this.state.redirect} replace />;
    }

    const array = keys(this.state.characters);

    const image = this.state.user ? avatar(this.state.user) : null;

    return <><Navbar expand className="bg-body-tertiary border-bottom">
      <Nav className="me-auto">
        <NavDropdown title={<i className="bi bi-person-fill-add" />} drop="end">
          <NavDropdown.Item href="#/vampire">{locale.vampire}</NavDropdown.Item>
          <NavDropdown.Item href="#/werewolf">{locale.werewolf}</NavDropdown.Item>
          <NavDropdown.Divider />
          <NavDropdown.Item onClick={async () => await this.onImportShareCode()}>{locale.importShareCode}</NavDropdown.Item>
        </NavDropdown>
      </Nav>
      <Nav className="ms-auto">
        <Nav.Link onClick={() => this.setState({ showOffcanvas: true })}>{image ?
          <BsImage className="avatar" src={image} roundedCircle /> : <i className="bi bi-person-badge" />}</Nav.Link>
      </Nav>
    </Navbar><Offcanvas show={this.state.showOffcanvas} placement="end" onHide={() => this.setState({ showOffcanvas: false })}>
        <Offcanvas.Header closeButton />
        <Offcanvas.Body className="d-flex flex-column">
          {this.state.user && <Card className="text-center shadow-sm">
            <Card.Body>
              <BsImage className="mb-3" src={image!} roundedCircle />
              <Card.Title>{this.state.user.global_name}</Card.Title>
              <div className="d-grid gap-2 mt-3">
                <Button variant="outline-danger" size="sm" onClick={async () => await this.onSignOut()}>{locale.discordSignOut}</Button>
              </div>
            </Card.Body>
          </Card>}
            {this.state.user == null && (
              isActivity ? (
                <Button size="sm" onClick={async () => await activitySignIn()}>{locale.discordSignIn}</Button>
              ) : (
                <a href="/api/auth/signIn" className="btn btn-primary btn-sm">{locale.discordSignIn}</a>
              )
            )}
          <div className="mt-auto border-top pt-3">
            <Form.Check className="mb-2" onChange={e => this.onSwitchDark(e.target.checked)} defaultChecked={this.state.dark}
              type="switch"
              label={<i className={`bi ${this.state.dark ? "bi-moon-fill" : "bi-sun-fill"}`} />}
            />
            <Form.Check className="mb-2" onChange={e => this.onSwitchBot(e.target.checked)} defaultChecked={this.state.bot}
              type="switch"
              label={<i className={`bi ${this.state.bot ? "bi-plug-fill" : "bi-plug"}`} />}
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
                  {this.state.user && <Button variant={character.owner === null ? "outline-secondary" : "secondary"} onClick={async e => {
                    e.stopPropagation();
                    await this.onOwnership(character, character.owner === null);
                  }}><i className={`bi ${character.owner === null ? "bi-person-fill-lock" : "bi-person-fill-x"}`} /></Button>}
                  <Button variant="primary" onClick={async e => {
                    e.stopPropagation();
                    await this.onShareCode(character);    
                  }}><i className="bi bi-share-fill" /></Button>
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
