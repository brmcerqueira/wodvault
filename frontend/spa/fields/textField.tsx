/** @jsxImportSource $react */
/** @jsxRuntime automatic */

import { CharacterManagerContext } from "../characterManager.ts";
import { Col, Component, Form, OverlayTrigger, Row, Tooltip } from "../deps.ts";
import { FieldProps } from "./common.tsx";

export class TextField extends Component<FieldProps<string>> {
  static override contextType = CharacterManagerContext
  declare context: React.ContextType<typeof CharacterManagerContext>

  private onBlur(target: HTMLInputElement) {
    this.props.update(target.value);
  }

  public override render() {
    return <Row className="align-items-center mb-1">
      <Col sm={4} xs={4} className="text-end">
        <b>{this.props.name}:</b>
      </Col>
      <Col sm={8} xs={8} className="text-start">{this.context.canUpdate ? <Form.Control size="sm"
        type="text" onBlur={e => this.onBlur(e.target as HTMLInputElement)} defaultValue={this.props.get()}
      /> : <OverlayTrigger
        placement="left"
        delay={{ show: 250, hide: 400 }}
        overlay={<Tooltip>
          {this.props.get()}
        </Tooltip>}
      ><span>{this.props.get()}</span>
      </OverlayTrigger>}</Col>
    </Row>
  }
}