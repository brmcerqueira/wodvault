import {
  AnimalismType,
  AuspexType,
  BloodSorceryType,
  CelerityType,
  DominateType,
  FortitudeType,
  ObfuscateType,
  OblivionType,
  PotenceType,
  PresenceType,
  ProteanType,
  RitualsType,
  ThinBloodAlchemyType,
} from "../character.ts";

export type Named = {
  name: string;
};

export type DisciplineType = {
  value: number;
} & Named;

export type LocaleType = {
  player: string;
  attributes: {
    physical: {
      strength: string;
      dexterity: string;
      stamina: string;
    };
    social: {
      charisma: string;
      manipulation: string;
      composure: string;
    };
    mental: {
      intelligence: string;
      wits: string;
      resolve: string;
    };
  } & Named;
  skills: {
    physical: {
      athletics: string;
      brawl: string;
      craft: string;
      drive: string;
      firearms: string;
      melee: string;
      larceny: string;
      stealth: string;
      survival: string;
    };
    social: {
      animalKen: string;
      etiquette: string;
      insight: string;
      intimidation: string;
      leadership: string;
      performance: string;
      persuasion: string;
      streetwise: string;
      subterfuge: string;
    };
    mental: {
      academics: string;
      awareness: string;
      finance: string;
      investigation: string;
      medicine: string;
      occult: string;
      politics: string;
      science: string;
      technology: string;
    };
  } & Named;
  hunger: string;
  disciplines: {
    animalism: Named & Record<AnimalismType, DisciplineType>;
    auspex: Named & Record<AuspexType, DisciplineType>;
    dominate: Named & Record<DominateType, DisciplineType>;
    bloodSorcery: Named & Record<BloodSorceryType, DisciplineType>;
    fortitude: Named & Record<FortitudeType, DisciplineType>;
    protean: Named & Record<ProteanType, DisciplineType>;
    obfuscate: Named & Record<ObfuscateType, DisciplineType>;
    potence: Named & Record<PotenceType, DisciplineType>;
    oblivion: Named & Record<OblivionType, DisciplineType>;
    presence: Named & Record<PresenceType, DisciplineType>;
    celerity: Named & Record<CelerityType, DisciplineType>;
    rituals: Named & Record<RitualsType, DisciplineType>;
    thinBloodAlchemy:
      & Named
      & Record<ThinBloodAlchemyType, DisciplineType>;
  } & Named;
  renown: {
    glory: string;
    honor: string;
    wisdom: string;
  } & Named;
};
