/** @jsxImportSource $react */
/** @jsxRuntime automatic */

import { Character, CharacterKind, CharacterMode } from "../../character.ts";;
import { Component, createRef } from "$react";
import { Form, Nav, Navbar } from "$react-bootstrap";
import { JSX } from "$react/jsx-runtime";
import { buildCharacter, getCharacter, saveCharacter } from "./services/characterService.ts";
import { observeCharacter } from "./services/webSocketService.ts";
import { discordUser } from "./services/discordService.ts";
import { CharacterManager, CharacterManagerContext } from "./characterManager.ts";
import { ExperienceField } from "./fields/experienceField.tsx";
import { locale } from "./i18n/locale.ts";
import { characterTitle, keys } from "../../utils.ts";

function updateCharacterManager(characterManager: CharacterManager, character: Character) {
    const user = discordUser();
    characterManager.mode = character.mode;
    characterManager.owner = user != null && character.owner != undefined && character.owner == user.id;
}

export abstract class CharacterSheet extends Component<{}, { character: Character, characterManager: CharacterManager }> {
    protected experienceFieldRef = createRef<ExperienceField>();

    constructor(kind: CharacterKind) {
        super({});

        const characterManager = new CharacterManager(this.experienceFieldRef);

        const params = new URLSearchParams(globalThis.location.hash.includes('?') ? globalThis.location.hash.split('?')[1] : '');

        let character = params.has("key") ? getCharacter(atob(params.get("key")!)) : null;

        if (character) {
            updateCharacterManager(characterManager, character);
        }
        else {
            character = buildCharacter(kind);
        }

        this.state = {
            characterManager,
            character: character!
        }

        observeCharacter(character => {
            if (!this.state.characterManager.edit && character._id == this.state.character._id) {
                updateCharacterManager(characterManager, character);
                this.setState({ character });
            }
        });
    }

    private updateEdit(edit: boolean) {
        this.state.characterManager.edit = edit;

        this.setState({ characterManager: this.state.characterManager });

        if (!edit) {
            saveCharacter(this.state.character);
        }
    }

    private onChangeMode(mode: CharacterMode): void {
        this.state.characterManager.mode = mode;
        this.state.character.mode = mode;
        this.setState({ character: this.state.character, characterManager: this.state.characterManager });
    }

    protected get<T>(callback: (character: Character) => T): () => T {
        return () => {
            return callback(this.state.character);
        }
    }

    protected update<T>(callback: (character: Character, value: T) => void): (value?: T) => void {
        return value => {
            if (value !== undefined) {
                callback(this.state.character, value);
            }
            this.setState({ character: this.state.character });
        }
    }

    protected abstract sheet(): JSX.Element

    public override render() {
        document.title = characterTitle(this.state.character);

        return <CharacterManagerContext.Provider value={this.state.characterManager}><Navbar expand className="bg-body-tertiary border-bottom fixed-top">
            <Nav className="me-auto">
                <Nav.Link href="/#"><i className="bi bi-arrow-left" /></Nav.Link>
            </Nav>
            <Nav className="ms-auto">
                {this.state.characterManager.owner && this.state.characterManager.edit && <Form.Select className="w-auto me-2" onChange={e => this.onChangeMode(parseInt(e.target.value))}>
                    {keys(CharacterMode).filter(item => Number(item) >= 0).map(key =>
                        <option selected={parseInt(key) == this.state.character.mode} value={key} key={`mode-${key}`}>{locale.mode[key as unknown as number]}</option>)}
                </Form.Select>}
                <Form.Check onChange={e => this.updateEdit(e.target.checked)} type="switch" />
            </Nav>
        </Navbar>
            {this.sheet()}
        </CharacterManagerContext.Provider>;
    }
}