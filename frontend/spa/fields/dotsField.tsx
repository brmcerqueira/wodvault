/** @jsxImportSource $react */
/** @jsxRuntime automatic */

import { JSX } from "$react/jsx-runtime";
import { Col, Row } from "$react-bootstrap";
import { Circle, CircleFill, FieldProps, TotalFieldProps } from "./common.tsx";
import { MeterField, MinFieldProps } from "./meterField.tsx";

export class DotsField extends MeterField<MinFieldProps & TotalFieldProps & FieldProps<number>> {
    protected override get empty(): JSX.Element {
      return Circle;
    }

    protected override get fill(): JSX.Element {
      return CircleFill;
    }

    public override render() {
        return <Row className="align-items-center mb-1">
            <Col lg={6} sm={4} xs={4} className="text-end">
                <b>{this.props.name}</b>
            </Col>
            <Col lg={6} sm={8} xs={8} className="text-center">
                {super.render()}
            </Col>
        </Row>
    }
}
