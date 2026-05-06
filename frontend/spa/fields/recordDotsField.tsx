/** @jsxImportSource $react */
/** @jsxRuntime automatic */

import { JSX } from "$react/jsx-runtime";
import { CharacterMode } from "../../../character.ts";
import { keys } from "../../../utils.ts";
import { CharacterBagContext } from "../characterBag.ts";
import { Component } from "$react";
import { Button, Col, Form, InputGroup, Row } from "$react-bootstrap";
import { Confirm } from "../dialog/confirm.ts";
import { dialog } from "../dialog/dialog.ts";
import { Circle, CircleFill, GetUpdateFieldProps, TotalFieldProps, SmFieldProps, NamedFieldProps, format } from "./common.tsx";
import { MeterField, MinFieldProps } from "./meterField.tsx";

type State = { record: Record<string, number> }
type Props = { onRemoveMessage: string, key: string, cost?: number } & NamedFieldProps & State & SmFieldProps

class InnerRecordDotsField extends MeterField<MinFieldProps & TotalFieldProps & GetUpdateFieldProps<number>> {
    protected override get empty(): JSX.Element {
        return Circle;
    }

    protected override get fill(): JSX.Element {
        return CircleFill;
    }
}

export class RecordDotsField extends Component<Props, State> {
    static override contextType = CharacterBagContext
    declare context: React.ContextType<typeof CharacterBagContext>

    constructor(props: Props) {
        super(props);
        this.state = {
            record: props.record
        }
    }

    public override componentDidUpdate(prev: Props) {
        if (JSON.stringify(prev.record) !== JSON.stringify(this.props.record)) {
            this.setState({ record: this.props.record });
        }
    }

    private onChangeName(name: string, target: HTMLInputElement) {
        if (name != target.value) {
            if (this.state.record[target.value]) {
                target.focus();
                target.classList.add("is-invalid");
            }
            else {
                target.classList.remove("is-invalid");
                const value = this.state.record[name];
                delete this.state.record[name];
                this.state.record[target.value] = value;
                this.setState({ record: this.state.record });
            }
        }
        else {
            target.classList.remove("is-invalid");
        }
    }

    private onCreate(): void {
        this.state.record[""] = 1;

        if (this.props.cost && this.context.mode == CharacterMode.Tracked) {
            this.context.updateSpentExperience(this.props.cost);
        }

        this.setState({ record: this.state.record });
    }

    private async onRemove(name: string): Promise<void> {
        if (await dialog(new Confirm(format(this.props.onRemoveMessage, name)))) {
            delete this.state.record[name];

            if (this.props.cost && this.context.mode == CharacterMode.Tracked) {
                this.context.updateSpentExperience(-this.props.cost);
            }

            this.setState({ record: this.state.record });
        }
    }

    public override render() {
        return <Col sm={this.props.sm} className="mb-2">
            <Row className="align-items-center mb-2">
                <Col className="text-center">
                    {this.context.canUpdate && <Button className="me-1" size="sm" variant="secondary" onClick={() => this.onCreate()}><i className="bi bi-plus" /></Button>}
                    <b>{this.props.name}</b>
                </Col>
            </Row>
            {keys(this.state.record).map((name, index) => <Row className="align-items-center mb-1" key={`${this.props.key}-${name}-${this.state.record[name]}-${index}`}>
                <Col sm={this.context.canUpdate ? 5 : 6} xs={this.context.canUpdate ? 5 : 6} className="text-end">{this.context.canUpdate ? <InputGroup>
                    <Button size="sm" variant="danger" onClick={async () => await this.onRemove(name)}><i className="bi bi-trash3" /></Button>
                    <Form.Control size="sm" type="text" onBlur={e => this.onChangeName(name, e.target as HTMLInputElement)} defaultValue={name} required />
                </InputGroup> : name}</Col>
                <Col sm={this.context.canUpdate ? 7 : 6} xs={this.context.canUpdate ? 7 : 6} className="text-center"><InnerRecordDotsField min={1} total={5}
                    get={() => this.state.record[name]}
                    update={v => this.state.record[name] = v!} /></Col>
            </Row>)}
        </Col>
    }
}