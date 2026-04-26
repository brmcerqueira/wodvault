/** @jsxImportSource $react */
/** @jsxRuntime automatic */

import { Character } from "../../../character.ts";
import { Component } from "$react";
import { Col, Container, Row } from "$react-bootstrap";
import { DotsField } from "../fields/dotsField.tsx";
import { locale } from "../i18n/locale.ts";

export class Attributes extends Component<{
  get<T>(callback: (character: Character) => T): () => T
  update<T>(callback: (character: Character, value: T) => void): (value?: T) => void
}> {
  public override render() {
    return <Container>
      <Row className="align-items-center mb-2">
        <Col className="text-center">
          <b>{locale.attributes.name}</b>
        </Col>
      </Row>
      <Row>
        <Col sm={4} className="mb-2">
          <Row className="align-items-center">
            <Col className="text-center mb-2">
              <b>{locale.physical}</b>
            </Col>
          </Row>
          <DotsField name={locale.attributes.physical.strength} min={1} total={5} multiplier={5}
            get={this.props.get(c => c.attributes.physical.strength)}
            update={this.props.update((c, v) => c.attributes.physical.strength = v)} />
          <DotsField name={locale.attributes.physical.dexterity} min={1} total={5} multiplier={5}
            get={this.props.get(c => c.attributes.physical.dexterity)}
            update={this.props.update((c, v) => c.attributes.physical.dexterity = v)} />
          <DotsField name={locale.attributes.physical.stamina} min={1} total={5} multiplier={5}
            get={this.props.get(c => c.attributes.physical.stamina)}
            update={this.props.update((c, v) => c.attributes.physical.stamina = v)} />
        </Col>
        <Col sm={4} className="mb-2">
          <Row className="align-items-center">
            <Col className="text-center mb-2">
              <b>{locale.social}</b>
            </Col>
          </Row>
          <DotsField name={locale.attributes.social.charisma} min={1} total={5} multiplier={5}
            get={this.props.get(c => c.attributes.social.charisma)}
            update={this.props.update((c, v) => c.attributes.social.charisma = v)} />
          <DotsField name={locale.attributes.social.manipulation} min={1} total={5} multiplier={5}
            get={this.props.get(c => c.attributes.social.manipulation)}
            update={this.props.update((c, v) => c.attributes.social.manipulation = v)} />
          <DotsField name={locale.attributes.social.composure} min={1} total={5} multiplier={5}
            get={this.props.get(c => c.attributes.social.composure)}
            update={this.props.update((c, v) => c.attributes.social.composure = v)} />
        </Col>
        <Col sm={4} className="mb-2">
          <Row className="align-items-center">
            <Col className="text-center mb-2">
              <b>{locale.mental}</b>
            </Col>
          </Row>
          <DotsField name={locale.attributes.mental.intelligence} min={1} total={5} multiplier={5}
            get={this.props.get(c => c.attributes.mental.intelligence)}
            update={this.props.update((c, v) => c.attributes.mental.intelligence = v)} />
          <DotsField name={locale.attributes.mental.wits} min={1} total={5} multiplier={5}
            get={this.props.get(c => c.attributes.mental.wits)}
            update={this.props.update((c, v) => c.attributes.mental.wits = v)} />
          <DotsField name={locale.attributes.mental.resolve} min={1} total={5} multiplier={5}
            get={this.props.get(c => c.attributes.mental.resolve)}
            update={this.props.update((c, v) => c.attributes.mental.resolve = v)} />
        </Col>
      </Row>
    </Container>;
  }
}