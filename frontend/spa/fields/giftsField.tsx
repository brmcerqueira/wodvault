/** @jsxImportSource $react */
/** @jsxRuntime automatic */

import { CharacterMode } from "../../../character.ts";
import { keys } from "../../../utils.ts";
import { CharacterBagContext } from "../characterBag.ts";
import { Component } from "$react";
import { Button, Col, Form, InputGroup, Row } from "$react-bootstrap";
import { Confirm } from "../dialog/confirm.ts";
import { dialog } from "../dialog/dialog.ts";
import { locale } from "../i18n/locale.ts";
import { GenericMeter, CircleFill, SmFieldProps, format } from "./common.tsx";

type State = { gifts: Record<string, number> }
type Props = State & SmFieldProps

type Value = { label: string, gift: string, renown: number };

const map: Record<string, Value> = {};

const firstKey = buildGiftKey(0, "");
map[firstKey] = { label: "-", gift: "", renown: 0 };

const multiplier = 2;
const giftsKeys: { categoryKey: string, groupKey: string, renown: number }[] = [];

const localeGifts = locale.gifts as Record<string, any>;

for (const categoryKey in locale.gifts) {
    if (categoryKey != "name") {
        const category = localeGifts[categoryKey];
        for (const groupKey in category) {
            if (groupKey != "name") {

                let renown = 0;

                switch (groupKey) {
                    case "one":
                        renown = 1;
                        break;
                    case "two":
                        renown = 2;
                        break;
                    case "three":
                        renown = 3;
                        break;
                    case "four":
                        renown = 4;
                        break;
                    case "five":
                        renown = 5;
                        break;
                    case "six":
                        renown = 6;
                        break;
                    case "seven":
                        renown = 7;
                        break;
                    case "eight":
                        renown = 8;
                        break;
                    case "nine":
                        renown = 9;
                        break;
                }

                giftsKeys.push({ categoryKey, groupKey, renown });

                const group = category[groupKey];

                for (const key in group) {
                    const data = { label: group[key], gift: key, renown };
                    map[buildGiftKey(renown, key)] = data;
                }
            }
        }
    }
}

function buildGiftKey(renown: number, gift: string): string {
    return `${renown}|${gift}`;
}

export class GiftsField extends Component<Props, State> {
    static override contextType = CharacterBagContext
    declare context: React.ContextType<typeof CharacterBagContext>

    constructor(props: Props) {
        super(props);
        this.state = {
            gifts: props.gifts
        }
    }

    public override componentDidUpdate(prev: Props) {
        if (JSON.stringify(prev.gifts) !== JSON.stringify(this.props.gifts)) {
            this.setState({ gifts: this.props.gifts });
        }
    }

    private giftOrigin(renown: number): string {
        let result = "";
        switch (renown) {
            case 2:
            case 5:
            case 8:
                result = locale.auspice.name;
                break;
            case 3:
            case 6:
            case 9:
                result = locale.tribe.name;
                break;
            default:
                result = locale.native;
                break
        }
        return result;
    }

    private dotsRenown(amount: number): string {
        const indexSpace = amount > 5
            ? (Math.ceil(amount / 2) + 1)
            : 0;
        let result = "";
        for (let i = 1; i <= amount; i++) {
            if (i == indexSpace) {
                result += " ";
            }

            result += "●";
        }
        return result;
    }

    private onChange(oldGift: string, target: HTMLSelectElement): void {
        const [renownValue, gift] = target.value.split("|", 2);
        const renown = parseInt(renownValue);
        const oldRenown = this.state.gifts[oldGift];
        delete this.state.gifts[oldGift];
        this.state.gifts[gift] = renown;

        if (this.context.mode == CharacterMode.Tracked) {
            this.context.updateSpentExperience(renown * multiplier - (oldRenown * multiplier));
        }

        this.setState({ gifts: this.state.gifts });
    }

    private onCreate(): void {
        const value = map[firstKey];
        this.state.gifts[value.gift] = value.renown;
        this.setState({ gifts: this.state.gifts });
    }

    private async onRemove(gift: string, label: string): Promise<void> {
        if (await dialog(new Confirm(format(locale.onRemove.gifts, label)))) {
            const renown = this.state.gifts[gift];

            delete this.state.gifts[gift];

            if (this.context.mode == CharacterMode.Tracked && renown != 0) {
                this.context.updateSpentExperience(renown * multiplier);
            }

            this.setState({ gifts: this.state.gifts });
        }
    }

    public override render() {
        return <Col sm={this.props.sm} className="mb-2">
            <Row className="align-items-center mb-2">
                <Col className="text-center">
                    {this.context.canUpdate && <Button className="me-1" size="sm" variant="secondary" onClick={() => this.onCreate()}><i className="bi bi-plus" /></Button>}
                    <b>{locale.gifts.name}</b>
                </Col>
            </Row>
            {keys(this.state.gifts).map((gift, index) => {
                const key = buildGiftKey(this.state.gifts[gift], gift);
                const label = map[key].label;
                return <Row className="align-items-center mb-1" key={`gift-${this.state.gifts[gift]}-${gift}-${index}`}>
                    {this.context.canUpdate ? <Col className="text-center"><InputGroup>
                        <Button size="sm" variant="danger" onClick={async () => await this.onRemove(gift, label)}>
                            <i className="bi bi-trash3" />
                        </Button>
                        <Form.Select size="sm" onChange={e => this.onChange(gift, e.target as HTMLSelectElement)}>
                            <option value="">-</option>
                            {giftsKeys.map(item => {
                                const category = localeGifts[item.categoryKey];
                                const group = category[item.groupKey];
                                return <optgroup label={`${this.dotsRenown(item.renown)} ${category.name}`} key={`${item.categoryKey}-${item.groupKey}`}>
                                    {keys(group).map(giftOption => {
                                        const optionKey = buildGiftKey(item.renown, giftOption as string);
                                        return <option selected={key == optionKey} key={optionKey}
                                            value={optionKey}>{group[giftOption]}</option>
                                    })}
                                </optgroup>
                            })}
                        </Form.Select></InputGroup></Col> : <>
                        <Col className="text-end">
                            <GenericMeter
                                amount={this.state.gifts[gift]}
                                put={() => CircleFill}
                            />
                        </Col>
                        <Col className="text-start">{label}</Col>
                        <Col className="text-start">({this.giftOrigin(this.state.gifts[gift])})</Col>
                    </>}
                </Row>
            })}
        </Col>
    }
}