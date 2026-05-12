/** @jsxImportSource $react */
/** @jsxRuntime automatic */

import { Component } from "$react";
import { Button, Modal } from "$react-bootstrap";
import { DialogBody } from "./dialogBody.ts";

type DialogModalState = {
    show: boolean,  
    body?: DialogBody<unknown>,
};

export class DialogModal extends Component<{}, DialogModalState> {
    constructor() {
        super({})
        this.state = {
            show: false,
        }
    }

    private resolve(isConfirm: boolean) {
        this.state.body?.resolve(isConfirm);
        this.setState({ show: false, body: undefined });
    }

    public show<T>(body: DialogBody<T>): Promise<T> {
        this.setState({ show: true, body: body as DialogBody<unknown> });
        return body.promise;
    }

    public override componentDidUpdate(
        _prevProps: Readonly<{}>,
        prevState: Readonly<DialogModalState>,
    ) {
        if (prevState.body === this.state.body) {
            return;
        }

        prevState.body?.dialogWillUnmount();
        this.state.body?.dialogDidMount();
    }

    public override render() {
        return <Modal show={this.state.show} onHide={() => this.resolve(false)}>
        <Modal.Header closeButton>{this.state.body?.title}</Modal.Header>
        <Modal.Body>{this.state.body?.body()}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => this.resolve(false)}>
            {this.state.body?.buttonClose}
          </Button>
          {this.state.body?.buttonConfirm && <Button variant="primary" onClick={() => this.resolve(true)}>
            {this.state.body?.buttonConfirm}
          </Button>}
        </Modal.Footer>
      </Modal>
    }
}