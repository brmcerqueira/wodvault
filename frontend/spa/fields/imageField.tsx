/** @jsxImportSource $react */
/** @jsxRuntime automatic */

import { Character } from "../../../domain/character.ts";
import { CharacterManagerContext } from "../characterManager.ts";
import { Component } from "$react";
import { Image as BsImage, Form, Spinner, InputGroup } from "$react-bootstrap";

type Props = { character: Character }

export class ImageField extends Component<Props, { image: string, loading: boolean }> {
    static override contextType = CharacterManagerContext
    declare context: React.ContextType<typeof CharacterManagerContext>

    constructor(props: Props) {
        super(props);
        this.state = {
            image: props.character.image,
            loading: false
        }
    }

    public override componentDidUpdate(prev: Props) {
        if (prev.character.image !== this.props.character.image) {
            this.setState({ image: this.props.character.image });
        }
    }

    private async onChange(target: HTMLInputElement) {
        const image = target.files![0];

        const form = new FormData();

        form.set("image", image);

        this.setState({ loading: true });

        const response = await fetch("api/image", {
            method: "POST",
            body: form,
        });

        if (response.ok) {
            const url: string = await response.json();
            this.setState({ image: url, loading: false });
            this.props.character.image = url;
        }
        else {
            this.setState({ loading: false });
        }
    }

    public override render() {
        return <><BsImage className="float-sm-end mb-1" src={this.state.image} rounded />
            {this.context.canUpdate && <InputGroup>
                <Form.Control type="file" accept="image/gif, image/png, image/jpeg" onChange={async e => await this.onChange(e.target as HTMLInputElement)} />        
                {this.state.loading && <InputGroup.Text><Spinner animation="border" size="sm" /></InputGroup.Text>}
            </InputGroup>}
        </>

    }
}