/** @jsxImportSource $react */
/** @jsxRuntime automatic */

import { CharacterBagContext } from "../characterBag.ts";
import { Component, createRef } from "$react";
import { Col, Form, Row } from "$react-bootstrap";
import { locale } from "../i18n/locale.ts";

type State = {
    experience: {
        total: number;
        spent: number;
    }
}

export class ExperienceField extends Component<State, State> {
    static override contextType = CharacterBagContext
    declare context: React.ContextType<typeof CharacterBagContext>
    private spentRef = createRef<HTMLInputElement>();

    constructor(props: State) {
        super(props);
        this.state = {
            experience: props.experience
        }
    }

    public override componentDidUpdate(prev: State) {
        if (JSON.stringify(prev.experience) !== JSON.stringify(this.props.experience)) {
            this.setState({ experience: this.props.experience });
        }
    }

    private onChange(target: HTMLInputElement, spent: boolean) {
        const value = parseInt(target.value) || 0;

        if (spent) {
            this.state.experience.spent = value;
        }
        else {
            this.state.experience.total = value;
        }

        this.setState({ experience: this.state.experience });
    }

    public updateSpentExperience(value: number) {
        this.state.experience.spent += value;
        this.spentRef.current!.value = this.state.experience.spent.toString();
        this.setState({ experience: this.state.experience });
    }

    public override render() {
        return <Row className="align-items-center mb-1">
            <Col sm={4} xs={4} className="text-end">
                <b>{locale.experience.name}:</b>
            </Col>
            <Col sm={8} xs={8} className="text-start">
                <div className="d-flex align-items-center">
                    {this.context.canUpdate ? <>
                        <Form.Control className="w-25" size="sm" type="number" step={1} min={0} defaultValue={this.state.experience.total} onChange={e => this.onChange(e.target as HTMLInputElement, false)} />
                        <span className="mx-2">-</span><Form.Control ref={this.spentRef} className="w-25" size="sm" type="number" step={1} min={0} defaultValue={this.state.experience.spent} onChange={e => this.onChange(e.target as HTMLInputElement, true)} />
                    </> :
                        <>{this.state.experience.total} - {this.state.experience.spent}</>}
                    <span className="mx-2">=</span>
                    {this.state.experience.total - this.state.experience.spent}
                </div>
            </Col>
        </Row>
    }
}