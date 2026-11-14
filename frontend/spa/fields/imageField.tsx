/** @jsxImportSource $react */
/** @jsxRuntime automatic */

import { Character } from "../../../character.ts";
import { CharacterBagContext } from "../characterBag.ts";
import { Component } from "$react";
import { Form, Image as BsImage, InputGroup, Spinner } from "$react-bootstrap";

type Props = { character: Character };

export class ImageField
  extends Component<Props, { image: string; loading: boolean }> {
  static override contextType = CharacterBagContext;
  declare context: React.ContextType<typeof CharacterBagContext>;

  constructor(props: Props) {
    super(props);
    this.state = {
      image: props.character.image,
      loading: false,
    };
  }

  public override componentDidUpdate(prev: Props) {
    if (prev.character.image !== this.props.character.image) {
      this.setState({ image: this.props.character.image });
    }
  }

  private async onChange(target: HTMLInputElement) {
    const image = target.files![0];

    this.setState({ loading: true });

    const form = new FormData();

    form.append("reqtype", "fileupload");
    form.append("fileToUpload", image, image.name);

    const response = await fetch("https://catbox.moe/user/api.php", {
      method: "POST",
      body: form,
    });

    if (response.ok) {
      const url: string = (await response.text()).trim();
      this.setState({ image: url, loading: false });
      this.props.character.image = url;
    } else {
      this.setState({ loading: false });
    }
  }

  public override render() {
    return (
      <>
        <BsImage className="float-sm-end mb-1" src={this.state.image} rounded />
        {this.context.canUpdate && (
          <InputGroup>
            <Form.Control
              type="file"
              accept="image/gif, image/png, image/jpeg"
              onChange={async (e) =>
                await this.onChange(e.target as HTMLInputElement)}
            />
            {this.state.loading && (
              <InputGroup.Text>
                <Spinner animation="border" size="sm" />
              </InputGroup.Text>
            )}
          </InputGroup>
        )}
      </>
    );
  }
}
