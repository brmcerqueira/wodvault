import { CharacterBagContext } from "../characterBag.ts";
import { Component } from "react";
import { Button, Col, Row } from "react-bootstrap";
import { locale } from "../i18n/locale.ts";
import { GenericMeter, Square, SquareFill, SquareSlash } from "./common.tsx";

const max = 10;

type State = {
  humanity: {
    total: number;
    stains: number;
  };
};

export class HumanityField extends Component<State, State> {
  static override contextType = CharacterBagContext;
  declare context: React.ContextType<typeof CharacterBagContext>;

  constructor(props: State) {
    super(props);
    this.state = {
      humanity: props.humanity,
    };
  }

  public override componentDidUpdate(prev: State) {
    if (JSON.stringify(prev.humanity) !== JSON.stringify(this.props.humanity)) {
      this.setState({ humanity: this.props.humanity });
    }
  }

  private onClick(add: boolean, stain: boolean): void {
    const humanity = this.state.humanity;

    if (add) {
      if (stain) {
        humanity.stains++;
      } else {
        humanity.total++;
      }
      this.setState({ humanity: humanity });
    } else {
      if (stain) {
        humanity.stains--;
      } else {
        humanity.total--;
      }
      this.setState({ humanity: humanity });
    }
  }

  public override render() {
    return (
      <>
        <Row className="align-items-center">
          <Col className="text-center">
            <b>{locale.humanity}</b>
          </Col>
        </Row>
        <Row className="align-items-center">
          <Col className="text-center">
            <GenericMeter
              amount={max}
              put={(i) => {
                if (i <= this.state.humanity.total) {
                  return SquareFill;
                } else if (i <= max - this.state.humanity.stains) {
                  return Square;
                } else {
                  return SquareSlash;
                }
              }}
            />
          </Col>
        </Row>
        {this.context.canUpdate && (
          <Row className="align-items-center">
            <Col className="text-center">
              <Button
                className="ms-1"
                size="sm"
                variant="secondary"
                onClick={() => this.onClick(false, false)}
              >
                <i className="bi bi-dash" />
              </Button>
              <Button
                className="ms-1"
                size="sm"
                variant="secondary"
                onClick={() => this.onClick(true, false)}
              >
                <i className="bi bi-plus" />
              </Button>
              <Button
                className="ms-1"
                size="sm"
                variant="success"
                onClick={() => this.onClick(false, true)}
              >
                <i className="bi bi-slash-square" />
              </Button>
              <Button
                className="ms-1"
                size="sm"
                variant="danger"
                onClick={() => this.onClick(true, true)}
              >
                <i className="bi bi-slash-square" />
              </Button>
            </Col>
          </Row>
        )}
      </>
    );
  }
}
