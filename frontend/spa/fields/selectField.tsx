// deno-lint-ignore-file jsx-key
/** @jsxImportSource $react */
/** @jsxRuntime automatic */

import { CharacterManagerContext } from "../characterManager.ts";
import { Col, Component, Form, Row } from "../deps.ts";
import { FieldProps } from "./common.tsx";

type Option = { value: string, name: string }

export class SelectField extends Component<{ options: (string | Option)[], canEmpty?: boolean, open?: boolean } & FieldProps<string>> {
  static override contextType = CharacterManagerContext
  declare context: React.ContextType<typeof CharacterManagerContext>

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