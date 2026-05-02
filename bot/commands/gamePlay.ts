import { ApplicationCommandOptionType } from "$harmony/mod.ts";
import { buildChoices, command, RecordCommandOptions } from "./common.ts";
import { locale } from "../i18n/locale.ts";
import { rollSolver } from "../solver/rollSolver.ts";
import { composeSolver } from "../solver/composeSolver.ts";
import { groupSolver } from "../solver/groupSolver.ts";
import { checkSolver } from "../solver/checkSolver.ts";
import { dicePoolSolver } from "../solver/dicePoolSolver.ts";
import { shortcutComposeSolver } from "../solver/shortcutComposeSolver.ts";
import { shortcutDicePoolSolver } from "../solver/shortcutDicePoolSolver.ts";

export const attributeChoices = [
  ...buildChoices(locale.attributes.physical),
  ...buildChoices(locale.attributes.social),
  ...buildChoices(locale.attributes.mental),
];

const dicePoolOptions: RecordCommandOptions = {
  name: {
    name: locale.commands.dicePool.nameField.name,
    description: locale.commands.dicePool.nameField.description,
    type: ApplicationCommandOptionType.STRING,
    required: true,
    autocomplete: true,
  },
};

const composeOptions: RecordCommandOptions = {
  attribute: {
    name: locale.commands.compose.attribute.name,
    description: locale.commands.compose.attribute.description,
    type: ApplicationCommandOptionType.STRING,
    required: false,
    choices: attributeChoices,
  },
  renown: {
    name: locale.commands.compose.renown.name,
    description: locale.commands.compose.renown.description,
    type: ApplicationCommandOptionType.STRING,
    required: false,
    choices: buildChoices(locale.renown, true),
  },
  secondaryAttribute: {
    name: locale.commands.compose.secondaryAttribute.name,
    description: locale.commands.compose.secondaryAttribute.description,
    type: ApplicationCommandOptionType.STRING,
    required: false,
    choices: attributeChoices,
  },
  skillPhysical: {
    name: locale.commands.compose.skillPhysical.name,
    description: locale.commands.compose.skillPhysical.description,
    type: ApplicationCommandOptionType.STRING,
    required: false,
    choices: buildChoices(locale.skills.physical),
  },
  skillSocial: {
    name: locale.commands.compose.skillSocial.name,
    description: locale.commands.compose.skillSocial.description,
    type: ApplicationCommandOptionType.STRING,
    required: false,
    choices: buildChoices(locale.skills.social),
  },
  skillMental: {
    name: locale.commands.compose.skillMental.name,
    description: locale.commands.compose.skillMental.description,
    type: ApplicationCommandOptionType.STRING,
    required: false,
    choices: buildChoices(locale.skills.mental),
  },
  discipline: {
    name: locale.commands.compose.discipline.name,
    description: locale.commands.compose.discipline.description,
    type: ApplicationCommandOptionType.STRING,
    required: false,
    choices: buildChoices(locale.disciplines, true, (item) => item.name),
  },
  difficulty: {
    name: locale.commands.compose.difficulty.name,
    description: locale.commands.compose.difficulty.description,
    type: ApplicationCommandOptionType.INTEGER,
    required: false,
    min_value: 2,
    max_value: 9,
  },
  modifier: {
    name: locale.commands.compose.modifier.name,
    description: locale.commands.compose.modifier.description,
    type: ApplicationCommandOptionType.INTEGER,
    required: false,
    min_value: -10,
    max_value: 10,
  },
  description: {
    name: locale.commands.compose.descriptionField.name,
    description: locale.commands.compose.descriptionField.description,
    type: ApplicationCommandOptionType.STRING,
    required: false,
    min_length: 1,
    max_length: 6000,
  },
};

command({
  name: locale.commands.check.name,
  description: locale.commands.check.description,
  solve: checkSolver,
  options: {
    dices: {
      name: locale.commands.check.dices.name,
      description: locale.commands.check.dices.description,
      type: ApplicationCommandOptionType.INTEGER,
      required: false,
      min_value: 1,
      max_value: 5,
    },
  },
});

command({
  name: locale.commands.roll.name,
  description: locale.commands.roll.description,
  solve: rollSolver,
  options: {
    dices: {
      name: locale.commands.roll.dices.name,
      description: locale.commands.roll.dices.description,
      type: ApplicationCommandOptionType.INTEGER,
      required: true,
      min_value: 1,
      max_value: 30,
    },
    hunger: {
      name: locale.commands.roll.hunger.name,
      description: locale.commands.roll.hunger.description,
      type: ApplicationCommandOptionType.INTEGER,
      required: false,
      min_value: 1,
      max_value: 5,
    },
    difficulty: {
      name: locale.commands.roll.difficulty.name,
      description: locale.commands.roll.difficulty.description,
      type: ApplicationCommandOptionType.INTEGER,
      required: false,
      min_value: 2,
      max_value: 9,
    },
    description: {
      name: locale.commands.roll.descriptionField.name,
      description: locale.commands.roll.descriptionField.description,
      type: ApplicationCommandOptionType.STRING,
      required: false,
    },
  },
});

command({
  name: locale.commands.compose.name,
  description: locale.commands.compose.description,
  solve: composeSolver,
  options: composeOptions,
});

command({
  name: locale.commands.dicePool.name,
  description: locale.commands.dicePool.description,
  solve: dicePoolSolver,
  options: dicePoolOptions,
});

command({
  name: locale.commands.shortcut.name,
  description: locale.commands.shortcut.description,
  solve: groupSolver({
    compose: shortcutComposeSolver,
    dicePool: shortcutDicePoolSolver
  }),
  options: {
    compose: {
      name: locale.commands.compose.name,
      description: locale.commands.compose.description,
      type: ApplicationCommandOptionType.SUB_COMMAND,
      options: composeOptions,
    },
    dicePool: {
      name: locale.commands.dicePool.name,
      description: locale.commands.dicePool.description,
      type: ApplicationCommandOptionType.SUB_COMMAND,
      options: dicePoolOptions,
    },
  },
});