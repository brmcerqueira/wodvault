// deno-lint-ignore-file no-explicit-any
import { Interaction } from "$harmony/mod.ts";
import { Character } from "../../character.ts";
import { Guild } from "../guild.ts";
import { AttributeType, ComposeInput, getCharacterByUserId, InteractionResponseError } from "../utils.ts";
import { sendRoll } from "../sendRoll.ts";
import { locale } from "../i18n/locale.ts";

export async function composeSolver(
  interaction: Interaction,
  guild: Guild,
  input: ComposeInput,
) {
  const character = await getCharacterByUserId(guild, interaction.user.id);

  if (character === undefined) {
    throw new InteractionResponseError(locale.characterNotFound);
  }

  const description: string[] = [];

  let dices = 0;

  if (input.attribute) {
    dices += getAttributeValue(
      character,
      input.attribute,
      description,
    );
  }

  if (input.renown) {
    description.push(locale.renown[input.renown]);
    dices += character.renown[input.renown];
  }

  if (input.secondaryAttribute) {
    dices += getAttributeValue(
      character,
      input.secondaryAttribute,
      description,
    );
  }

  if (input.skillPhysical) {
    description.push(locale.skills.physical[input.skillPhysical]);
    dices += character.skills.physical[input.skillPhysical];
  }

  if (input.skillSocial) {
    description.push(locale.skills.social[input.skillSocial]);
    dices += character.skills.social[input.skillSocial];
  }

  if (input.skillMental) {
    description.push(locale.skills.mental[input.skillMental]);
    dices += character.skills.mental[input.skillMental];
  }

  if (input.discipline) {
    description.push((locale.disciplines[input.discipline] as any).name);
    dices += character.disciplines[input.discipline]?.length || 0;
  }

  await sendRoll(
    interaction,
    guild,
    dices,
    character.hungerOrRage,
    input.difficulty || 1,
    input.modifier || 0,
    `${input.description ? `${input.description} ` : ""}[${
      description.join(" + ")
    }]`,
    character,
  );
}

function getAttributeValue(
  character: Character,
  attribute: AttributeType,
  description: string[],
): number {
  switch (attribute) {
    case "strength":
    case "dexterity":
    case "stamina":
      description.push(locale.attributes.physical[attribute]);
      return character.attributes.physical[attribute];
    case "charisma":
    case "manipulation":
    case "composure":
      description.push(locale.attributes.social[attribute]);
      return character.attributes.social[attribute];
    case "intelligence":
    case "wits":
    case "resolve":
      description.push(locale.attributes.mental[attribute]);
      return character.attributes.mental[attribute];
  }
}
