import {
  AhrounEightType,
  AhrounFiveType,
  AhrounTwoType,
  BlackFuriesNineType,
  BlackFuriesSixType,
  BlackFuriesThreeType,
  BoneGnawersNineType,
  BoneGnawersSixType,
  BoneGnawersThreeType,
  ChildrenOfGaiaNineType,
  ChildrenOfGaiaSixType,
  ChildrenOfGaiaThreeType,
  GalestalkersNineType,
  GalestalkersSixType,
  GalestalkersThreeType,
  GalliardEightType,
  GalliardFiveType,
  GalliardTwoType,
  GhostCouncilNineType,
  GhostCouncilSixType,
  GhostCouncilThreeType,
  GlassWalkersNineType,
  GlassWalkersSixType,
  GlassWalkersThreeType,
  HartWardensNineType,
  HartWardensSixType,
  HartWardensThreeType,
  NativeFourType,
  NativeOneType,
  NativeSevenType,
  PhilodoxEightType,
  PhilodoxFiveType,
  PhilodoxTwoType,
  RagabashEightType,
  RagabashFiveType,
  RagabashTwoType,
  RedTalonsNineType,
  RedTalonsSixType,
  RedTalonsThreeType,
  RitesCommonType,
  RitesSocialType,
  ShadowLordsNineType,
  ShadowLordsSixType,
  ShadowLordsThreeType,
  SilentStridersNineType,
  SilentStridersSixType,
  SilentStridersThreeType,
  SilverFangsNineType,
  SilverFangsSixType,
  SilverFangsThreeType,
  TheurgeEightType,
  TheurgeFiveType,
  TheurgeTwoType,
} from "../../../character.ts";
import { Named } from "../../../i18n/localeType.ts";

type OptionsLocale = {
  options: string[];
} & Named;

export type LocaleType = {
  connect: string;
  cancel: string;
  disconnect: string;
  host: string;
  connectedToHost: string;
  yourHostId: string;
  emptyCharacters: string;
  addCharacters: string;
  health: string;
  willpower: string;
  experience: {
    total: string;
    spent: string;
  } & Named;
  close: string;
  no: string;
  yes: string;
  common: string;
  physical: string;
  social: string;
  mental: string;
  specialties: {
    skill: string;
    specialty: string;
  } & Named;
  advantages: string;
  flaws: string;
  details: string;
  export: string;
  import: string;
  importCharacterTitle: string;
  takeOwnership: string;
  leaveOwnership: string;
  mode: string[];
  onRemove: {
    characters: string;
    specialties: string;
    advantages: string;
    flaws: string;
    disciplines: string;
    gifts: string;
    rites: string;
  };
  vampire: string;
  createVampire: string;
  resonance: OptionsLocale;
  ambition: string;
  desire: string;
  predator: OptionsLocale;
  clan: {
    options: Record<string, string[] | null>;
  } & Named;
  generation: string;
  bloodPotency: string;
  humanity: string;
  werewolf: string;
  createWerewolf: string;
  native: string;
  auspice: OptionsLocale;
  tribe: OptionsLocale;
  harano: string;
  rage: string;
  hauglosk: string;
  gifts: {
    native: {
      one: Record<NativeOneType, string>;
      four: Record<NativeFourType, string>;
      seven: Record<NativeSevenType, string>;
    } & Named;
    ragabash: {
      two: Record<RagabashTwoType, string>;
      five: Record<RagabashFiveType, string>;
      eight: Record<RagabashEightType, string>;
    } & Named;
    theurge: {
      two: Record<TheurgeTwoType, string>;
      five: Record<TheurgeFiveType, string>;
      eight: Record<TheurgeEightType, string>;
    } & Named;
    philodox: {
      two: Record<PhilodoxTwoType, string>;
      five: Record<PhilodoxFiveType, string>;
      eight: Record<PhilodoxEightType, string>;
    } & Named;
    galliard: {
      two: Record<GalliardTwoType, string>;
      five: Record<GalliardFiveType, string>;
      eight: Record<GalliardEightType, string>;
    } & Named;
    ahroun: {
      two: Record<AhrounTwoType, string>;
      five: Record<AhrounFiveType, string>;
      eight: Record<AhrounEightType, string>;
    } & Named;
    blackFuries: {
      three: Record<BlackFuriesThreeType, string>;
      six: Record<BlackFuriesSixType, string>;
      nine: Record<BlackFuriesNineType, string>;
    } & Named;
    boneGnawers: {
      three: Record<BoneGnawersThreeType, string>;
      six: Record<BoneGnawersSixType, string>;
      nine: Record<BoneGnawersNineType, string>;
    } & Named;
    childrenOfGaia: {
      three: Record<ChildrenOfGaiaThreeType, string>;
      six: Record<ChildrenOfGaiaSixType, string>;
      nine: Record<ChildrenOfGaiaNineType, string>;
    } & Named;
    galestalkers: {
      three: Record<GalestalkersThreeType, string>;
      six: Record<GalestalkersSixType, string>;
      nine: Record<GalestalkersNineType, string>;
    } & Named;
    ghostCouncil: {
      three: Record<GhostCouncilThreeType, string>;
      six: Record<GhostCouncilSixType, string>;
      nine: Record<GhostCouncilNineType, string>;
    } & Named;
    glassWalkers: {
      three: Record<GlassWalkersThreeType, string>;
      six: Record<GlassWalkersSixType, string>;
      nine: Record<GlassWalkersNineType, string>;
    } & Named;
    hartWardens: {
      three: Record<HartWardensThreeType, string>;
      six: Record<HartWardensSixType, string>;
      nine: Record<HartWardensNineType, string>;
    } & Named;
    redTalons: {
      three: Record<RedTalonsThreeType, string>;
      six: Record<RedTalonsSixType, string>;
      nine: Record<RedTalonsNineType, string>;
    } & Named;
    shadowLords: {
      three: Record<ShadowLordsThreeType, string>;
      six: Record<ShadowLordsSixType, string>;
      nine: Record<ShadowLordsNineType, string>;
    } & Named;
    silentStriders: {
      three: Record<SilentStridersThreeType, string>;
      six: Record<SilentStridersSixType, string>;
      nine: Record<SilentStridersNineType, string>;
    } & Named;
    silverFangs: {
      three: Record<SilverFangsThreeType, string>;
      six: Record<SilverFangsSixType, string>;
      nine: Record<SilverFangsNineType, string>;
    } & Named;
  } & Named;
  rites: {
    common: Record<RitesCommonType, string>;
    social: Record<RitesSocialType, string>;
  } & Named;
  webSocketPort: string;
} & Named;
