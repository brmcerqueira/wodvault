/** @jsxImportSource $react */
/** @jsxRuntime automatic */

import { Character } from "../../../domain/character.ts";
import { Component } from "$react";
import { Col, Container, Row } from "$react-bootstrap";
import { DotsField } from "../fields/dotsField.tsx";
import { locale } from "../i18n/locale.ts";

export class Skills extends Component<{
    get<T>(callback: (character: Character) => T): () => T
    update<T>(callback: (character: Character, value: T) => void): (value?: T) => void
}> {
    public override render() {
        return <Container>
            <Row className="align-items-center mb-2">
                <Col className="text-center">
                    <b>{locale.skills.name}</b>
                </Col>
            </Row>
            <Row>
                <Col sm={4} className="mb-2">
                    <Row className="align-items-center">
                        <Col className="text-center mb-2">
                            <b>{locale.physical}</b>
                        </Col>
                    </Row>
                    <DotsField name={locale.skills.physical.melee} total={5} multiplier={3}
                        get={this.props.get(c => c.skills.physical.melee)}
                        update={this.props.update((c, v) => c.skills.physical.melee = v)} />
                    <DotsField name={locale.skills.physical.firearms} total={5} multiplier={3}
                        get={this.props.get(c => c.skills.physical.firearms)}
                        update={this.props.update((c, v) => c.skills.physical.firearms = v)} />
                    <DotsField name={locale.skills.physical.athletics} total={5} multiplier={3}
                        get={this.props.get(c => c.skills.physical.athletics)}
                        update={this.props.update((c, v) => c.skills.physical.athletics = v)} />
                    <DotsField name={locale.skills.physical.brawl} total={5} multiplier={3}
                        get={this.props.get(c => c.skills.physical.brawl)}
                        update={this.props.update((c, v) => c.skills.physical.brawl = v)} />
                    <DotsField name={locale.skills.physical.drive} total={5} multiplier={3}
                        get={this.props.get(c => c.skills.physical.drive)}
                        update={this.props.update((c, v) => c.skills.physical.drive = v)} />
                    <DotsField name={locale.skills.physical.stealth} total={5} multiplier={3}
                        get={this.props.get(c => c.skills.physical.stealth)}
                        update={this.props.update((c, v) => c.skills.physical.stealth = v)} />
                    <DotsField name={locale.skills.physical.larceny} total={5} multiplier={3}
                        get={this.props.get(c => c.skills.physical.larceny)}
                        update={this.props.update((c, v) => c.skills.physical.larceny = v)} />
                    <DotsField name={locale.skills.physical.craft} total={5} multiplier={3}
                        get={this.props.get(c => c.skills.physical.craft)}
                        update={this.props.update((c, v) => c.skills.physical.craft = v)} />
                    <DotsField name={locale.skills.physical.survival} total={5} multiplier={3}
                        get={this.props.get(c => c.skills.physical.survival)}
                        update={this.props.update((c, v) => c.skills.physical.survival = v)} />
                </Col>
                <Col sm={4} className="mb-2">
                    <Row className="align-items-center">
                        <Col className="text-center mb-2">
                            <b>{locale.social}</b>
                        </Col>
                    </Row>
                    <DotsField name={locale.skills.social.animalKen} total={5} multiplier={3}
                        get={this.props.get(c => c.skills.social.animalKen)}
                        update={this.props.update((c, v) => c.skills.social.animalKen = v)} />
                    <DotsField name={locale.skills.social.etiquette} total={5} multiplier={3}
                        get={this.props.get(c => c.skills.social.etiquette)}
                        update={this.props.update((c, v) => c.skills.social.etiquette = v)} />
                    <DotsField name={locale.skills.social.intimidation} total={5} multiplier={3}
                        get={this.props.get(c => c.skills.social.intimidation)}
                        update={this.props.update((c, v) => c.skills.social.intimidation = v)} />
                    <DotsField name={locale.skills.social.leadership} total={5} multiplier={3}
                        get={this.props.get(c => c.skills.social.leadership)}
                        update={this.props.update((c, v) => c.skills.social.leadership = v)} />
                    <DotsField name={locale.skills.social.streetwise} total={5} multiplier={3}
                        get={this.props.get(c => c.skills.social.streetwise)}
                        update={this.props.update((c, v) => c.skills.social.streetwise = v)} />
                    <DotsField name={locale.skills.social.performance} total={5} multiplier={3}
                        get={this.props.get(c => c.skills.social.performance)}
                        update={this.props.update((c, v) => c.skills.social.performance = v)} />
                    <DotsField name={locale.skills.social.persuasion} total={5} multiplier={3}
                        get={this.props.get(c => c.skills.social.persuasion)}
                        update={this.props.update((c, v) => c.skills.social.persuasion = v)} />
                    <DotsField name={locale.skills.social.insight} total={5} multiplier={3}
                        get={this.props.get(c => c.skills.social.insight)}
                        update={this.props.update((c, v) => c.skills.social.insight = v)} />
                    <DotsField name={locale.skills.social.subterfuge} total={5} multiplier={3}
                        get={this.props.get(c => c.skills.social.subterfuge)}
                        update={this.props.update((c, v) => c.skills.social.subterfuge = v)} />
                </Col>
                <Col sm={4} className="mb-2">
                    <Row className="align-items-center">
                        <Col className="text-center mb-2">
                            <b>{locale.mental}</b>
                        </Col>
                    </Row>
                    <DotsField name={locale.skills.mental.science} total={5} multiplier={3}
                        get={this.props.get(c => c.skills.mental.science)}
                        update={this.props.update((c, v) => c.skills.mental.science = v)} />
                    <DotsField name={locale.skills.mental.academics} total={5} multiplier={3}
                        get={this.props.get(c => c.skills.mental.academics)}
                        update={this.props.update((c, v) => c.skills.mental.academics = v)} />
                    <DotsField name={locale.skills.mental.finance} total={5} multiplier={3}
                        get={this.props.get(c => c.skills.mental.finance)}
                        update={this.props.update((c, v) => c.skills.mental.finance = v)} />                    
                    <DotsField name={locale.skills.mental.investigation} total={5} multiplier={3}
                        get={this.props.get(c => c.skills.mental.investigation)}
                        update={this.props.update((c, v) => c.skills.mental.investigation = v)} />
                    <DotsField name={locale.skills.mental.medicine} total={5} multiplier={3}
                        get={this.props.get(c => c.skills.mental.medicine)}
                        update={this.props.update((c, v) => c.skills.mental.medicine = v)} />
                    <DotsField name={locale.skills.mental.occult} total={5} multiplier={3}
                        get={this.props.get(c => c.skills.mental.occult)}
                        update={this.props.update((c, v) => c.skills.mental.occult = v)} />
                    <DotsField name={locale.skills.mental.awareness} total={5} multiplier={3}
                        get={this.props.get(c => c.skills.mental.awareness)}
                        update={this.props.update((c, v) => c.skills.mental.awareness = v)} />
                    <DotsField name={locale.skills.mental.politics} total={5} multiplier={3}
                        get={this.props.get(c => c.skills.mental.politics)}
                        update={this.props.update((c, v) => c.skills.mental.politics = v)} />
                    <DotsField name={locale.skills.mental.technology} total={5} multiplier={3}
                        get={this.props.get(c => c.skills.mental.technology)}
                        update={this.props.update((c, v) => c.skills.mental.technology = v)} />
                </Col>
            </Row>
        </Container>;
    }
}