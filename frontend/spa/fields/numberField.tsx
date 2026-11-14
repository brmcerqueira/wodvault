import { CharacterBagContext } from "../characterBag.ts";
import { Component } from "react";
import { Col, Form, Row } from "react-bootstrap";
import { FieldProps } from "./common.tsx";

export class NumberField
  extends Component<{ suffix?: string } & FieldProps<number>> {
  static override contextType = CharacterBagContext;
  declare context: React.ContextType<typeof CharacterBagContext>;

  public override render() {
    return (
      <Row className="align-items-center mb-1">
        <Col sm={4} xs={4} className="text-end">
          <b>{this.props.name}:</b>
        </Col>
        <Col sm={8} xs={8} className="text-start">
          {this.context.canUpdate
            ? (
              <Form.Control
                size="sm"
                type="number"
                step={1}
                min={0}
                defaultValue={this.props.get()}
                onChange={(e) =>
                  this.props.update(parseInt(e.target.value) || 0)}
              />
            )
            : <>{this.props.get()}{this.props.suffix && this.props.suffix}</>}
        </Col>
      </Row>
    );
  }
}
