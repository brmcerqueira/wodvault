import { CharacterBagContext } from "../characterBag.ts";
import { Component } from "react";
import { Col, Form, Row } from "react-bootstrap";
import { FieldProps } from "./common.tsx";

export class DetailsField extends Component<FieldProps<string>> {
  static override contextType = CharacterBagContext;
  declare context: React.ContextType<typeof CharacterBagContext>;

  private onBlur(target: HTMLInputElement) {
    this.props.update(target.value);
  }

  public override render() {
    return (
      <>
        <Row className="align-items-center mb-2">
          <Col className="text-center">
            <b>{this.props.name}</b>
          </Col>
        </Row>
        <Row className="g-0">
          {this.context.canUpdate
            ? (
              <Col className="text-center">
                <Form.Control
                  size="sm"
                  as="textarea"
                  rows={10}
                  type="text"
                  onBlur={(e) => this.onBlur(e.target as HTMLInputElement)}
                  defaultValue={this.props.get()}
                />
              </Col>
            )
            : (
              <Col
                xs={12}
                className="text-center"
                dangerouslySetInnerHTML={{ __html: this.props.get() ?? "" }}
              />
            )}
        </Row>
      </>
    );
  }
}
