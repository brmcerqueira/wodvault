type OptionsLocale = {
  name: string;
  options: string[];
};

export type LocaleType = {
  name: string;
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
    name: string;
    total: string;
    spent: string;
  };
  close: string;
  no: string;
  yes: string;
  common: string;
  physical: string;
  social: string;
  mental: string;
  specialties: {
    name: string;
    skill: string;
    specialty: string;
  };
  advantages: string;
  flaws: string;
  details: string;
  export: string;
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
  }
  vampire: string;
  createVampire: string;
  resonance: OptionsLocale;
  ambition: string;
  desire: string;
  predator: OptionsLocale;
  clan: {
    name: string;
    options: Record<string, string[] | null>;
  };
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
    name: string;
    native: {
      name: string;
      one: {
        catfeet: string;
        eyesOfTheOwl: string;
        haresLeap: string;
        penumbralSenses: string;
        ragingStrike: string;
        staredown: string;
      };
      four: {
        sharpenedSenses: string;
        spiritOfTheFray: string;
        thwartingTheArrow: string;
      };
      seven: {
        bodyShift: string;
        jamTechnology: string;
        tongueOfTheBeasts: string;
      };
    };
    ragabash: {
      name: string;
      two: {
        blissfulIgnorance: string;
        crowsLaughter: string;
        gremlins: string;
        spidersSong: string;
      };
      five: {
        blurOfTheMilkyEye: string;
        openSeal: string;
        pulseOfThePrey: string;
        scentOfRunningWater: string;
      };
      eight: {
        lunasBlessing: string;
        thievingTalonsOfTheMagpie: string;
        theThousandForms: string;
        whelpBody: string;
      };
    };
    theurge: {
      name: string;
      two: {
        ensnareSpirit: string;
        mothersTouch: string;
        shadowSense: string;
        sightFromBeyond: string;
      };
      five: {
        banishSpirit: string;
        graspFromBeyond: string;
        mindspeak: string;
        umbralTether: string;
      };
      eight: {
        commandSpirit: string;
        drainSpirit: string;
        feralRegression: string;
        livingWard: string;
      };
    };
    philodox: {
      name: string;
      two: {
        ancestralConviction: string;
        gaiasCandor: string;
        porcupinesReprisal: string;
        senseTheTrueForm: string;
      };
      five: {
        beastsFealty: string;
        commandTheGathering: string;
        fangsOfJudgement: string;
        scentOfThePast: string;
      };
      eight: {
        geas: string;
        oathbreakersBane: string;
        strengthOfPurpose: string;
        takeTheTrueForm: string;
      };
    };
    galliard: {
      name: string;
      two: {
        animalMagnetism: string;
        howlOfAssembly: string;
        songOfRage: string;
        songOfSerenity: string;
      };
      five: {
        callTheRidden: string;
        eyesOfTheCobra: string;
        songOfValor: string;
        songOfInspiration: string;
      };
      eight: {
        againstTheOdds: string;
        breakTheShackles: string;
        defyDeath: string;
        dreamwalk: string;
      };
    };
    ahroun: {
      name: string;
      two: {
        haltTheCowardsFlight: string;
        rapidShift: string;
        razorClaws: string;
        senseDanger: string;
      };
      five: {
        primalAnger: string;
        snarlOfChallenge: string;
        trueFear: string;
        windClaws: string;
      };
      eight: {
        closingTheGap: string;
        kissOfHelios: string;
        lunasArmor: string;
        silverClaws: string;
      };
    };
    blackFuries: {
      name: string;
      three: {
        curseOfAeolus: string;
        haltTheCowardsFlight: string;
        porcupinesReprisal: string;
      };
      six: { coupDeGrace: string; kalisScar: string; waspTalons: string };
      nine: {
        breakTheShackles: string;
        drainSpirit: string;
        gorgonsVisage: string;
        whelpBody: string;
      };
    };
    boneGnawers: {
      name: string;
      three: {
        blissfulIgnorance: string;
        rapidShift: string;
        sightFromBeyond: string;
        odiousAroma: string;
      };
      six: {
        faceInTheCrowd: string;
        scentOfThePast: string;
        streetsTellStories: string;
      };
      nine: {
        aThousandEyes: string;
        betweenTheCracks: string;
        defyDeath: string;
      };
    };
    childrenOfGaia: {
      name: string;
      three: {
        brothersScent: string;
        mothersTouch: string;
        senseTheTrueForm: string;
        songOfSerenity: string;
      };
      six: {
        calmTheFuriousBeast: string;
        openSeal: string;
        revealTrauma: string;
      };
      nine: { lunasArmor: string; lifesPresence: string; shareThePain: string };
    };
    galestalkers: {
      name: string;
      three: {
        camouflage: string;
        ensnareSpirit: string;
        laceratingWind: string;
      };
      six: {
        chillCloak: string;
        callTheRidden: string;
        pulseOfThePrey: string;
        windClaws: string;
      };
      nine: {
        bloodOfTheWastes: string;
        clawsOfFrozenDeath: string;
        oathbreakersBane: string;
      };
    };
    ghostCouncil: {
      name: string;
      three: { augur: string; senseDanger: string; blackout: string };
      six: { serpentsCoil: string; handsOfTheEarth: string; mindspeak: string };
      nine: {
        dreamwalk: string;
        shroudedAspect: string;
        takeTheTrueForm: string;
        thievingTalonsOfTheMagpie: string;
      };
    };
    glassWalkers: {
      name: string;
      three: {
        animalMagnetism: string;
        gaiasCandor: string;
        skinbind: string;
        spidersSong: string;
      };
      six: {
        graspFromBeyond: string;
        energize: string;
        snarlOfChallenge: string;
      };
      nine: {
        controlMachine: string;
        doppelganger: string;
        recoverMemory: string;
      };
    };
    hartWardens: {
      name: string;
      three: {
        crowsLaughter: string;
        sacredBoundary: string;
        blessedBrew: string;
      };
      six: {
        beastsFealty: string;
        songOfInspiration: string;
        territorialDominance: string;
      };
      nine: {
        balorsGaze: string;
        theLivingWood: string;
        kissOfHelios: string;
        livingWard: string;
      };
    };
    redTalons: {
      name: string;
      three: {
        hiddenKiller: string;
        razorClaws: string;
        renderDown: string;
        songOfRage: string;
      };
      six: {
        fangsOfJudgement: string;
        gaiasEmbrace: string;
        quicksand: string;
      };
      nine: {
        feralRegression: string;
        shieldOfTheWyld: string;
        theThousandForms: string;
      };
    };
    shadowLords: {
      name: string;
      three: {
        fatalFlaw: string;
        icyChillOfDespair: string;
        shadowSense: string;
      };
      six: {
        blurOfTheMilkyEye: string;
        direDistraction: string;
        eyesOfTheCobra: string;
        trueFear: string;
      };
      nine: {
        geas: string;
        thunderclap: string;
        underTheGun: string;
      };
    };
    silentStriders: {
      name: string;
      three: {
        fetchBounty: string;
        speechOfTheWorld: string;
        whisperedPassage: string;
      };
      six: {
        burrow: string;
        scentOfRunningWater: string;
        umbralTether: string;
      };
      nine: {
        againstTheOdds: string;
        closingTheGap: string;
        theGoldenPath: string;
        strengthOfPurpose: string;
      };
    };
    silverFangs: {
      name: string;
      three: {
        howlOfAssembly: string;
        packInstinct: string;
        theSilverCompact: string;
      };
      six: {
        bloodOfThePack: string;
        commandTheGathering: string;
        unityOfThePack: string;
      };
      nine: {
        commandSpirit: string;
        lunasAvenger: string;
        lunasBlessing: string;
        silverClaws: string;
      };
    };
  };
  rites: {
    name: string;
    common: {
      riteOfAbjuration: string;
      riteOfRage: string;
      riteOfTranquility: string;
      riteOfContrition: string;
      riteOfForgetfulRecord: string;
      riteOfTheLivingCaern: string;
      riteOfShadowPassage: string;
      riteOfDedication: string;
      riteOfKinseeking: string;
      riteOfSpiritSummoning: string;
      riteOfBinding: string;
      riteOfShame: string;
      riteOfPatronage: string;
      riteOfCelebration: string;
      riteOfCaernBuilding: string;
      riteOfTheWolfReborn: string;
      riteOfTheWhisperingField: string;
      riteOfTheShroudedGlen: string;
    };
    social: {
      riteOfPassage: string;
      satireRite: string;
      riteOfAccomplishment: string;
      gatheringForTheDeparted: string;
      riteOfTheWinterWolf: string;
    };
  };
  webSocketPort: string;
}