/** @jsxImportSource $react */
/** @jsxRuntime automatic */

import { createRef } from "$react";
import { Col, Container, Form, Row } from "$react-bootstrap";
import { locale } from "../i18n/locale.ts";
import { DialogBody } from "./dialogBody.ts";

export class ImportShareCode extends DialogBody<string | undefined> {

    private codeRef = createRef<HTMLTextAreaElement>();

    public override resolve(isConfirm: boolean): void {
      this.resolvers.resolve(isConfirm ? this.codeRef.current?.value : undefined);
    }

    public override get buttonClose(): string {
      return locale.no;
    }

    public override get title(): string | undefined {
      return locale.importShareCodeTitle;
    }

    public override get buttonConfirm(): string | undefined {
      return locale.yes;
    }

    public override body(): React.ReactNode {
        return <Container>
                    <Row>
                        <Col className="text-center mt-2">
                            <Form.Control size="sm" as="textarea" type="text" ref={this.codeRef}/>
                        </Col>
                    </Row>
                </Container>
    }
}