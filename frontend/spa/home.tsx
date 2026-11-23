import { Character, CharacterKind } from "../../character.ts";
import { keys } from "../../utils.ts";
import { Component, createRef, JSX } from "react";
import { Navigate } from "react-router";
import { QRCodeSVG } from "react-qrcode";
import {
  Button,
  ButtonGroup,
  Card,
  Col,
  Container,
  Form,
  InputGroup,
  Nav,
  Navbar,
  NavDropdown,
  Offcanvas,
  Row,
  Spinner,
} from "react-bootstrap";
import { Alert } from "./dialog/alert.ts";
import { Confirm } from "./dialog/confirm.ts";
import { dialog } from "./dialog/dialog.ts";
import { format } from "./fields/common.tsx";
import { locale } from "./i18n/locale.ts";
import {
  allCharacters,
  buildCharacter,
  getCharacter,
  removeCharacter,
} from "./services/characterService.ts";
import {
  connect,
  ConnectionStatus,
  connectionStatus,
  disconnect,
  host,
} from "./services/peerService.ts";
import {
  hostId,
  isDark,
  isHost,
  myId,
  setDark,
  setHost,
  setWebSocketPort,
  webSocketPort,
} from "./services/preferencesService.ts";
import { ImportCharacter } from "./dialog/importCharacter.tsx";
import { QrcodeScanner } from "./dialog/qrcodeScanner.tsx";
import {
  observeCharacterUpdate,
  sendCharacterUpdate,
} from "./services/sseService.ts";

export class Home extends Component<{}, {
  showOffcanvas: boolean;
  host: boolean;
  connectionStatus: ConnectionStatus;
  dark: boolean;
  characters: Record<string, Character>;
  redirect?: string;
}> {
  private connectIdRef = createRef<HTMLInputElement>();
  private webSocketPortRef = createRef<HTMLInputElement>();

  constructor() {
    super({});

    const characters: Record<string, Character> = {};

    for (const key of allCharacters()) {
      const character = getCharacter(key);

      if (character !== null) {
        characters[key] = character;
      }
    }

    this.state = {
      showOffcanvas: false,
      host: isHost(),
      connectionStatus: connectionStatus(),
      dark: isDark(),
      characters,
    };

    observeCharacterUpdate((update) => {
      if (update.remove) {
        delete this.state.characters[update.remove];
      }

      if (update.character) {
        this.state.characters[update.character.id] = update.character;
      }

      this.setState({ characters: this.state.characters });
    });
  }

  private onSwitchHost(value: boolean) {
    setHost(value);
    this.setState({ host: value });
  }

  private onCopyMyIdInClipboard(): void {
    navigator.clipboard.writeText(myId);
  }

  private async onConnectOrDisconnect(): Promise<void> {
    if (
      this.state.connectionStatus == ConnectionStatus.Connected ||
      this.state.connectionStatus == ConnectionStatus.Connecting
    ) {
      disconnect();
    } else {
      this.setState({ connectionStatus: ConnectionStatus.Connecting });
      if (this.state.host) {
        const webSocketPortValue =
          this.webSocketPortRef.current?.value.trim() ?? "";
        setWebSocketPort(
          webSocketPortValue === "" ? null : parseInt(webSocketPortValue),
        );
        await host();
      } else {
        const id = this.connectIdRef.current?.value.trim() ?? "";

        if (id.length > 0) {
          await connect(id);
        }
      }
    }

    this.setState({ connectionStatus: connectionStatus() });
  }

  private onSwitchDark(value: boolean): void {
    setDark(value);
    this.setState({ dark: value });
  }

  private async onQrcodeScan() {
    const id = await dialog(new QrcodeScanner());
    if (id) {
      const connectId = this.connectIdRef.current;
      if (connectId) {
        connectId.value = id;
      }
      this.setState({ connectionStatus: ConnectionStatus.Connecting });
      await connect(id);
      this.setState({ connectionStatus: connectionStatus() });
    }
  }

  private async onOwnership(character: Character) {
    const takeOwnership = character.owner === null;
    const id = takeOwnership ? myId : null;
    character.owner = id;
    this.state.characters[character.id].owner = id;
    await sendCharacterUpdate(character);
    this.setState({ characters: this.state.characters });
    await dialog(
      new Alert(
        format(
          takeOwnership ? locale.takeOwnership : locale.leaveOwnership,
          character.name,
        ),
      ),
    );
  }

  private async onImport() {
    const json = await dialog(new ImportCharacter());
    if (json) {
      const data = JSON.parse(json);
      const character = Object.assign(
        buildCharacter(data.kind as CharacterKind),
        data,
      ) as Character;
      await sendCharacterUpdate(character);
      this.state.characters[character.id] = character;
      this.setState({ characters: this.state.characters });
      await dialog(new Alert(format(locale.import, character.name)));
    }
  }

  private async onExport(character: Character) {
    navigator.clipboard.writeText(JSON.stringify(character, (key, value) => {
      if (
        key === "id" || key === "owner" || key === "mode" ||
        key === "timestamp" || key === "playerId"
      ) {
        return undefined;
      }

      return value;
    }));
    await dialog(new Alert(format(locale.export, character.name)));
  }

  private async onShared(character: Character) {
    const url = new URL("/", import.meta.url);

    url.pathname = `api/character/shared/${character.id}.html`;

    if (navigator.share) {
      await navigator.share({
        title: character.name,
        url: url.toString(),
      });
    } else {
      await navigator.clipboard.writeText(url.toString());
      await dialog(new Alert(format(locale.shared, character.name)));
    }
  }

  private async onRemove(character: Character): Promise<void> {
    if (
      await dialog(
        new Confirm(format(locale.onRemove.characters, character.name)),
      )
    ) {
      removeCharacter(character.id);
      delete this.state.characters[character.id];
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

    return result;
  }

  private renderConnectButtonContent(): string | JSX.Element {
    switch (this.state.connectionStatus) {
      case ConnectionStatus.Connecting:
        return (
          <>
            <Spinner animation="border" size="sm" className="me-2" />
            {locale.cancel}
          </>
        );
      case ConnectionStatus.Connected:
        return locale.disconnect;
      default:
        return this.state.host ? locale.host : locale.connect;
    }
  }

  private renderConnectButtonVariant(): string {
    switch (this.state.connectionStatus) {
      case ConnectionStatus.Connecting:
        return "warning";
      case ConnectionStatus.Connected:
        return "danger";
      default:
        return "primary";
    }
  }

  public override render() {
    if (this.state.redirect) {
      return <Navigate to={this.state.redirect} replace />;
    }

    const array = keys(this.state.characters);

    const hostIdValue = hostId();

    return (
      <>
        <Navbar expand className="bg-body-tertiary border-bottom">
          <Nav className="me-auto">
            <NavDropdown
              title={<i className="bi bi-person-fill-add" />}
              drop="end"
            >
              <NavDropdown.Item href="#/vampire">
                {locale.vampire}
              </NavDropdown.Item>
              <NavDropdown.Item href="#/werewolf">
                {locale.werewolf}
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={async () => await this.onImport()}>
                {locale.importCharacterTitle}
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
          <Nav className="ms-auto">
            <Nav.Link onClick={() => this.setState({ showOffcanvas: true })}>
              <i className="bi bi-list" />
            </Nav.Link>
          </Nav>
        </Navbar>
        <Offcanvas
          show={this.state.showOffcanvas}
          placement="end"
          onHide={() => this.setState({ showOffcanvas: false })}
        >
          <Offcanvas.Header closeButton />
          <Offcanvas.Body className="d-flex flex-column">
            <Form.Group className="mb-3">
              {this.state.host
                ? (
                  <>
                    <div className="d-flex justify-content-center mb-2">
                      <QRCodeSVG
                        value={myId}
                        size={250}
                        level="H"
                        marginSize={2}
                      />
                    </div>
                    <InputGroup>
                      <Form.Control defaultValue={myId} disabled />
                      <Button
                        variant="outline-secondary"
                        onClick={() => this.onCopyMyIdInClipboard()}
                      >
                        <i className="bi bi-copy" />
                      </Button>
                    </InputGroup>
                    <Form.Group className="mt-3 mb-3">
                      <Form.Label>
                        <i className="bi bi-router" /> {locale.webSocketPort}
                      </Form.Label>
                      <Form.Control
                        type="number"
                        defaultValue={webSocketPort() ?? ""}
                        ref={this.webSocketPortRef}
                      />
                    </Form.Group>
                  </>
                )
                : (
                  <InputGroup>
                    <Form.Control
                      defaultValue={hostIdValue != null && hostIdValue != myId
                        ? hostIdValue
                        : ""}
                      ref={this.connectIdRef}
                      disabled={this.state.connectionStatus !==
                        ConnectionStatus.Disconnected}
                    />
                    <Button
                      variant="outline-secondary"
                      onClick={async (e) => {
                        e.stopPropagation();
                        await this.onQrcodeScan();
                      }}
                    >
                      <i className="bi bi-qr-code-scan" />
                    </Button>
                  </InputGroup>
                )}
              <Button
                className="mt-2 w-100"
                variant={this.renderConnectButtonVariant()}
                onClick={async () => await this.onConnectOrDisconnect()}
              >
                {this.renderConnectButtonContent()}
              </Button>
            </Form.Group>
            <div className="mt-auto border-top pt-3">
              <Form.Check
                className="mb-2"
                onChange={(e) => this.onSwitchHost(e.target.checked)}
                defaultChecked={this.state.host}
                type="switch"
                label={
                  <i
                    className={`bi ${
                      this.state.host ? "bi-broadcast" : "bi-broadcast-pin"
                    }`}
                  />
                }
              />
              <Form.Check
                className="mb-2"
                onChange={(e) => this.onSwitchDark(e.target.checked)}
                defaultChecked={this.state.dark}
                type="switch"
                label={
                  <i
                    className={`bi ${
                      this.state.dark ? "bi-moon-fill" : "bi-sun-fill"
                    }`}
                  />
                }
              />
            </div>
          </Offcanvas.Body>
        </Offcanvas>
        {array.length == 0 && (
          <Container>
            <Row className="text-center p-5">
              <h3 className="mt-3">{locale.emptyCharacters}</h3>
              <p className="text-muted">{locale.addCharacters}</p>
              <a className="btn btn-primary mt-2" href="#/vampire">
                {locale.createVampire}
              </a>
              <a className="btn btn-primary mt-2" href="#/werewolf">
                {locale.createWerewolf}
              </a>
            </Row>
          </Container>
        )}
        <Container className="mt-3">
          <Row className="g-3">
            {array.map((key) => {
              const character = this.state.characters[key];
              const path = this.parseKind(character.kind);
              const characterKey = btoa(character.id);
              return (
                <Col lg={2} sm={2} xs={6} key={`character-${character.id}`}>
                  <Card
                    className="h-100"
                    onClick={() =>
                      this.setState({
                        redirect: `/${path}?key=${characterKey}`,
                      })}
                  >
                    <Card.Img variant="top" src={character.image} />
                    <Card.Body>
                      <Card.Title>
                        <a
                          onClick={(e) =>
                            e.stopPropagation()}
                          href={`#/${path}?key=${characterKey}`}
                        >
                          {character.name}
                        </a>
                      </Card.Title>
                      <Card.Text>
                        <Row className="align-items-center mb-1">
                          <Col className="text-end">
                            <b>{locale.player}:</b>
                          </Col>
                          <Col className="text-start">{character.player}</Col>
                        </Row>
                      </Card.Text>
                      <ButtonGroup>
                        {(character.owner === null ||
                          character.owner === myId) && (
                          <Button
                            variant={character.owner === null
                              ? "outline-secondary"
                              : "secondary"}
                            onClick={async (e) => {
                              e.stopPropagation();
                              await this.onOwnership(character);
                            }}
                          >
                            <i
                              className={`bi ${
                                character.owner === null
                                  ? "bi-person-fill-lock"
                                  : "bi-person-fill-x"
                              }`}
                            />
                          </Button>
                        )}
                        <Button
                          variant="primary"
                          onClick={async (e) => {
                            e.stopPropagation();
                            await this.onExport(character);
                          }}
                        >
                          <i className="bi bi-box-arrow-up-right" />
                        </Button>
                        <Button
                          variant="success"
                          onClick={async (e) => {
                            e.stopPropagation();
                            await this.onShared(character);
                          }}
                        >
                          <i className="bi bi-share-fill" />
                        </Button>
                        <Button
                          variant="danger"
                          onClick={async (e) => {
                            e.stopPropagation();
                            await this.onRemove(character);
                          }}
                        >
                          <i className="bi bi-trash3" />
                        </Button>
                      </ButtonGroup>
                    </Card.Body>
                  </Card>
                </Col>
              );
            })}
          </Row>
        </Container>
      </>
    );
  }
}
