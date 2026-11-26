import { Character, CharacterKind, CharacterMode } from "../../../character.ts";
import { timestamp } from "../../../utils.ts";
import { myId } from "./preferencesService.ts";

export function buildCharacter(kind: CharacterKind): Character {
  return {
    id: crypto.randomUUID(),
    timestamp: timestamp(),
    details: "",
    image: "",
    name: "",
    player: "",
    playerId: myId,
    owner: null,
    mode: CharacterMode.Opened,
    kind: kind,
    attributes: {
      physical: {
        strength: 1,
        dexterity: 1,
        stamina: 1,
      },
      social: {
        charisma: 1,
        manipulation: 1,
        composure: 1,
      },
      mental: {
        intelligence: 1,
        wits: 1,
        resolve: 1,
      },
    },
    skills: {
      physical: {
        athletics: 0,
        brawl: 0,
        craft: 0,
        drive: 0,
        firearms: 0,
        melee: 0,
        larceny: 0,
        stealth: 0,
        survival: 0,
      },
      social: {
        animalKen: 0,
        etiquette: 0,
        insight: 0,
        intimidation: 0,
        leadership: 0,
        performance: 0,
        persuasion: 0,
        streetwise: 0,
        subterfuge: 0,
      },
      mental: {
        academics: 0,
        awareness: 0,
        finance: 0,
        investigation: 0,
        medicine: 0,
        occult: 0,
        politics: 0,
        science: 0,
        technology: 0,
      },
    },
    health: {
      superficial: 0,
      aggravated: 0,
      penalty: 0,
      start: 3,
    },
    willpower: {
      superficial: 0,
      aggravated: 0,
      penalty: 0,
    },
    experience: {
      total: 0,
      spent: 0,
    },
    specialties: {},
    advantages: {},
    flaws: {},
    hungerOrRage: 0,
    //Vampire
    resonance: "",
    ambition: "",
    desire: "",
    predator: "",
    clan: "",
    generation: 0,
    humanity: {
      total: 0,
      stains: 0,
    },
    bloodPotency: 0,
    disciplines: {},
    //Werewolf
    auspice: "",
    tribe: "",
    renown: {
      glory: 0,
      honor: 0,
      wisdom: 0,
    },
    harano: 0,
    hauglosk: 0,
    gifts: {},
    rites: [],
  };
}
