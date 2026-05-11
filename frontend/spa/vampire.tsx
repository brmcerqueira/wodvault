/** @jsxImportSource $react */
/** @jsxRuntime automatic */

import { CharacterKind } from "../../character.ts";;
import { Col, Container, Form, Row } from "$react-bootstrap";
import { TextField } from "./fields/textField.tsx";
import { SelectField } from "./fields/selectField.tsx";
import { ExperienceField } from "./fields/experienceField.tsx";
import { Attributes } from "./sections/attributes.tsx";
import { Skills } from "./sections/skills.tsx";
import { SquaresXField } from "./fields/squaresXField.tsx";
import { DamageField } from "./fields/damageField.tsx";
import { SpecialtiesField } from "./fields/specialtiesField.tsx";
import { DetailsField } from "./fields/detailsField.tsx";
import { ImageField } from "./fields/imageField.tsx";
import { locale } from "./i18n/locale.ts";
import { JSX } from "$react/jsx-runtime";
import { CharacterSheet } from "./characterSheet.tsx";
import { NumberField } from "./fields/numberField.tsx";
import { HumanityField } from "./fields/humanityField.tsx";
import { TraitDotsField } from "./fields/traitDotsField.tsx";
import { DisciplinesField } from "./fields/disciplinesField.tsx";
import { RecordDotsField } from "./fields/recordDotsField.tsx";
import { keys } from "../../utils.ts";

export class Vampire extends CharacterSheet {
    constructor() {
        super(CharacterKind.Vampire);
    }

    protected override sheet(): JSX.Element {
        return <>
            <Container>
                <Row className="align-items-end character-head">
                    <Col sm={3} className="mb-2 text-center">
                        <ImageField character={this.state.character} />
                    </Col>
                    <Col sm={3} className="mb-2">
                        <TextField name={locale.name} get={this.get(c => c.name)} update={this.update((c, v) => c.name = v)} />
                        <TextField name={locale.player} get={this.get(c => c.player)} update={this.update((c, v) => c.player = v)} />
                        <ExperienceField ref={this.experienceFieldRef} experience={this.state.character.experience} />
                    </Col>
                    <Col sm={3} className="mb-2">
                        <SelectField name={locale.resonance.name} options={locale.resonance.options} open canEmpty get={this.get(c => c.resonance)} update={this.update((c, v) => c.resonance = v)} />
                        <TextField name={locale.ambition} get={this.get(c => c.ambition)} update={this.update((c, v) => c.ambition = v)} />
                        <TextField name={locale.desire} get={this.get(c => c.desire)} update={this.update((c, v) => c.desire = v)} />
                    </Col>
                    <Col sm={3} className="mb-2">
                        <SelectField name={locale.predator.name} options={locale.predator.options} canEmpty get={this.get(c => c.predator)} update={this.update((c, v) => c.predator = v)} />
                        <SelectField name={locale.clan.name} options={keys(locale.clan.options)} canEmpty get={this.get(c => c.clan)} update={this.update((c, v) => c.clan = v)} />
                        <NumberField name={locale.generation} suffix=" ª" get={this.get(c => c.generation)} update={this.update((c, v) => c.generation = v)} />
                    </Col>
                </Row>
            </Container>
            <hr />
            <Attributes get={c => this.get(c)} update={c => this.update(c)} />
            <hr />
            <Container>
                <Row>
                    <Col sm={3}>
                        <TraitDotsField name={locale.bloodPotency} total={10} multiplier={10}
                            get={this.get(c => c.bloodPotency)}
                            update={this.update((c, v) => c.bloodPotency = v)} />
                    </Col>
                    <Col sm={2}>
                        <DamageField name={locale.health} total={this.state.character.attributes.physical.stamina +
                            this.state.character.health.start}
                            damage={this.state.character.health}>
                            {this.state.characterBag.canUpdate && <Row className="align-items-center mt-1">
                                <Col className="text-start"><Form.Control size="sm" type="number" step={1} min={0}
                                    defaultValue={this.state.character.health.start} onChange={e => this.update<number>((c, v) => c.health.start = v)(parseInt(e.target.value) || 0)} /></Col>
                            </Row>}
                        </DamageField>
                    </Col>
                    <Col sm={2}>
                        <SquaresXField name={locale.hunger} total={5} open
                            get={this.get(c => c.hungerOrRage)}
                            update={this.update((c, v) => c.hungerOrRage = v)} />
                    </Col>
                    <Col sm={2}>
                        <DamageField name={locale.willpower} total={this.state.character.attributes.social.composure +
                            this.state.character.attributes.mental.resolve}
                            damage={this.state.character.willpower} />
                    </Col>
                    <Col sm={3}>
                        <HumanityField humanity={this.state.character.humanity} />
                    </Col>
                </Row>
            </Container>
            <hr />
            <Skills get={c => this.get(c)} update={c => this.update(c)} />
            <hr />
            <Container>
                <Row>
                    <SpecialtiesField sm={4} specialties={this.state.character.specialties} />
                    <RecordDotsField sm={4} name={locale.advantages} key="advantage" cost={3} onRemoveMessage={locale.onRemove.advantages} record={this.state.character.advantages} />
                    <RecordDotsField sm={4} name={locale.flaws} key="flaw" onRemoveMessage={locale.onRemove.flaws} record={this.state.character.flaws} />
                </Row>
            </Container>
            <hr />
            <DisciplinesField clan={this.state.character.clan} disciplines={this.state.character.disciplines} />
            <hr />
            <DetailsField name={locale.details} get={this.get(c => c.details)} update={this.update((c, v) => c.details = v)} />
        </>
    }
}