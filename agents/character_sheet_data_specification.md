# Character Sheet Data Specification

## Vampire: The Masquerade 5th Edition and Werewolf: The Apocalypse 5th Edition

**Purpose:** This document is the complete, standalone specification for
an AI agent that creates, edits, validates, and exports character sheets
as JSON. The agent must not need access to the original TypeScript
definitions. The TypeScript supplied by the project owner was used only
to derive the field structure and allowed values documented here.

**Language:** This specification is written in English. JSON property
names and machine-readable option identifiers must be reproduced exactly
as written.

------------------------------------------------------------------------

## 1. Agent responsibilities and source restrictions

The agent must: 1. Create and edit character records that conform to the
JSON structure in this document. 2. Determine whether each character is
a Vampire or a Werewolf before filling system-specific fields. 3. Keep
Vampire and Werewolf mechanics and options separate. 4. Preserve all
existing character data when editing, except where the user explicitly
requests a change. 5. Never invent an option, power, rite, rule, value,
or character detail that is not supported by the supplied data or
available reference material. 6. Ask for clarification when user
instructions conflict or when a required value cannot be determined. 7.
Output valid JSON, with no comments, trailing commas, or TypeScript
syntax. 8. Avoid revealing secrets, hidden motivations, personal
details, or spoiler-sensitive information about canon characters and
NPCs.

### Reference-material policy

Use only the reference materials made available to the agent. Do not
access the internet.

When the available materials do not support an answer, explicitly say
that the information is unavailable. Do not fill gaps with assumptions
or general knowledge.

**Disciplines and Amalgams:** For any question or character-sheet entry
involving Vampire Disciplines or Amalgams, consult exclusively
`Westhaven_by_Night_5.0.pdf`. Use the Portuguese ability names as they
appear in that document. Cite the document and page number when
explaining or describing an ability. The machine-readable identifiers in
JSON must remain exactly as listed in this specification.

Do not provide spoiler-sensitive information about canon NPCs or
characters.

------------------------------------------------------------------------

## 2. Character system and enum values

The JSON field `kind` identifies the game system.

    Numeric value Meaning    Required use
  --------------- ---------- --------------------------------------
              `0` Vampire    Vampire: The Masquerade 5th Edition
              `1` Werewolf   Werewolf: The Apocalypse 5th Edition

The JSON field `mode` identifies the character record's mode.

    Numeric value Meaning
  --------------- ---------
              `0` Opened
              `1` Tracked
              `2` Closed

These are numeric enum values. JSON must contain the number, not the
enum label.

------------------------------------------------------------------------

## 3. Complete character JSON structure

Every character record must contain all top-level properties shown
below. Use `null`, empty strings, empty arrays, or empty objects only
where the field rules in this document permit them. Do not omit a
property merely because it is not currently relevant to the selected
game system.

``` json
{
  "details": "",
  "image": "",
  "name": "",
  "player": "",
  "playerId": "",
  "owner": null,
  "mode": 0,
  "kind": 0,
  "attributes": {
    "physical": {
      "strength": 1,
      "dexterity": 1,
      "stamina": 1
    },
    "social": {
      "charisma": 1,
      "manipulation": 1,
      "composure": 1
    },
    "mental": {
      "intelligence": 1,
      "wits": 1,
      "resolve": 1
    }
  },
  "skills": {
    "physical": {
      "athletics": 0,
      "brawl": 0,
      "craft": 0,
      "drive": 0,
      "firearms": 0,
      "melee": 0,
      "larceny": 0,
      "stealth": 0,
      "survival": 0
    },
    "social": {
      "animalKen": 0,
      "etiquette": 0,
      "insight": 0,
      "intimidation": 0,
      "leadership": 0,
      "performance": 0,
      "persuasion": 0,
      "streetwise": 0,
      "subterfuge": 0
    },
    "mental": {
      "academics": 0,
      "awareness": 0,
      "finance": 0,
      "investigation": 0,
      "medicine": 0,
      "occult": 0,
      "politics": 0,
      "science": 0,
      "technology": 0
    }
  },
  "health": {
    "superficial": 0,
    "aggravated": 0,
    "penalty": 0,
    "start": 0
  },
  "willpower": {
    "superficial": 0,
    "aggravated": 0,
    "penalty": 0
  },
  "experience": {
    "total": 0,
    "spent": 0
  },
  "specialties": {},
  "advantages": {},
  "flaws": {},
  "hungerOrRage": 0,
  "resonance": "",
  "ambition": "",
  "desire": "",
  "predator": "",
  "clan": "",
  "generation": 0,
  "humanity": {
    "total": 0,
    "stains": 0
  },
  "bloodPotency": 0,
  "disciplines": {},
  "auspice": "",
  "tribe": "",
  "renown": {
    "glory": 0,
    "honor": 0,
    "wisdom": 0
  },
  "harano": 0,
  "hauglosk": 0,
  "gifts": {},
  "rites": []
}
```

The values above are structural initialization examples, not a claim
that every value is a valid in-game starting value. Apply game rules
only when supported by the available reference materials.

------------------------------------------------------------------------

## 4. Field-by-field data dictionary

### 4.1 Identity and record metadata

| JSON field | JSON type | Meaning and handling |
|---|---|---|
| `details` | string (HTML) | Character details, biography, appearance, personality, background, relationships, and notes. Supports HTML. Use semantic elements such as `<section>`, `<h2>`, `<h3>`, `<p>`, `<ul>`, and `<li>` to organize the content. Store a clean HTML fragment, without `<html>`, `<head>`, or `<body>` tags, JavaScript, or executable content. |
| `image` | string (Base64 data URI or permanent URL) | Character portrait or thumbnail. Use a supplied image if available. If none is supplied, generate an original portrait based on the character's description. Prefer embedding the image as a Base64 data URI (e.g. `data:image/png;base64,...`). Alternatively, use a genuine, permanent, publicly accessible image URL. Never fabricate URLs or use temporary references as permanent ones. If neither format is available, use `""` and inform the user that the image could not be stored. |
| `name` | string | Character's name. |
| `player` | string | Player's display name. |
| `playerId` | string | Player identifier. Use `""` if not supplied. |
| `owner` | string or null | Owner identifier or `null` when unassigned. |
| `mode` | integer | Record mode: `0` Opened, `1` Tracked, `2` Closed. |
| `kind` | integer | Game system: `0` Vampire, `1` Werewolf. |

### 4.2 Attributes

`attributes` is an object with three categories. Each category contains
three numeric ratings.

  Category   JSON fields
  ---------- -----------------------------------------
  Physical   `strength`, `dexterity`, `stamina`
  Social     `charisma`, `manipulation`, `composure`
  Mental     `intelligence`, `wits`, `resolve`

All nine fields are required numbers. The schema does not encode a
minimum, maximum, or character-creation allocation. Do not infer those
limits from this document; consult the permitted game reference
material.

### 4.3 Skills

`skills` is an object containing three category objects. Every listed
skill is a required numeric property, including skills with a rating of
zero.

**Physical skills**

-   `athletics`
-   `brawl`
-   `craft`
-   `drive`
-   `firearms`
-   `melee`
-   `larceny`
-   `stealth`
-   `survival`

**Social skills**

-   `animalKen`
-   `etiquette`
-   `insight`
-   `intimidation`
-   `leadership`
-   `performance`
-   `persuasion`
-   `streetwise`
-   `subterfuge`

**Mental skills**

-   `academics`
-   `awareness`
-   `finance`
-   `investigation`
-   `medicine`
-   `occult`
-   `politics`
-   `science`
-   `technology`

Do not translate or alter these JSON keys. A skill belongs to one of the
three categories above. The combined skill set is the union of the
physical, social, and mental skill names; it is not an intersection.

### 4.4 Health and willpower damage

The `health` object contains:

  -----------------------------------------------------------------------
  Field                   Type                    Meaning
  ----------------------- ----------------------- -----------------------
  `superficial`           number                  Superficial damage
                                                  tracker value

  `aggravated`            number                  Aggravated damage
                                                  tracker value

  `penalty`               number                  Associated penalty
                                                  value

  `start`                 number                  Starting or maximum
                                                  health-track value as
                                                  used by the application
  -----------------------------------------------------------------------

The `willpower` object contains `superficial`, `aggravated`, and
`penalty`, all numeric.

The schema does not define how damage is calculated or how trackers are
marked. Do not invent those rules.

### 4.5 Experience

`experience` contains two numeric fields:

-   `total`: total experience recorded.
-   `spent`: experience already spent.

Do not calculate costs or award experience unless the applicable rules
are present in the permitted source material.

### 4.6 Specialties

`specialties` is an object whose keys may be any skill key listed in
Section 4.3. Each value is an array of strings.

Example:

``` json
{
  "specialties": {
    "athletics": ["Climbing"],
    "investigation": ["Evidence Analysis", "Research"]
  }
}
```

Only include specialties actually provided or confirmed. An empty object
means no specialties have been entered.

### 4.7 Advantages and flaws

-   `advantages`: object with string keys and numeric values.
-   `flaws`: object with string keys and numeric values.

The schema does not provide a fixed catalog of advantage or flaw names.
Use names supported by the user's supplied material or permitted
references. Do not fabricate a catalog. Preserve the numeric rating or
value supplied for each entry.

### 4.8 Shared Hunger/Rage field

`hungerOrRage` is a numeric field shared by the data structure.

-   For a Vampire, it represents the Hunger tracker.
-   For a Werewolf, it represents the Rage tracker.

The JSON key must remain `hungerOrRage`, even though its interpretation
depends on `kind`. Do not create separate `hunger` or `rage` properties
unless the schema is explicitly changed.

### 4.9 Ambition and desire

-   `ambition`: string describing the character's ambition.
-   `desire`: string describing the character's desire.

These are free-text fields. Preserve the user's wording.

------------------------------------------------------------------------

## 5. Vampire-specific fields

The following fields are intended for Vampire characters (`kind: 0`):

  -----------------------------------------------------------------------
  JSON field              Type                    Meaning
  ----------------------- ----------------------- -----------------------
  `resonance`             string                  Blood resonance
                                                  category. Use the exact
                                                  options in Section 7.1
                                                  when selecting from the
                                                  supplied catalog.

  `predator`              string                  Predator type. Use the
                                                  exact options in
                                                  Section 7.2.

  `clan`                  string                  Clan. Use the exact
                                                  options in Section 7.3.

  `generation`            number                  Character generation.

  `humanity`              object                  Humanity tracker,
                                                  containing numeric
                                                  `total` and `stains`.

  `bloodPotency`          number                  Blood Potency rating.

  `disciplines`           object                  Optional arrays of
                                                  selected Discipline
                                                  power identifiers and
                                                  ritual/alchemy
                                                  identifiers, as defined
                                                  in Section 6.1.
  -----------------------------------------------------------------------

For a Werewolf, do not populate Vampire-specific fields with invented
Werewolf equivalents. The schema requires the properties to exist, so
use the neutral defaults specified by the application (normally empty
strings, zeroes, or empty objects) when they do not apply.

### 5.1 Discipline object

`disciplines` may contain any of the following optional arrays. Each
array contains only the exact identifiers listed for that Discipline.

-   `animalism`
-   `auspex`
-   `dominate`
-   `bloodSorcery`
-   `fortitude`
-   `protean`
-   `obfuscate`
-   `oblivion`
-   `potence`
-   `presence`
-   `celerity`
-   `rituals`
-   `thinBloodAlchemy`

The permitted identifiers for each array are listed in Section 6.1. Do
not place an identifier in the wrong Discipline array.

------------------------------------------------------------------------

## 6. Power and rite identifier catalogs

**Important:** The following values are machine-readable identifiers
copied from the supplied data model. Preserve spelling and
capitalization exactly. They are not explanatory descriptions of what a
power does. Do not infer a power's mechanics from its identifier.

### 6.1 Vampire Discipline, ritual, and alchemy identifiers

**Animalism** (`disciplines.animalism`)

`bondFamulus`, `senseTheBeast`, `feralWhispers`, `animalSucculence`,
`quellTheBeast`, `unlivingHive`, `subsumeTheSpirit`, `animalDominion`,
`drawingOutTheBeast`

**Auspex** (`disciplines.auspex`)

`heightenedSenses`, `senseTheUnseen`, `obeah`, `premonition`,
`scryTheSoul`, `shareTheSenses`, `spiritsTouch`, `clairvoyance`,
`possession`, `telepathy`, `unburdeningTheBestialSoul`

**Dominate** (`disciplines.dominate`)

`cloudMemory`, `compel`, `mesmerize`, `dementation`, `domitorsFavor`,
`slavishDevotion`, `theForgetfulMind`, `submergedDirective`,
`ancestralDominion`, `rationalize`, `massManipulation`, `terminalDecree`

**Blood Sorcery** (`disciplines.bloodSorcery`)

`corrosiveVitae`, `aTasteForBlood`, `extinguishVitae`, `bloodOfPotency`,
`scorpionsTouch`, `theftOfVitae`, `baalsCaress`, `cauldronOfBlood`

**Fortitude** (`disciplines.fortitude`)

`resilience`, `unswayableMind`, `toughness`, `enduringBeasts`,
`valeren`, `defyBane`, `fortifyTheInnerFacade`, `draughtOfEndurance`,
`shatter`, `fleshOfMarble`, `prowessFromPain`

**Protean** (`disciplines.protean`)

`eyesOfTheBeast`, `weightOfTheFeather`, `feralWeapons`, `vicissitude`,
`serpentsKiss`, `earthMeld`, `shapechange`, `fleshCrafting`,
`metamorphosis`, `horridForm`, `mistForm`, `theUnfetteredHeart`,
`oneWithTheLand`, `theHeartOfDarkness`

**Obfuscate** (`disciplines.obfuscate`)

`cloakOfShadows`, `silenceOfDeath`, `unseenPassage`, `chimerstry`,
`mentalMaze`, `ghostInTheMachine`, `maskOfAThousandFaces`,
`fataMorgana`, `conceal`, `vanish`, `cloakTheGathering`,
`impostorsGuise`

**Potence** (`disciplines.potence`)

`lethalBody`, `soaringLeap`, `prowess`, `brutalFeed`, `sparkOfRage`,
`uncannyGrip`, `draughtOfMight`, `earthshock`, `fistOfCaine`

**Oblivion** (`disciplines.oblivion`)

`ashesToAshes`, `oblivionsSight`, `shadowCloak`, `theBindingFeather`,
`fatalPrecognition`, `shadowCast`, `armsOfAhriman`,
`whereTheShroudThins`, `auraOfDecay`, `passionFeast`,
`shadowPerspective`, `touchOfOblivion`, `necroticPlague`,
`stygianShroud`, `shadowStep`, `skuldFulfilled`, `tenebrousAvatar`,
`witheringSpirit`

**Presence** (`disciplines.presence`)

`awe`, `daunt`, `eyesOfTheSerpent`, `lingeringKiss`, `dreadGaze`,
`entrancement`, `trueLovesFace`, `irresistibleVoice`, `summon`,
`majesty`, `starMagnetism`

**Celerity** (`disciplines.celerity`)

`catsGrace`, `rapidReflexes`, `fleetness`, `blink`, `traversal`,
`draughtOfElegance`, `unerringAim`, `lightningStrike`, `splitSecond`

**Blood Sorcery rituals** (`disciplines.rituals`)

`bloodWalk`, `clingingOfTheInsect`, `craftBloodstone`,
`wakeWithEveningsFreshness`, `wardAgainstGhouls`,
`communicateWithKindredSire`, `eyesOfBabel`, `illuminateTheTrailOfPrey`,
`ishtarsTouch`, `truthOfBlood`, `wardAgainstSpirits`,
`wardingCircleAgainstGhouls`, `dagonsCall`, `deflectionOfWoodenDoom`,
`essenceOfAir`, `firewalker`, `wardAgainstLupines`,
`wardingCircleAgainstSpirits`, `oneWithTheBlade`,
`defenseOfTheSacredHaven`, `eyesOfTheNighthawk`, `incorporealPassage`,
`wardAgainstCainites`, `wardingCircleAgainstLupines`,
`escapeToTrueSanctuary`, `heartOfStone`, `shaftOfBelatedDissolution`,
`wardingCircleAgainstCainites`

**Thin-Blood Alchemy** (`disciplines.thinBloodAlchemy`)

`farReach`, `haze`, `envelop`, `profaneHierosGamos`, `defractionate`,
`airborneMomentum`, `awakenTheSleeper`

### 6.2 Werewolf-specific fields

The following fields are intended for Werewolf characters (`kind: 1`):

  -----------------------------------------------------------------------
  JSON field              Type                    Meaning
  ----------------------- ----------------------- -----------------------
  `auspice`               string                  Auspice. Use the exact
                                                  options in Section 7.4.

  `tribe`                 string                  Tribe. Use the exact
                                                  options in Section 7.5.

  `renown`                object                  Contains numeric
                                                  `glory`, `honor`, and
                                                  `wisdom`.

  `harano`                number                  Harano tracker value.

  `hauglosk`              number                  Hauglosk tracker value.

  `gifts`                 object                  Map of Gift identifiers
                                                  to numeric values, as
                                                  defined in Section 6.3.

  `rites`                 array                   List of rite
                                                  identifiers, as defined
                                                  in Section 6.4.
  -----------------------------------------------------------------------

For a Vampire, do not populate Werewolf-specific fields with invented
Vampire equivalents. Keep the required properties present and use the
neutral defaults specified by the application.

### 6.3 Werewolf Gift identifiers

`gifts` is an object. Each property name must be one of the Gift
identifiers below, and its value must be a number. The schema does not
specify the meaning of that number; preserve the application's intended
numeric convention and do not assume it represents a level, rating, or
count without confirmation.

**Native Gifts --- level 1** (`NativeOneType`)

`catfeet`, `eyesOfTheOwl`, `haresLeap`, `penumbralSenses`,
`ragingStrike`, `staredown`

**Native Gifts --- level 4** (`NativeFourType`)

`sharpenedSenses`, `spiritOfTheFray`, `thwartingTheArrow`

**Native Gifts --- level 7** (`NativeSevenType`)

`bodyShift`, `jamTechnology`, `tongueOfTheBeasts`

**Ragabash --- level 2**

`blissfulIgnorance`, `crowsLaughter`, `gremlins`, `spidersSong`

**Ragabash --- level 5**

`blurOfTheMilkyEye`, `openSeal`, `pulseOfThePrey`, `scentOfRunningWater`

**Ragabash --- level 8**

`lunasBlessing`, `thievingTalonsOfTheMagpie`, `theThousandForms`,
`whelpBody`

**Theurge --- level 2**

`ensnareSpirit`, `mothersTouch`, `shadowSense`, `sightFromBeyond`

**Theurge --- level 5**

`banishSpirit`, `graspFromBeyond`, `mindspeak`, `umbralTether`

**Theurge --- level 8**

`commandSpirit`, `drainSpirit`, `feralRegression`, `livingWard`

**Philodox --- level 2**

`ancestralConviction`, `gaiasCandor`, `porcupinesReprisal`,
`senseTheTrueForm`

**Philodox --- level 5**

`beastsFealty`, `commandTheGathering`, `fangsOfJudgement`,
`scentOfThePast`

**Philodox --- level 8**

`geas`, `oathbreakersBane`, `strengthOfPurpose`, `takeTheTrueForm`

**Galliard --- level 2**

`animalMagnetism`, `howlOfAssembly`, `songOfRage`, `songOfSerenity`

**Galliard --- level 5**

`callTheRidden`, `eyesOfTheCobra`, `songOfValor`, `songOfInspiration`

**Galliard --- level 8**

`againstTheOdds`, `breakTheShackles`, `defyDeath`, `dreamwalk`

**Ahroun --- level 2**

`haltTheCowardsFlight`, `rapidShift`, `razorClaws`, `senseDanger`

**Ahroun --- level 5**

`primalAnger`, `snarlOfChallenge`, `trueFear`, `windClaws`

**Ahroun --- level 8**

`closingTheGap`, `kissOfHelios`, `lunasArmor`, `silverClaws`

**Black Furies --- level 3**

`curseOfAeolus`, `haltTheCowardsFlight`, `porcupinesReprisal`

**Black Furies --- level 6**

`coupDeGrace`, `kalisScar`, `waspTalons`

**Black Furies --- level 9**

`breakTheShackles`, `drainSpirit`, `gorgonsVisage`, `whelpBody`

**Bone Gnawers --- level 3**

`blissfulIgnorance`, `rapidShift`, `sightFromBeyond`, `odiousAroma`

**Bone Gnawers --- level 6**

`faceInTheCrowd`, `scentOfThePast`, `streetsTellStories`

**Bone Gnawers --- level 9**

`aThousandEyes`, `betweenTheCracks`, `defyDeath`

**Children of Gaia --- level 3**

`brothersScent`, `mothersTouch`, `senseTheTrueForm`, `songOfSerenity`

**Children of Gaia --- level 6**

`calmTheFuriousBeast`, `openSeal`, `revealTrauma`

**Children of Gaia --- level 9**

`lunasArmor`, `lifesPresence`, `shareThePain`

**Galestalkers --- level 3**

`camouflage`, `ensnareSpirit`, `laceratingWind`

**Galestalkers --- level 6**

`chillCloak`, `callTheRidden`, `pulseOfThePrey`, `windClaws`

**Galestalkers --- level 9**

`bloodOfTheWastes`, `clawsOfFrozenDeath`, `oathbreakersBane`

**Ghost Council --- level 3**

`augur`, `senseDanger`, `blackout`

**Ghost Council --- level 6**

`serpentsCoil`, `handsOfTheEarth`, `mindspeak`

**Ghost Council --- level 9**

`dreamwalk`, `shroudedAspect`, `takeTheTrueForm`,
`thievingTalonsOfTheMagpie`

**Glass Walkers --- level 3**

`animalMagnetism`, `gaiasCandor`, `skinbind`, `spidersSong`

**Glass Walkers --- level 6**

`graspFromBeyond`, `energize`, `snarlOfChallenge`

**Glass Walkers --- level 9**

`controlMachine`, `doppelganger`, `recoverMemory`

**Hart Wardens --- level 3**

`crowsLaughter`, `sacredBoundary`, `blessedBrew`

**Hart Wardens --- level 6**

`beastsFealty`, `songOfInspiration`, `territorialDominance`

**Hart Wardens --- level 9**

`balorsGaze`, `theLivingWood`, `kissOfHelios`, `livingWard`

**Red Talons --- level 3**

`hiddenKiller`, `razorClaws`, `renderDown`, `songOfRage`

**Red Talons --- level 6**

`fangsOfJudgement`, `gaiasEmbrace`, `quicksand`

**Red Talons --- level 9**

`feralRegression`, `shieldOfTheWyld`, `theThousandForms`

**Shadow Lords --- level 3**

`fatalFlaw`, `icyChillOfDespair`, `shadowSense`

**Shadow Lords --- level 6**

`blurOfTheMilkyEye`, `direDistraction`, `eyesOfTheCobra`, `trueFear`

**Shadow Lords --- level 9**

`geas`, `thunderclap`, `underTheGun`

**Silent Striders --- level 3**

`fetchBounty`, `speechOfTheWorld`, `whisperedPassage`

**Silent Striders --- level 6**

`burrow`, `scentOfRunningWater`, `umbralTether`

**Silent Striders --- level 9**

`againstTheOdds`, `closingTheGap`, `theGoldenPath`, `strengthOfPurpose`

**Silver Fangs --- level 3**

`howlOfAssembly`, `packInstinct`, `theSilverCompact`

**Silver Fangs --- level 6**

`bloodOfThePack`, `commandTheGathering`, `unityOfThePack`

**Silver Fangs --- level 9**

`commandSpirit`, `lunasAvenger`, `lunasBlessing`, `silverClaws`

### 6.4 Werewolf Rite identifiers

The `rites` field is an array. Each entry must be one of the common or
social rite identifiers below. The combined rite catalog is the union of
both groups: a rite may belong to either group.

**Common rites**

`riteOfAbjuration`, `riteOfRage`, `riteOfTranquility`,
`riteOfContrition`, `riteOfForgetfulRecord`, `riteOfTheLivingCaern`,
`riteOfShadowPassage`, `riteOfDedication`, `riteOfKinseeking`,
`riteOfSpiritSummoning`, `riteOfBinding`, `riteOfShame`,
`riteOfPatronage`, `riteOfCelebration`, `riteOfCaernBuilding`,
`riteOfTheWolfReborn`, `riteOfTheWhisperingField`,
`riteOfTheShroudedGlen`

**Social rites**

`riteOfPassage`, `satireRite`, `riteOfAccomplishment`,
`gatheringForTheDeparted`, `riteOfTheWinterWolf`

Example:

``` json
{
  "rites": [
    "riteOfAbjuration",
    "riteOfPassage"
  ]
}
```

------------------------------------------------------------------------

## 7. Controlled character options

When selecting one of the following fields from the supplied option
catalog, use the exact Portuguese display value. Do not translate,
rename, or substitute an option.

### 7.1 Resonance (`resonance`) --- Vampire

-   `Colérica`
-   `Melancólica`
-   `Fleumática`
-   `Sanguínea`
-   `Sangue Animal`

### 7.2 Predator (`predator`) --- Vampire

-   `Consensualista`
-   `Fazendeiro`
-   `Osíris`
-   `Sacoleiro`
-   `Sandman`
-   `Sanguessuga`
-   `Scene Queen`
-   `Sereia`
-   `Trinchador`
-   `Vira-lata`

### 7.3 Clan (`clan`) --- Vampire

-   `Banu Haqim`
-   `Brujah`
-   `Caitiff`
-   `Gangrel`
-   `Hecata`
-   `Lasombra`
-   `Malkaviano`
-   `Nosferatu`
-   `O Ministério`
-   `Ravnos`
-   `Salubri`
-   `Sangue-Ralo`
-   `Toreador`
-   `Tremere`
-   `Tzimisce`
-   `Ventrue`

### 7.4 Auspice (`auspice`) --- Werewolf

-   `Ragabash`
-   `Theurge`
-   `Philodox`
-   `Galliard`
-   `Ahroun`

### 7.5 Tribe (`tribe`) --- Werewolf

-   `Andarilhos do Asfalto`
-   `Conselho dos Fantasmas`
-   `Espreitadores do Vento`
-   `Filhos de Gaia`
-   `Fúrias Negras`
-   `Garras Vermelhas`
-   `Guardadores do Galhado`
-   `Peregrinos Silenciosos`
-   `Presas de Prata`
-   `Roedores de Ossos`
-   `Senhores das Sombras`

If the user supplies a value outside a controlled list, do not silently
replace it. Explain that it is not in the supplied catalog and ask
whether the user wants to update the catalog or keep the value as custom
data. Since these fields are plain strings in the data structure, the
schema itself does not technically enforce the catalog.

------------------------------------------------------------------------

## 8. Defaults and null handling

The data structure requires all top-level properties to be present.
Unless the user or application provides a different convention, use
these neutral initialization values:

  -----------------------------------------------------------------------
  JSON value type                     Default
  ----------------------------------- -----------------------------------
  String                              `""`

  Number                              `0`

  Array                               `[]`

  Object                              `{}`

  Nullable owner                      `null`

  `mode`                              `0` (Opened)

  `kind`                              `0` for Vampire or `1` for
                                      Werewolf, according to the selected
                                      system
  -----------------------------------------------------------------------

For attributes, the example structure uses `1` as an initialization
value, but this is not a rules statement about valid starting ratings.

The schema does not define nullable values for system-inapplicable
fields. Therefore: - Keep all declared properties in the JSON. - Use
neutral defaults for fields that do not apply to the selected character
type. - Do not replace a required number or string with `null`. - Do not
add new fields such as `hunger`, `rage`, or `werewolfForm` unless the
schema is explicitly revised.

------------------------------------------------------------------------

## 9. Creation and editing procedure

### New character

1.  Ask whether the user is creating a Vampire or Werewolf if this is
    not clear.
2.  Collect identity and descriptive information.
3.  Collect attributes and all skill ratings.
4.  Collect system-specific options and powers.
5.  Populate every required property.
6.  Validate the JSON against this document.
7.  Return the complete JSON.

Do not force the user to answer every field in a single questionnaire.
Ask concise follow-up questions for missing information when needed. If
the user requests a blank template, generate the complete structure with
defaults instead.

### Existing character

1.  Parse the supplied JSON.
2.  Preserve every existing property and value that the user did not ask
    to change.
3.  Apply only the requested edits.
4.  Check that no property has been accidentally removed or renamed.
5.  Validate the complete resulting JSON.
6.  Return the full updated JSON unless the user asks for a partial
    change only.

------------------------------------------------------------------------

## 10. JSON validation checklist

Before returning a character, verify all of the following:

-   [ ] The output is syntactically valid JSON.
-   [ ] Every required top-level property is present.
-   [ ] `mode` is exactly `0`, `1`, or `2`.
-   [ ] `kind` is exactly `0` or `1`.
-   [ ] All nine attribute properties are present and numeric.
-   [ ] All 27 skill properties are present and numeric.
-   [ ] Skills are placed in the correct physical, social, or mental
    category.
-   [ ] `health` contains numeric `superficial`, `aggravated`,
    `penalty`, and `start`.
-   [ ] `willpower` contains numeric `superficial`, `aggravated`, and
    `penalty`.
-   [ ] `experience` contains numeric `total` and `spent`.
-   [ ] Every specialty key is a listed skill key and every specialty
    value is an array of strings.
-   [ ] `advantages` and `flaws` are objects with numeric values.
-   [ ] `hungerOrRage` is numeric.
-   [ ] Vampire options use the supplied catalogs when applicable.
-   [ ] Werewolf options use the supplied catalogs when applicable.
-   [ ] Discipline identifiers appear only in their matching Discipline
    arrays.
-   [ ] Gift identifiers are selected from the Gift catalog.
-   [ ] Gift values are numeric.
-   [ ] Rite identifiers are selected from the common or social rite
    catalog.
-   [ ] Vampire and Werewolf mechanics have not been mixed.
-   [ ] No unsupported powers, options, rules, or fields have been
    invented.
-   [ ] Existing character data has been preserved when editing.

------------------------------------------------------------------------

## 11. Important limitations of this data specification

This document defines the JSON structure, field meanings at the
data-model level, and the exact catalogs supplied by the project owner.
It does **not** define all tabletop rules for character creation or
advancement.

In particular, the supplied data does not specify: - Attribute or skill
creation limits. - Starting rating distributions. - Health or Willpower
calculation formulas. - Experience costs. - Discipline, Gift, or Rite
mechanics and descriptions. - The meaning of numeric Gift values. - A
fixed catalog for advantages, flaws, specialties, ambitions, or
desires.

Do not guess these details. Consult the permitted reference materials
and cite the relevant source and page when explaining rules. If the
available sources do not answer the question, state that the information
is unavailable.

------------------------------------------------------------------------

## 12. Final output contract

Unless the user asks for another format, the agent's final
character-sheet output must be:

1.  One complete JSON object.
2.  Valid JSON with no comments or trailing commas.
3.  Conformant to the field names, nesting, data types, and catalogs in
    this document.
4.  Free of TypeScript syntax.
5.  Free of invented rules or unsupported character options.

The agent may provide a brief explanation before or after the JSON, but
must never place explanatory prose inside the JSON object.
