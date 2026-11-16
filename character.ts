export enum CharacterMode {
  Opened,
  Tracked,
  Closed,
}

export enum CharacterKind {
  Vampire,
  Werewolf,
}

export type Damage = {
  superficial: number;
  aggravated: number;
  penalty: number;
};

export type PhysicalSkillType =
  | "athletics"
  | "brawl"
  | "craft"
  | "drive"
  | "firearms"
  | "melee"
  | "larceny"
  | "stealth"
  | "survival";

export type SocialSkillType =
  | "animalKen"
  | "etiquette"
  | "insight"
  | "intimidation"
  | "leadership"
  | "performance"
  | "persuasion"
  | "streetwise"
  | "subterfuge";

export type MentalSkillType =
  | "academics"
  | "awareness"
  | "finance"
  | "investigation"
  | "medicine"
  | "occult"
  | "politics"
  | "science"
  | "technology";

export type AnimalismType =
  | "bondFamulus"
  | "senseTheBeast"
  | "feralWhispers"
  | "animalSucculence"
  | "quellTheBeast"
  | "unlivingHive"
  | "subsumeTheSpirit"
  | "animalDominion"
  | "drawingOutTheBeast";

export type AuspexType =
  | "heightenedSenses"
  | "senseTheUnseen"
  | "obeah"
  | "premonition"
  | "scryTheSoul"
  | "shareTheSenses"
  | "spiritsTouch"
  | "clairvoyance"
  | "possession"
  | "telepathy"
  | "unburdeningTheBestialSoul";

export type DominateType =
  | "cloudMemory"
  | "compel"
  | "mesmerize"
  | "dementation"
  | "domitorsFavor"
  | "slavishDevotion"
  | "theForgetfulMind"
  | "submergedDirective"
  | "ancestralDominion"
  | "rationalize"
  | "massManipulation"
  | "terminalDecree";

export type BloodSorceryType =
  | "corrosiveVitae"
  | "aTasteForBlood"
  | "extinguishVitae"
  | "bloodOfPotency"
  | "scorpionsTouch"
  | "theftOfVitae"
  | "baalsCaress"
  | "cauldronOfBlood";

export type FortitudeType =
  | "resilience"
  | "unswayableMind"
  | "toughness"
  | "enduringBeasts"
  | "valeren"
  | "defyBane"
  | "fortifyTheInnerFacade"
  | "draughtOfEndurance"
  | "shatter"
  | "fleshOfMarble"
  | "prowessFromPain";

export type ProteanType =
  | "eyesOfTheBeast"
  | "weightOfTheFeather"
  | "feralWeapons"
  | "vicissitude"
  | "serpentsKiss"
  | "earthMeld"
  | "shapechange"
  | "fleshCrafting"
  | "metamorphosis"
  | "horridForm"
  | "mistForm"
  | "theUnfetteredHeart"
  | "oneWithTheLand"
  | "theHeartOfDarkness";

export type ObfuscateType =
  | "cloakOfShadows"
  | "silenceOfDeath"
  | "unseenPassage"
  | "chimerstry"
  | "mentalMaze"
  | "ghostInTheMachine"
  | "maskOfAThousandFaces"
  | "fataMorgana"
  | "conceal"
  | "vanish"
  | "cloakTheGathering"
  | "impostorsGuise";

export type PotenceType =
  | "lethalBody"
  | "soaringLeap"
  | "prowess"
  | "brutalFeed"
  | "sparkOfRage"
  | "uncannyGrip"
  | "draughtOfMight"
  | "earthshock"
  | "fistOfCaine";

export type OblivionType =
  | "ashesToAshes"
  | "oblivionsSight"
  | "shadowCloak"
  | "theBindingFeather"
  | "fatalPrecognition"
  | "shadowCast"
  | "armsOfAhriman"
  | "whereTheShroudThins"
  | "auraOfDecay"
  | "passionFeast"
  | "shadowPerspective"
  | "touchOfOblivion"
  | "necroticPlague"
  | "stygianShroud"
  | "shadowStep"
  | "skuldFulfilled"
  | "tenebrousAvatar"
  | "witheringSpirit";

export type PresenceType =
  | "awe"
  | "daunt"
  | "eyesOfTheSerpent"
  | "lingeringKiss"
  | "dreadGaze"
  | "entrancement"
  | "trueLovesFace"
  | "irresistibleVoice"
  | "summon"
  | "majesty"
  | "starMagnetism";

export type CelerityType =
  | "catsGrace"
  | "rapidReflexes"
  | "fleetness"
  | "blink"
  | "traversal"
  | "draughtOfElegance"
  | "unerringAim"
  | "lightningStrike"
  | "splitSecond";

export type RitualsType =
  | "bloodWalk"
  | "clingingOfTheInsect"
  | "craftBloodstone"
  | "wakeWithEveningsFreshness"
  | "wardAgainstGhouls"
  | "communicateWithKindredSire"
  | "eyesOfBabel"
  | "illuminateTheTrailOfPrey"
  | "ishtarsTouch"
  | "truthOfBlood"
  | "wardAgainstSpirits"
  | "wardingCircleAgainstGhouls"
  | "dagonsCall"
  | "deflectionOfWoodenDoom"
  | "essenceOfAir"
  | "firewalker"
  | "wardAgainstLupines"
  | "wardingCircleAgainstSpirits"
  | "oneWithTheBlade"
  | "defenseOfTheSacredHaven"
  | "eyesOfTheNighthawk"
  | "incorporealPassage"
  | "wardAgainstCainites"
  | "wardingCircleAgainstLupines"
  | "escapeToTrueSanctuary"
  | "heartOfStone"
  | "shaftOfBelatedDissolution"
  | "wardingCircleAgainstCainites";

export type ThinBloodAlchemyType =
  | "farReach"
  | "haze"
  | "envelop"
  | "profaneHierosGamos"
  | "defractionate"
  | "airborneMomentum"
  | "awakenTheSleeper";

export type Character = {
  id: string;
  timestamp: number;
  details: string;
  image: string;
  name: string;
  player: string;
  playerId: string;
  owner: string | null;
  mode: CharacterMode;
  kind: CharacterKind;
  attributes: {
    physical: {
      strength: number;
      dexterity: number;
      stamina: number;
    };
    social: {
      charisma: number;
      manipulation: number;
      composure: number;
    };
    mental: {
      intelligence: number;
      wits: number;
      resolve: number;
    };
  };
  skills: {
    physical: Record<PhysicalSkillType, number>;
    social: Record<SocialSkillType, number>;
    mental: Record<MentalSkillType, number>;
  };
  health: Damage & {
    start: number;
  };
  willpower: Damage;
  experience: {
    total: number;
    spent: number;
  };
  specialties: Record<
    PhysicalSkillType & SocialSkillType & MentalSkillType,
    string[]
  >;
  advantages: Record<string, number>;
  flaws: Record<string, number>;
  hungerOrRage: number;
  resonance: string;
  ambition: string;
  desire: string;
  predator: string;
  clan: string;
  generation: number;
  humanity: {
    total: number;
    stains: number;
  };
  bloodPotency: number;
  disciplines: {
    animalism?: AnimalismType[];
    auspex?: AuspexType[];
    dominate?: DominateType[];
    bloodSorcery?: BloodSorceryType[];
    fortitude?: FortitudeType[];
    protean?: ProteanType[];
    obfuscate?: ObfuscateType[];
    oblivion?: OblivionType[];
    potence?: PotenceType[];
    presence?: PresenceType[];
    celerity?: CelerityType[];
    rituals?: RitualsType[];
    thinBloodAlchemy?: ThinBloodAlchemyType[];
  };
  auspice: string;
  tribe: string;
  renown: {
    glory: number;
    honor: number;
    wisdom: number;
  };
  harano: number;
  hauglosk: number;
  gifts: Record<string, number>;
  rites: string[];
};
