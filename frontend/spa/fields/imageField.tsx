/** @jsxImportSource $react */
/** @jsxRuntime automatic */

import { Character } from "../../../character.ts";
import { CharacterBagContext } from "../characterBag.ts";
import { Component } from "$react";
import { Form, Image as BsImage, InputGroup, Spinner } from "$react-bootstrap";

type Props = { character: Character };

export function imageToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const result = reader.result as string;
      resolve(result);
    };

    reader.onerror = () => reject(reader.error);

    reader.readAsDataURL(file);
  });
}

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

    const url = `data:image/png;base64,${await imageToBase64(image)}`;

    this.setState({ image: url, loading: false });
    this.props.character.image = url;
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
