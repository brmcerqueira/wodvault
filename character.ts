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

export type RitesCommonType =
  | "riteOfAbjuration"
  | "riteOfRage"
  | "riteOfTranquility"
  | "riteOfContrition"
  | "riteOfForgetfulRecord"
  | "riteOfTheLivingCaern"
  | "riteOfShadowPassage"
  | "riteOfDedication"
  | "riteOfKinseeking"
  | "riteOfSpiritSummoning"
  | "riteOfBinding"
  | "riteOfShame"
  | "riteOfPatronage"
  | "riteOfCelebration"
  | "riteOfCaernBuilding"
  | "riteOfTheWolfReborn"
  | "riteOfTheWhisperingField"
  | "riteOfTheShroudedGlen";

export type RitesSocialType =
  | "riteOfPassage"
  | "satireRite"
  | "riteOfAccomplishment"
  | "gatheringForTheDeparted"
  | "riteOfTheWinterWolf";

export type NativeOneType =
  | "catfeet"
  | "eyesOfTheOwl"
  | "haresLeap"
  | "penumbralSenses"
  | "ragingStrike"
  | "staredown";

export type NativeFourType =
  | "sharpenedSenses"
  | "spiritOfTheFray"
  | "thwartingTheArrow";

export type NativeSevenType =
  | "bodyShift"
  | "jamTechnology"
  | "tongueOfTheBeasts";

export type RagabashTwoType =
  | "blissfulIgnorance"
  | "crowsLaughter"
  | "gremlins"
  | "spidersSong";

export type RagabashFiveType =
  | "blurOfTheMilkyEye"
  | "openSeal"
  | "pulseOfThePrey"
  | "scentOfRunningWater";

export type RagabashEightType =
  | "lunasBlessing"
  | "thievingTalonsOfTheMagpie"
  | "theThousandForms"
  | "whelpBody";

export type TheurgeTwoType =
  | "ensnareSpirit"
  | "mothersTouch"
  | "shadowSense"
  | "sightFromBeyond";

export type TheurgeFiveType =
  | "banishSpirit"
  | "graspFromBeyond"
  | "mindspeak"
  | "umbralTether";

export type TheurgeEightType =
  | "commandSpirit"
  | "drainSpirit"
  | "feralRegression"
  | "livingWard";

export type PhilodoxTwoType =
  | "ancestralConviction"
  | "gaiasCandor"
  | "porcupinesReprisal"
  | "senseTheTrueForm";

export type PhilodoxFiveType =
  | "beastsFealty"
  | "commandTheGathering"
  | "fangsOfJudgement"
  | "scentOfThePast";

export type PhilodoxEightType =
  | "geas"
  | "oathbreakersBane"
  | "strengthOfPurpose"
  | "takeTheTrueForm";

export type GalliardTwoType =
  | "animalMagnetism"
  | "howlOfAssembly"
  | "songOfRage"
  | "songOfSerenity";

export type GalliardFiveType =
  | "callTheRidden"
  | "eyesOfTheCobra"
  | "songOfValor"
  | "songOfInspiration";

export type GalliardEightType =
  | "againstTheOdds"
  | "breakTheShackles"
  | "defyDeath"
  | "dreamwalk";

export type AhrounTwoType =
  | "haltTheCowardsFlight"
  | "rapidShift"
  | "razorClaws"
  | "senseDanger";

export type AhrounFiveType =
  | "primalAnger"
  | "snarlOfChallenge"
  | "trueFear"
  | "windClaws";

export type AhrounEightType =
  | "closingTheGap"
  | "kissOfHelios"
  | "lunasArmor"
  | "silverClaws";

export type BlackFuriesThreeType =
  | "curseOfAeolus"
  | "haltTheCowardsFlight"
  | "porcupinesReprisal";

export type BlackFuriesSixType =
  | "coupDeGrace"
  | "kalisScar"
  | "waspTalons";

export type BlackFuriesNineType =
  | "breakTheShackles"
  | "drainSpirit"
  | "gorgonsVisage"
  | "whelpBody";

export type BoneGnawersThreeType =
  | "blissfulIgnorance"
  | "rapidShift"
  | "sightFromBeyond"
  | "odiousAroma";

export type BoneGnawersSixType =
  | "faceInTheCrowd"
  | "scentOfThePast"
  | "streetsTellStories";

export type BoneGnawersNineType =
  | "aThousandEyes"
  | "betweenTheCracks"
  | "defyDeath";

export type ChildrenOfGaiaThreeType =
  | "brothersScent"
  | "mothersTouch"
  | "senseTheTrueForm"
  | "songOfSerenity";

export type ChildrenOfGaiaSixType =
  | "calmTheFuriousBeast"
  | "openSeal"
  | "revealTrauma";

export type ChildrenOfGaiaNineType =
  | "lunasArmor"
  | "lifesPresence"
  | "shareThePain";

export type GalestalkersThreeType =
  | "camouflage"
  | "ensnareSpirit"
  | "laceratingWind";

export type GalestalkersSixType =
  | "chillCloak"
  | "callTheRidden"
  | "pulseOfThePrey"
  | "windClaws";

export type GalestalkersNineType =
  | "bloodOfTheWastes"
  | "clawsOfFrozenDeath"
  | "oathbreakersBane";

export type GhostCouncilThreeType =
  | "augur"
  | "senseDanger"
  | "blackout";

export type GhostCouncilSixType =
  | "serpentsCoil"
  | "handsOfTheEarth"
  | "mindspeak";

export type GhostCouncilNineType =
  | "dreamwalk"
  | "shroudedAspect"
  | "takeTheTrueForm"
  | "thievingTalonsOfTheMagpie";

export type GlassWalkersThreeType =
  | "animalMagnetism"
  | "gaiasCandor"
  | "skinbind"
  | "spidersSong";

export type GlassWalkersSixType =
  | "graspFromBeyond"
  | "energize"
  | "snarlOfChallenge";

export type GlassWalkersNineType =
  | "controlMachine"
  | "doppelganger"
  | "recoverMemory";

export type HartWardensThreeType =
  | "crowsLaughter"
  | "sacredBoundary"
  | "blessedBrew";

export type HartWardensSixType =
  | "beastsFealty"
  | "songOfInspiration"
  | "territorialDominance";

export type HartWardensNineType =
  | "balorsGaze"
  | "theLivingWood"
  | "kissOfHelios"
  | "livingWard";

export type RedTalonsThreeType =
  | "hiddenKiller"
  | "razorClaws"
  | "renderDown"
  | "songOfRage";

export type RedTalonsSixType =
  | "fangsOfJudgement"
  | "gaiasEmbrace"
  | "quicksand";

export type RedTalonsNineType =
  | "feralRegression"
  | "shieldOfTheWyld"
  | "theThousandForms";

export type ShadowLordsThreeType =
  | "fatalFlaw"
  | "icyChillOfDespair"
  | "shadowSense";

export type ShadowLordsSixType =
  | "blurOfTheMilkyEye"
  | "direDistraction"
  | "eyesOfTheCobra"
  | "trueFear";

export type ShadowLordsNineType =
  | "geas"
  | "thunderclap"
  | "underTheGun";

export type SilentStridersThreeType =
  | "fetchBounty"
  | "speechOfTheWorld"
  | "whisperedPassage";

export type SilentStridersSixType =
  | "burrow"
  | "scentOfRunningWater"
  | "umbralTether";

export type SilentStridersNineType =
  | "againstTheOdds"
  | "closingTheGap"
  | "theGoldenPath"
  | "strengthOfPurpose";

export type SilverFangsThreeType =
  | "howlOfAssembly"
  | "packInstinct"
  | "theSilverCompact";

export type SilverFangsSixType =
  | "bloodOfThePack"
  | "commandTheGathering"
  | "unityOfThePack";

export type SilverFangsNineType =
  | "commandSpirit"
  | "lunasAvenger"
  | "lunasBlessing"
  | "silverClaws";

export type GiftsType =
  | NativeOneType
  | NativeFourType
  | NativeSevenType
  | RagabashTwoType
  | RagabashFiveType
  | RagabashEightType
  | TheurgeTwoType
  | TheurgeFiveType
  | TheurgeEightType
  | PhilodoxTwoType
  | PhilodoxFiveType
  | PhilodoxEightType
  | GalliardTwoType
  | GalliardFiveType
  | GalliardEightType
  | AhrounTwoType
  | AhrounFiveType
  | AhrounEightType
  | BlackFuriesThreeType
  | BlackFuriesSixType
  | BlackFuriesNineType
  | BoneGnawersThreeType
  | BoneGnawersSixType
  | BoneGnawersNineType
  | ChildrenOfGaiaThreeType
  | ChildrenOfGaiaSixType
  | ChildrenOfGaiaNineType
  | GalestalkersThreeType
  | GalestalkersSixType
  | GalestalkersNineType
  | GhostCouncilThreeType
  | GhostCouncilSixType
  | GhostCouncilNineType
  | GlassWalkersThreeType
  | GlassWalkersSixType
  | GlassWalkersNineType
  | HartWardensThreeType
  | HartWardensSixType
  | HartWardensNineType
  | RedTalonsThreeType
  | RedTalonsSixType
  | RedTalonsNineType
  | ShadowLordsThreeType
  | ShadowLordsSixType
  | ShadowLordsNineType
  | SilentStridersThreeType
  | SilentStridersSixType
  | SilentStridersNineType
  | SilverFangsThreeType
  | SilverFangsSixType
  | SilverFangsNineType;

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
  specialties: Partial<
    Record<
      PhysicalSkillType | SocialSkillType | MentalSkillType,
      string[]
    >
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
    animalism?: Array<AnimalismType>;
    auspex?: Array<AuspexType>;
    dominate?: Array<DominateType>;
    bloodSorcery?: Array<BloodSorceryType>;
    fortitude?: Array<FortitudeType>;
    protean?: Array<ProteanType>;
    obfuscate?: Array<ObfuscateType>;
    oblivion?: Array<OblivionType>;
    potence?: Array<PotenceType>;
    presence?: Array<PresenceType>;
    celerity?: Array<CelerityType>;
    rituals?: Array<RitualsType>;
    thinBloodAlchemy?: Array<ThinBloodAlchemyType>;
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
  gifts: Partial<Record<GiftsType, number>>;
  rites: Array<RitesCommonType | RitesSocialType>;
};
