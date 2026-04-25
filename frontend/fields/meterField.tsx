/** @jsxImportSource $react */
/** @jsxRuntime automatic */

import { JSX } from "$react/jsx-runtime";
import { CharacterMode } from "../../character.ts";
import { CharacterManagerContext } from "../characterManager.ts";
import { Component } from "$react";
import { Button } from "$react-bootstrap";
import { Meter, GetUpdateFieldProps, TotalFieldProps, calculateSpent } from "./common.tsx";

export type MinFieldProps = { min?: number, multiplier?: number, open?: boolean };

export abstract class MeterField<T extends MinFieldProps & TotalFieldProps & GetUpdateFieldProps<number>> extends Component<T, { value: number }> {
    static override contextType = CharacterManagerContext
    declare context: React.ContextType<typeof CharacterManagerContext>

    constructor(props: T) {
        super(props);
        this.state = {
            value: this.props.get()
        }
    }

    public override componentDidUpdate() {
        if (this.state.value !== this.props.get()) {
            this.setState({ value: this.props.get() });
        }
    }

    private onClick(add: boolean): void {
        let value = this.state.value;

        if (add && value < this.props.total) {
            ++value;
        } else if (!add && value > (this.props.min || 0)) {
            --value;
        }

        if (value != this.state.value) {
            if (this.props.multiplier && this.context.mode == CharacterMode.Tracked) {
                this.context.updateSpentExperience(calculateSpent(this.state.value, value, this.props.multiplier));
            }

            this.setState({ value });
            this.props.update(value);
        }
    }

    protected abstract get empty(): JSX.Element
    protected abstract get fill(): JSX.Element

    public override render() {
        return <>{(this.props.open ? this.context.edit : this.context.canUpdate) && <Button className="me-1" size="sm" variant="secondary" onClick={() => this.onClick(false)}><i className="bi bi-dash" /></Button>}
            <Meter
                value={this.props.get()}
                total={this.props.total}
                empty={this.empty}
                fill={this.fill}
            />
            {(this.props.open ? this.context.edit : this.context.canUpdate) && <Button className="ms-1" size="sm" variant="secondary" onClick={() => this.onClick(true)}><i className="bi bi-plus" /></Button>}</>
    }
}