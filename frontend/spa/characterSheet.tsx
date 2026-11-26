import { Character, CharacterKind, CharacterMode } from "../../character.ts";
import { Component, createRef } from "react";
import { Form, Nav, Navbar, Spinner } from "react-bootstrap";
import { Navigate } from "react-router";
import { JSX } from "react/jsx-runtime";
import { buildCharacter } from "./services/characterService.ts";
import { CharacterBag, CharacterBagContext } from "./characterBag.ts";
import { ExperienceField } from "./fields/experienceField.tsx";
import { locale } from "./i18n/locale.ts";
import { characterTitle, keys } from "../../utils.ts";
import {
  characterEvents,
  observeCharacterUpdate,
  sendCharacterUpdate,
} from "./services/sseService.ts";
import { storage } from "../storage/mod.ts";

export abstract class CharacterSheet extends Component<
  {},
  {
    kind: CharacterKind;
    characterBag: CharacterBag;
    shared: boolean;
    character: Character;
    key?: string;
    redirect?: string;
  }
> {
  protected experienceFieldRef = createRef<ExperienceField>();

  constructor(kind: CharacterKind) {
    super({});

    const characterBag = new CharacterBag(this.experienceFieldRef);

    const params = new URLSearchParams(
      globalThis.location.hash.includes("?")
        ? globalThis.location.hash.split("?")[1]
        : "",
    );

    const key = params.has("key") ? atob(params.get("key")!) : undefined;

    const shared = params.get("shared") === "true";

    this.state = {
      kind,
      characterBag,
      shared,
      character: null as unknown as Character,
      key,
    };

    observeCharacterUpdate((update) => {
      if (update.remove && this.state.character.id == update.remove) {
        this.setState({ redirect: "/" });
      } else if (update.character && !this.state.characterBag.edit) {
        if (this.state.character.id == update.character.id) {
          this.state.characterBag.adjustFields(update.character);
          this.setState({ character: update.character });
        }
      }
    });
  }

  private async updateEdit(edit: boolean) {
    this.state.characterBag.edit = edit;

    this.setState({ characterBag: this.state.characterBag });

    if (!edit) {
      await sendCharacterUpdate(this.state.character);
    }
  }

  private onChangeMode(mode: CharacterMode): void {
    this.state.characterBag.mode = mode;
    this.state.character.mode = mode;
    this.setState({
      character: this.state.character,
      characterBag: this.state.characterBag,
    });
  }

  protected get<T>(callback: (character: Character) => T): () => T {
    return () => {
      return callback(this.state.character);
    };
  }

  protected update<T>(
    callback: (character: Character, value: T) => void,
  ): (value?: T) => void {
    return (value) => {
      if (value !== undefined) {
        callback(this.state.character, value);
      }
      this.setState({ character: this.state.character });
    };
  }

  private async loadCharacter() {
    let character: Character | undefined;

    if (this.state.key) {
      if (this.state.shared) {
        character = await characterEvents.getCharacter(this.state.key);
      } else {
        character = await storage.characters.get(this.state.key);
      }
    }

    if (character) {
      this.state.characterBag.adjustFields(character);
    } else {
      character = buildCharacter(this.state.kind);
    }

    this.setState({ character: character });
  }

  protected abstract sheet(): JSX.Element;

  public override render() {
    if (this.state.redirect) {
      return <Navigate to={this.state.redirect} replace />;
    }

    if (this.state.character === null) {
      this.loadCharacter();
      return <Spinner animation="border" size="sm" />;
    }

    document.title = characterTitle(this.state.character);

    return (
      <CharacterBagContext.Provider value={this.state.characterBag}>
        <Navbar expand className="bg-body-tertiary border-bottom fixed-top">
          <Nav className="me-auto">
            <Nav.Link href="./#">
              <i className="bi bi-arrow-left" />
            </Nav.Link>
          </Nav>
          <Nav className="ms-auto">
            {this.state.characterBag.owner && this.state.characterBag.edit && (
              <Form.Select
                className="w-auto me-2"
                onChange={(e) => this.onChangeMode(parseInt(e.target.value))}
              >
                {keys(CharacterMode).filter((item) => Number(item) >= 0).map(
                  (key) => (
                    <option
                      selected={parseInt(key) == this.state.character.mode}
                      value={key}
                      key={`mode-${key}`}
                    >
                      {locale.mode[key as unknown as number]}
                    </option>
                  ),
                )}
              </Form.Select>
            )}
            <Form.Check
              onChange={async (e) => await this.updateEdit(e.target.checked)}
              type="switch"
            />
          </Nav>
        </Navbar>
        {this.sheet()}
      </CharacterBagContext.Provider>
    );
  }
}
