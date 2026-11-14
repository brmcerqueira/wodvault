import { CharacterKind } from "../../character.ts";
import { Col, Container, Form, Row } from "react-bootstrap";
import { TextField } from "./fields/textField.tsx";
import { SelectField } from "./fields/selectField.tsx";
import { ExperienceField } from "./fields/experienceField.tsx";
import { Attributes } from "./sections/attributes.tsx";
import { Skills } from "./sections/skills.tsx";
import { SquaresField } from "./fields/squaresField.tsx";
import { SquaresXField } from "./fields/squaresXField.tsx";
import { DamageField } from "./fields/damageField.tsx";
import { SpecialtiesField } from "./fields/specialtiesField.tsx";
import { RitesField } from "./fields/ritesField.tsx";
import { DotsField } from "./fields/dotsField.tsx";
import { GiftsField } from "./fields/giftsField.tsx";
import { DetailsField } from "./fields/detailsField.tsx";
import { ImageField } from "./fields/imageField.tsx";
import { locale } from "./i18n/locale.ts";
import { JSX } from "react/jsx-runtime";
import { CharacterSheet } from "./characterSheet.tsx";
import { RecordDotsField } from "./fields/recordDotsField.tsx";

export class Werewolf extends CharacterSheet {
  constructor() {
    super(CharacterKind.Werewolf);
  }

  protected override sheet(): JSX.Element {
    return (
      <>
        <Container>
          <Row className="align-items-end character-head">
            <Col sm={4} className="mb-2 text-center">
              <ImageField character={this.state.character} />
            </Col>
            <Col sm={4} className="mb-2">
              <TextField
                name={locale.name}
                get={this.get((c) => c.name)}
                update={this.update((c, v) => c.name = v)}
              />
              <TextField
                name={locale.player}
                get={this.get((c) => c.player)}
                update={this.update((c, v) => c.player = v)}
              />
              <ExperienceField
                ref={this.experienceFieldRef}
                experience={this.state.character.experience}
              />
            </Col>
            <Col sm={4} className="mb-2">
              <SelectField
                name={locale.auspice.name}
                options={locale.auspice.options}
                canEmpty
                get={this.get((c) => c.auspice)}
                update={this.update((c, v) => c.auspice = v)}
              />
              <SelectField
                name={locale.tribe.name}
                options={locale.tribe.options}
                canEmpty
                get={this.get((c) => c.tribe)}
                update={this.update((c, v) => c.tribe = v)}
              />
              <Row className="align-items-center">
              </Row>
            </Col>
          </Row>
        </Container>
        <hr />
        <Attributes get={(c) => this.get(c)} update={(c) => this.update(c)} />
        <hr />
        <Container>
          <Row>
            <Col sm={2}>
              <SquaresField
                name={locale.harano}
                total={5}
                get={this.get((c) => c.harano)}
                update={this.update((c, v) => c.harano = v)}
              />
            </Col>
            <Col sm={3}>
              <DamageField
                name={locale.health}
                total={this.state.character.attributes.physical.stamina +
                  this.state.character.health.start}
                damage={this.state.character.health}
              >
                {this.state.characterBag.canUpdate && (
                  <Row className="align-items-center mt-1">
                    <Col className="text-start">
                      <Form.Control
                        size="sm"
                        type="number"
                        step={1}
                        min={0}
                        defaultValue={this.state.character.health.start}
                        onChange={(e) =>
                          this.update<number>((c, v) => c.health.start = v)(
                            parseInt(e.target.value),
                          )}
                      />
                    </Col>
                  </Row>
                )}
              </DamageField>
            </Col>
            <Col sm={2}>
              <SquaresXField
                name={locale.rage}
                total={5}
                open
                get={this.get((c) => c.hungerOrRage)}
                update={this.update((c, v) => c.hungerOrRage = v)}
              />
            </Col>
            <Col sm={3}>
              <DamageField
                name={locale.willpower}
                total={this.state.character.attributes.social.composure +
                  this.state.character.attributes.mental.resolve}
                damage={this.state.character.willpower}
              />
            </Col>
            <Col sm={2}>
              <SquaresField
                name={locale.hauglosk}
                total={5}
                get={this.get((c) => c.hauglosk)}
                update={this.update((c, v) => c.hauglosk = v)}
              />
            </Col>
          </Row>
        </Container>
        <hr />
        <Skills get={(c) => this.get(c)} update={(c) => this.update(c)} />
        <hr />
        <Container>
          <Row className="align-items-center mb-2">
            <Col className="text-center">
              <b>{locale.renown.name}</b>
            </Col>
          </Row>
          <Row>
            <Col sm={4} className="mb-2">
              <DotsField
                name={locale.renown.glory}
                total={5}
                multiplier={5}
                get={this.get((c) => c.renown.glory)}
                update={this.update((c, v) => c.renown.glory = v)}
              />
            </Col>
            <Col sm={4} className="mb-2">
              <DotsField
                name={locale.renown.honor}
                total={5}
                multiplier={5}
                get={this.get((c) => c.renown.honor)}
                update={this.update((c, v) => c.renown.honor = v)}
              />
            </Col>
            <Col sm={4} className="mb-2">
              <DotsField
                name={locale.renown.wisdom}
                total={5}
                multiplier={5}
                get={this.get((c) => c.renown.wisdom)}
                update={this.update((c, v) => c.renown.wisdom = v)}
              />
            </Col>
          </Row>
        </Container>
        <hr />
        <Container>
          <Row>
            <SpecialtiesField
              sm={4}
              specialties={this.state.character.specialties}
            />
            <RecordDotsField
              sm={4}
              name={locale.advantages}
              key="advantage"
              cost={3}
              onRemoveMessage={locale.onRemove.advantages}
              record={this.state.character.advantages}
            />
            <RecordDotsField
              sm={4}
              name={locale.flaws}
              key="flaw"
              onRemoveMessage={locale.onRemove.flaws}
              record={this.state.character.flaws}
            />
          </Row>
        </Container>
        <hr />
        <Container>
          <Row>
            <GiftsField sm={8} gifts={this.state.character.gifts} />
            <RitesField sm={4} rites={this.state.character.rites} />
          </Row>
        </Container>
        <hr />
        <DetailsField
          name={locale.details}
          get={this.get((c) => c.details)}
          update={this.update((c, v) => c.details = v)}
        />
      </>
    );
  }
}
