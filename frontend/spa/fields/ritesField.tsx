/** @jsxImportSource $react */
/** @jsxRuntime automatic */

import { CharacterMode } from "../../../domain/character.ts";
import { keys } from "../../../utils.ts";
import { CharacterManagerContext } from "../characterManager.ts";
import { Component } from "react";
import { Button, Col, Form, InputGroup, Row } from "react-bootstrap";
import { Confirm } from "../dialog/confirm.ts";
import { dialog } from "../dialog/dialog.ts";
import { locale } from "../i18n/locale.ts";
import { format, SmFieldProps } from "./common.tsx";

const map: Record<string, string> = {
    ...locale.rites.common,
    ...locale.rites.social,
};

const cost = 5;
const first = keys(map)[0];
const optionsGroups = keys(locale.rites).filter(key => key != "name");

type State = { rites: string[] }
type Props = State & SmFieldProps

export class RitesField extends Component<Props, State> {
    static override contextType = CharacterManagerContext
    declare context: React.ContextType<typeof CharacterManagerContext>

    constructor(props: Props) {
        super(props);
        this.state = {
            rites: props.rites
        }
    }

    public override componentDidUpdate(prev: Props) {
        if (JSON.stringify(prev.rites) !== JSON.stringify(this.props.rites)) {
            this.setState({ rites: this.props.rites });
        }
    }

    private onChange(index: number, target: HTMLSelectElement): void {
        this.state.rites[index] = target.value;
        this.setState({ rites: this.state.rites });
    }

    private onCreate(): void {
        this.state.rites.push(first);

        if (this.context.mode == CharacterMode.Tracked) {
            this.context.updateSpentExperience(cost);
        }

        this.setState({ rites: this.state.rites });
    }

    private async onRemove(rite: string, index: number): Promise<void> {
        if (await dialog(new Confirm(format(locale.onRemove.rites, map[rite])))) {
            this.state.rites.splice(index, 1);

            if (this.context.mode == CharacterMode.Tracked) {
                this.context.updateSpentExperience(-cost);
            }

            this.setState({ rites: this.state.rites });
        }
    }

    public override render() {
        return <Col sm={this.props.sm} className="mb-2">
            <Row className="align-items-center mb-2">
                <Col className="text-center">
                    {this.context.canUpdate && <Button className="me-1" size="sm" variant="secondary" onClick={() => this.onCreate()}><i className="bi bi-plus" /></Button>}
                    <b>{locale.rites.name}</b>
                </Col>
            </Row>
            {this.state.rites.map((rite, index) => <Row className="align-items-center mb-1" key={`rite-${rite}-${index}`}>
                <Col className="text-center">{this.context.canUpdate ? <InputGroup>
                    <Button size="sm" variant="danger" onClick={async () => await this.onRemove(rite, index)}>
                        <i className="bi bi-trash3" />
                    </Button>
                    <Form.Select size="sm" onChange={e => this.onChange(index, e.target as HTMLSelectElement)}>
                        {optionsGroups.map(group => <optgroup label={locale[group]} key={group}>
                            {keys(locale.rites[group]).map(riteOption => <option selected={rite == riteOption} key={riteOption}
                                value={riteOption}>{locale.rites[group][riteOption]}</option>)}
                        </optgroup>)}
                    </Form.Select></InputGroup> : <>{map[rite]}</>}</Col>
            </Row>)}
        </Col>
    }
}