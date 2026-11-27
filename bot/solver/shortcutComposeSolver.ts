import {
  EmbedField,
  Interaction,
  InteractionResponseType,
  MessageComponentType,
} from "harmony";
import { AttributeType, colors, ComposeInput } from "../utils.ts";
import { composeButton } from "../actions/mod.ts";
import { locale } from "../i18n/locale.ts";
import { LocaleType } from "../../i18n/localeType.ts";

export async function shortcutComposeSolver(
  interaction: Interaction,
  input: ComposeInput,
) {
  const description: string[] = [];

  if (input.attribute) {
    description.push(getAttributeLabel(
      input.attribute,
    ));
  }

  if (input.renown) {
    description.push(locale.renown[input.renown]);
  }

  if (input.secondaryAttribute) {
    description.push(getAttributeLabel(
      input.secondaryAttribute,
    ));
  }

  if (input.skillPhysical) {
    description.push(locale.skills.physical[input.skillPhysical]);
  }

  if (input.skillSocial) {
    description.push(locale.skills.social[input.skillSocial]);
  }

  if (input.skillMental) {
    description.push(locale.skills.mental[input.skillMental]);
  }

  if (input.discipline) {
    description.push((locale.disciplines[input.discipline] as any).name);
  }

  const fields: EmbedField[] = [{
    name: locale.dicePool,
    value: description.join(" + "),
  }];

  if (input.difficulty) {
    fields.push({
      name: locale.difficulty,
      value: input.difficulty.toString(),
    });
  }

  if (input.modifier) {
    fields.push({
      name: locale.modifier,
      value: input.modifier.toString(),
    });
  }

  await interaction.respond({
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    embeds: [{
      title: input.description || locale.shortcutComposeWithoutDescription,
      color: colors.gray,
      fields,
    }],
    components: [{
      type: MessageComponentType.ACTION_ROW,
      components: [
        composeButton(input),
      ],
    }],
  });
}

function getAttributeLabel(attribute: AttributeType): string {
  return locale.attributes
    .physical[attribute as keyof LocaleType["attributes"]["physical"]] ||
    locale.attributes
      .social[attribute as keyof LocaleType["attributes"]["social"]] ||
    locale.attributes
      .mental[attribute as keyof LocaleType["attributes"]["mental"]];
}
