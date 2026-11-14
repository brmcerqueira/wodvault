import { ButtonComponent } from "harmony";
import { composeSolver } from "../solver/composeSolver.ts";
import { button } from "./common.ts";
import { locale } from "../i18n/locale.ts";
import { keys } from "../../utils.ts";
import { ComposeInput } from "../utils.ts";

const attributes = [
  ...keys(locale.attributes.physical),
  ...keys(locale.attributes.social),
  ...keys(locale.attributes.mental),
];

const renown = keys(locale.renown).filter((key) => key != "name");

const skillsPhysical = keys(locale.skills.physical);
const skillsSocial = keys(locale.skills.social);
const skillsMental = keys(locale.skills.mental);
const disciplines = keys(locale.disciplines).filter((key) => key != "name");

function parseValue<T>(array: T[], data: string): T | undefined {
  const index = parseInt(data);
  return index > 0 ? array[index - 1] : undefined;
}

function parseIndex<T>(array: T[], data?: T): number {
  return data === undefined ? 0 : (array.indexOf(data) + 1);
}

const composeButtonRaw = button<ComposeInput>(
  (context, interaction) => ({
    attribute: parseValue(attributes, context[0]),
    renown: parseValue(renown, context[1]),
    secondaryAttribute: parseValue(attributes, context[2]),
    skillPhysical: parseValue(skillsPhysical, context[3]),
    skillSocial: parseValue(skillsSocial, context[4]),
    skillMental: parseValue(skillsMental, context[5]),
    discipline: parseValue(disciplines, context[6]),
    difficulty: parseInt(context[7]) > 0 ? parseInt(context[7]) : undefined,
    modifier: parseInt(context[8]) != 0 ? parseInt(context[8]) : undefined,
    description: interaction?.message?.embeds[0].title,
  }),
  composeSolver,
);

export function composeButton(input: ComposeInput): ButtonComponent {
  return composeButtonRaw(
    {
      emoji: {
        name: "🎲",
      },
    },
    parseIndex(attributes, input.attribute),
    parseIndex(renown, input.renown),
    parseIndex(attributes, input.secondaryAttribute),
    parseIndex(skillsPhysical, input.skillPhysical),
    parseIndex(skillsSocial, input.skillSocial),
    parseIndex(skillsMental, input.skillMental),
    parseIndex(disciplines, input.discipline),
    input.difficulty || 0,
    input.modifier || 0,
  );
}
