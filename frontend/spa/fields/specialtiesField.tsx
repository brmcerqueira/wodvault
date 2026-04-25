/** @jsxImportSource $react */
/** @jsxRuntime automatic */

import { CharacterMode } from "../../../character.ts";
import { keys } from "../../../utils.ts";
import { CharacterManagerContext } from "../characterManager.ts";
import { Component } from "$react";
import { Button, Col, Form, InputGroup, Row } from "$react-bootstrap";
import { Confirm } from "../dialog/confirm.ts";
import { dialog } from "../dialog/dialog.ts";
import { locale } from "../i18n/locale.ts";
import { format, SmFieldProps } from "./common.tsx";

const map: Record<string, string> = {
    ...locale.skills.physical,
    ...locale.skills.social,
    ...locale.skills.mental
};

const cost = 3;
const first = keys(map)[0];
const optionsGroups = keys(locale.skills).filter(key => key != "name");

type State = { specialties: Record<string, string[]> }
type Props = State & SmFieldProps

export class SpecialtiesField extends Component<Props, State> {
    static override contextType = CharacterManagerContext
    declare context: React.ContextType<typeof CharacterManagerContext>

    constructor(props: Props) {
        super(props);
        this.state = {
            specialties: props.specialties
        }
    }

    public override componentDidUpdate(prev: Props) {
        if (JSON.stringify(prev.specialties) !== JSON.stringify(this.props.specialties)) {
            this.setState({ specialties: this.props.specialties });
        }
    }

    private onChangeSpecialty(skill: string, index: number, target: HTMLInputElement) {
        this.state.specialties[skill][index] = target.value;
        this.setState({ specialties: this.state.specialties });
    }

    private onChangeSkill(skill: string, index: number, target: HTMLSelectElement): void {
        const value = this.state.specialties[skill][index];
        this.state.specialties[skill].splice(index, 1);

        if (this.state.specialties[skill].length == 0) {
            delete this.state.specialties[skill];
        }

        if (this.state.specialties[target.value] === undefined) {
            this.state.specialties[target.value] = [];
        }

        this.state.specialties[target.value].push(value);

        this.setState({ specialties: this.state.specialties });
    }

    private onCreate(): void {
        if (this.state.specialties[first] === undefined) {
            this.state.specialties[first] = [];
        }

        this.state.specialties[first].push("");

        if (this.context.mode == CharacterMode.Tracked) {
            this.context.updateSpentExperience(cost);
        }

        this.setState({ specialties: this.state.specialties });
    }

    private async onRemove(skill: string, index: number, specialty: string): Promise<void> {
        if (await dialog(new Confirm(format(locale.onRemove.specialties, specialty)))) {
            this.state.specialties[skill].splice(index, 1);

            if (this.state.specialties[skill].length == 0) {
                delete this.state.specialties[skill];
            }

            if (this.context.mode == CharacterMode.Tracked) {
                this.context.updateSpentExperience(-cost);
            }

            this.setState({ specialties: this.state.specialties });
        }
    }

    public override render() {
        return <Col sm={this.props.sm} className="mb-2">
            <Row className="align-items-center mb-2">
                <Col className="text-center">
                    {this.context.canUpdate && <Button className="me-1" size="sm" variant="secondary" onClick={() => this.onCreate()}><i className="bi bi-plus" /></Button>}
                    <b>{locale.specialties.name}</b>
                </Col>
            </Row>
            {keys(this.state.specialties).flatMap((skill, skillIndex) => this.state.specialties[skill].map((specialty, index) =>
                <Row className="align-items-center mb-1" key={`specialty-${skill}-${specialty}-${skillIndex}-${index}`}>
                    <Col className="text-end">{this.context.canUpdate ? <InputGroup>
                        <Button size="sm" variant="danger" onClick={async () => await this.onRemove(skill, index, specialty)}><i className="bi bi-trash3" /></Button>
                        <Form.Control size="sm" type="text" onBlur={e => this.onChangeSpecialty(skill, index, e.target as HTMLInputElement)} defaultValue={specialty} />
                    </InputGroup> : specialty}</Col>
                    <Col className="text-start">{this.context.canUpdate ? <Form.Select size="sm" onChange={e => this.onChangeSkill(skill, index, e.target as HTMLSelectElement)}>
                        {optionsGroups.map(group => <optgroup label={locale[group]} key={group}>
                            {keys(locale.skills[group]).map(skillOption => <option selected={skill == skillOption} key={skillOption}
                                value={skillOption}>{locale.skills[group][skillOption]}</option>)}
                        </optgroup>)}
                    </Form.Select> : <>({map[skill]})</>}</Col>
                </Row>))}
        </Col>
    }
}