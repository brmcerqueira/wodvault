/** @jsxImportSource $react */
/** @jsxRuntime automatic */

import { CharacterMode } from "../../../character.ts";
import { DisciplineLevelLocale, LocaleType } from "../../../i18n/localeType.ts";
import { keys } from "../../../utils.ts";
import { CharacterBagContext } from "../characterBag.ts";
import { Component, createRef } from "$react";
import { Button, Col, Container, Form, InputGroup, Row } from "$react-bootstrap";
import { Confirm } from "../dialog/confirm.ts";
import { dialog } from "../dialog/dialog.ts";
import { locale } from "../i18n/locale.ts";
import { calculateSpent, CircleFill, format, GenericMeter } from "./common.tsx";

const optionsGroups = keys(locale.disciplines).filter(key => key != "name");

type LocaleDisciplinesKeys = Exclude<keyof LocaleType["disciplines"], "name">;
type State = { disciplines: Record<string, string[]> }
type Props = { clan: string; } & State

function buildDisciplineKey(level: string, discipline: string): string {
    return `${level}|${discipline}`;
}

export class DisciplinesField extends Component<Props, State> {
    static override contextType = CharacterBagContext
    declare context: React.ContextType<typeof CharacterBagContext>
    private selectRef = createRef<HTMLSelectElement>();

    constructor(props: Props) {
        super(props);
        this.state = {
            disciplines: props.disciplines
        }
    }

    public override componentDidUpdate(prev: Props) {
        if (JSON.stringify(prev.disciplines) !== JSON.stringify(this.props.disciplines)) {
            this.setState({ disciplines: this.props.disciplines });
        }
    }

    private multiplier(discipline: string): number {
        const array = locale.clan.options[this.props.clan];

        if (array == null || discipline == "rituals") {
            return 3;
        }

        if (array && array.indexOf(discipline) > -1) {
            return 5;
        }

        return 7;
    }

    private onAdd(): void {
        const disciplines = this.state.disciplines;

        const [level, discipline] = this.selectRef.current!.value.split("|", 2);

        if (disciplines[discipline] === undefined) {
            disciplines[discipline] = [];
        }

        const array = disciplines[discipline];

        if (array.indexOf(level) == -1) {
            array.push(level);
        }

        if (this.context.mode == CharacterMode.Tracked) {
            this.context.updateSpentExperience(calculateSpent(array.length - 1, array.length, this.multiplier(discipline)));
        }

        this.setState({ disciplines: disciplines });
    }

    private async onRemove(discipline: string, level: string): Promise<void> {
        if (await dialog(new Confirm(format(locale.onRemove.disciplines, (locale.disciplines as any)[discipline][level].name,
            locale.disciplines[discipline as LocaleDisciplinesKeys].name)))) {
            const disciplines = this.state.disciplines;

            const array = disciplines[discipline];

            array.splice(array.indexOf(level), 1);

            if (array.length == 0) {
                delete disciplines[discipline];
            }

            if (this.context.mode == CharacterMode.Tracked) {
                this.context.updateSpentExperience(calculateSpent(array.length + 1, array.length, this.multiplier(discipline)));
            }

            this.setState({ disciplines: disciplines });
        }
    }

    public override render() {
        return <Container>
            <Row className="align-items-center mb-2">
                <Col sm={12} className="text-center">
                    <b>{locale.disciplines.name}</b>
                    {this.context.canUpdate && <InputGroup>
                        <Button size="sm" variant="secondary" onClick={() => this.onAdd()}><i className="bi bi-plus" /></Button>
                        <Form.Select ref={this.selectRef} size="sm">
                            {optionsGroups.map(discipline => <optgroup label={locale.disciplines[discipline].name} key={discipline}>
                                {keys(locale.disciplines[discipline]).filter(key => key != "name").map(level => {
                                    const levelLocale: DisciplineLevelLocale = locale.disciplines[discipline][level];
                                    return <option key={level}
                                        value={buildDisciplineKey(level, discipline)}>{"●".repeat(levelLocale.value)} {levelLocale.name}</option>
                                })}
                            </optgroup>)}
                        </Form.Select>
                    </InputGroup>}
                </Col>
            </Row>
            <Row>
                {keys(this.state.disciplines).map(discipline =>
                    <Col sm={4} className="mb-5" key={discipline}>
                        <Row className="align-items-center mb-2">
                            <Col className="text-end">
                                <b>{locale.disciplines[discipline as LocaleDisciplinesKeys].name}</b>
                            </Col>
                            <Col className="text-center">
                                <GenericMeter
                                    amount={this.state.disciplines[discipline]!.length}
                                    put={() => CircleFill}
                                />
                            </Col>
                        </Row>
                        {this.state.disciplines[discipline]?.map(level => {
                            const levelLocale: DisciplineLevelLocale = (locale.disciplines as any)[discipline][level];
                            return <Row className="align-items-center mb-1" key={level}>
                                {this.context.canUpdate && <Col sm={1} xs={1} className="text-end"><Button size="sm" variant="danger" onClick={async () => await this.onRemove(discipline, level)}>
                                    <i className="bi bi-trash3" />
                                </Button></Col>}
                                <Col sm={this.context.canUpdate ? 3 : 4} xs={this.context.canUpdate ? 3 : 4} className="text-end"><GenericMeter
                                    amount={levelLocale.value}
                                    put={() => CircleFill}
                                /></Col>
                                <Col sm={8} xs={8} className="text-start">{levelLocale.name}</Col>
                            </Row>
                        })}
                    </Col>
                )}
            </Row>
        </Container>
    }
}