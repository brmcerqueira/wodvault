// deno-lint-ignore-file jsx-key
/** @jsxImportSource $react */
/** @jsxRuntime automatic */

import { CharacterBagContext } from "../characterBag.ts";
import { Component } from "$react";
import { Col, Form, Row } from "$react-bootstrap";
import { FieldProps } from "./common.tsx";

type Option = { value: string, name: string }

export class SelectField extends Component<{ options: (string | Option)[], canEmpty?: boolean, open?: boolean } & FieldProps<string>> {
  static override contextType = CharacterBagContext
  declare context: React.ContextType<typeof CharacterBagContext>

  public override render() {
    return <Row className="align-items-center mb-1">
      <Col sm={4} xs={4} className="text-end">
        <b>{this.props.name}:</b>
      </Col>
      <Col sm={8} xs={8} className="text-start">{(this.props.open ? this.context.edit : this.context.canUpdate) ? <Form.Select size="sm" onChange={e => this.props.update(e.target.value)}>
        {this.props.canEmpty && <option value=""> - </option>}
        {this.props.options.map(o => {
          const option: Option = typeof o === "string" ? { value: o, name: o } : o;
          return <option selected={this.props.get() == option.value} value={option.value}>{option.name}</option>
        })}
      </Form.Select> :
        <>{this.props.get()}</>
      }</Col>
    </Row>
  }
}