/** @jsxImportSource $react */
/** @jsxRuntime automatic */

import { JSX } from "$react/jsx-runtime";
import { Col, Row } from "../deps.ts";
import { Circle, CircleFill, FieldProps, TotalFieldProps } from "./common.tsx";
import { MeterField, MinFieldProps } from "./meterField.tsx";

export class TraitDotsField extends MeterField<MinFieldProps & TotalFieldProps & FieldProps<number>> {
    protected override get empty(): JSX.Element {
      return Circle;
    }

    protected override get fill(): JSX.Element {
      return CircleFill;
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