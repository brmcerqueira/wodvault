/** @jsxImportSource $react */
/** @jsxRuntime automatic */

import { CharacterManagerContext } from "../characterManager.ts";
import { Component } from "react";
import { Col, Container, Form, Row } from "react-bootstrap";
import { FieldProps } from "./common.tsx";

export class TextAreaField extends Component<FieldProps<string>> {
    static override contextType = CharacterManagerContext
    declare context: React.ContextType<typeof CharacterManagerContext>

    private onBlur(target: HTMLInputElement) {
        this.props.update(target.value);
    }

    public override render() {
        return <Container>
            <Row className="align-items-center mb-2">
                <Col className="text-center">
                    <b>{this.props.name}</b>
                </Col>
            </Row>
            <Row>
                <Col className="text-center">
                    {this.context.canUpdate ? <Form.Control size="sm" as="textarea"
                        type="text" onBlur={e => this.onBlur(e.target as HTMLInputElement)} defaultValue={this.props.get()}
                    /> : <>{this.props.get()}</>}
                </Col>
            </Row>
        </Container>
    }
}