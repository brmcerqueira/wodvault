/** @jsxImportSource $react */
/** @jsxRuntime automatic */

import { JSX } from "$react/jsx-runtime";
import { Col, Row } from "react-bootstrap";
import { FieldProps, Square, SquareFill, TotalFieldProps } from "./common.tsx";
import { MeterField, MinFieldProps } from "./meterField.tsx";

export class SquaresField extends MeterField<MinFieldProps & TotalFieldProps & FieldProps<number>> {
    protected override get empty(): JSX.Element {
      return Square;
    }

    protected override get fill(): JSX.Element {
      return SquareFill;
    }

    public override render() {
        return <><Row className="align-items-center">
            <Col className="text-center">
                <b>{this.props.name}</b>
            </Col>
        </Row>
            <Row className="align-items-center">
                <Col className="text-center">
                    {super.render()}
                </Col>
            </Row></>
    }
}