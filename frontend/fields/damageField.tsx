/** @jsxImportSource $react */
/** @jsxRuntime automatic */

import { Damage } from "../../character.ts";
import { CharacterManagerContext } from "../characterManager.ts";
import { Component } from "$react";
import { Button, Col, Row } from "$react-bootstrap";
import { GenericMeter, SquareX, SquareSlash, Square, NamedFieldProps, TotalFieldProps } from "./common.tsx";

type State = { damage: Damage }
type Props = { children?: React.ReactNode } & TotalFieldProps & NamedFieldProps & State

export class DamageField extends Component<Props, State> {
    static override contextType = CharacterManagerContext
    declare context: React.ContextType<typeof CharacterManagerContext>

    constructor(props: Props) {
        super(props);
        this.state = {
            damage: props.damage
        }
    }

    public override componentDidUpdate(prev: Props) {
        if (JSON.stringify(prev.damage) !== JSON.stringify(this.props.damage)) {
            this.setState({ damage: this.props.damage });
        }
    }

    private penalty(left: number): number {
        return left <= 0 ? 3 : (left >= 1 && left <= 3 ? (3 - left) : 0);
    }

    private onClick(recovery: boolean, aggravated: boolean): void {
        const damage = this.state.damage;
        let update = false;

        if (recovery) {
            if (aggravated && damage.aggravated > 0) {
                damage.aggravated--;
                update = true;
            } else if (damage.superficial > 0) {
                damage.superficial--;
                update = true;
            }
        } else if (damage.aggravated < this.props.total || (damage.aggravated + damage.superficial < this.props.total)) {
            if (aggravated || (damage.aggravated + damage.superficial == this.props.total)) {
                damage.aggravated++;

                if (!aggravated && damage.superficial > 0) {
                    damage.superficial--;
                }
            } else {
                damage.superficial++;
            }

            update = true;
        }

        if (update) {
            damage.penalty = this.penalty(this.props.total - (damage.superficial + damage.aggravated));
            this.setState({ damage });
        }
    }

    public override render() {
        const damage = this.state.damage;

        const indexSuperficial = damage.aggravated + damage.superficial;

        let indexAggravated = damage.aggravated;

        if (indexSuperficial > this.props.total) {
            indexAggravated += indexSuperficial - this.props.total;
        }

        return <><Row className="align-items-center">
            <Col className="text-center">
                <b>{this.props.name}</b>
            </Col>
        </Row>
            <Row className="align-items-center">
                <Col className="text-center">
                    <GenericMeter
                        amount={this.props.total}
                        put={i => {
                            if (i <= indexAggravated) {
                                return SquareX;
                            } else if (i <= indexSuperficial) {
                                return SquareSlash;
                            } else {
                                return Square;
                            }
                        }}
                    />
                </Col>
            </Row>
            {this.props.damage.penalty > 0 && <Row className="align-items-start">
                <Col className="text-center"><GenericMeter
                    amount={this.props.damage.penalty}
                    put={() => <i className="bi bi-circle-fill penalty" />}
                /></Col>
            </Row>}
            {this.context.edit && <Row className="align-items-center">
                <Col className="text-center">
                    <Button className="ms-1" size="sm" variant="success" onClick={() => this.onClick(true, true)}><i className="bi bi-x-square" /></Button>
                    <Button className="ms-1" size="sm" variant="success" onClick={() => this.onClick(true, false)}><i className="bi bi-slash-square" /></Button>
                    <Button className="ms-1" size="sm" variant="danger" onClick={() => this.onClick(false, false)}><i className="bi bi-slash-square" /></Button>
                    <Button className="ms-1" size="sm" variant="danger" onClick={() => this.onClick(false, true)}><i className="bi bi-x-square" /></Button>
                </Col>
            </Row>}
            {this.props.children}
        </>
    }
}