import {
  ButtonComponent,
  ButtonStyle,
  Interaction,
  InteractionMessageComponentData,
  InteractionModalSubmitData,
  InteractionResponseType,
  MessageComponentEmoji,
  MessageComponentType,
  TextInputStyle,
} from "$harmony/mod.ts";
import { separator, Solver } from "../utils.ts";
import { Guild } from "../guild.ts";


type Parse = (context: string[], interaction?: Interaction) => any

export type ButtonOptions = {
  label?: string;
  style?: ButtonStyle;
  emoji?: MessageComponentEmoji;
};

export type ModalFields = {
  [name: string]: {
    label: string;
    style: TextInputStyle | keyof typeof TextInputStyle;
    placeholder?: string;
    minLength?: number;
    maxLength?: number;
    value?: string;
    required?: boolean;
  };
};

export type ModalOptions = {
  title: string;
  fields: ModalFields;
};

export type ModalInput<T extends Record<string, string>> = {
  context: string[];
  fields: T;
};

const custom: {
  parse: Parse;
  solve: Solver;
}[] = [];

function generateId(
  parse: Parse,
  solve: Solver,
) {
  const id = custom.length;
  custom.push({
    parse,
    solve,
  });
  return id;
}

function modalParse(
  context: string[],
  interaction: Interaction,
): ModalInput<any> {
  const fields: any = {};

  const data = interaction.data as InteractionModalSubmitData;

  for (const row of data.components) {
    const textInput = row.components[0];
    if (textInput.value !== "") {
      fields[textInput.custom_id] = textInput.value;
    }
  }

  return {
    context,
    fields: fields,
  };
}

export async function interactionCustomId(
  interaction: Interaction,
  guild: Guild,
) {
  const data = interaction.data as InteractionMessageComponentData
    | InteractionModalSubmitData;
  const array = data.custom_id.split(separator);

  if (array.length > 0) {
    const index = parseInt(array[0]);
    if (!isNaN(index)) {
      const action = custom[index];
      await action.solve(
        interaction,
        guild,
        action.parse(array.slice(1), interaction),
      );
    }
  }
}

export function button<T>(
  parse: (context: string[], interaction?: Interaction) => T,
  solve: Solver,
): (options: ButtonOptions, ...context: any[]) => ButtonComponent {
  const id = generateId(parse as Parse, solve);
  return (options: ButtonOptions, ...context: any[]): ButtonComponent => {
    return {
      type: MessageComponentType.BUTTON,
      label: options.label || "",
      style: options.style || ButtonStyle.PRIMARY,
      emoji: options.emoji,
      customID: [id, ...context].join(separator),
    };
  };
}

export function modal<T>(
  build: (
    interaction: Interaction,
    guild: Guild,
    context: any[],
    input: T,
  ) => ModalOptions | Promise<ModalOptions>,
  solve: Solver,
): Solver {
  const id = generateId(modalParse as Parse, solve);
  return async (
    interaction: Interaction,
    guild: Guild,
    input: T,
  ) => {
    const context: any[] = [];

    const options = await build(interaction, guild, context, input);

    await interaction.respond({
      type: InteractionResponseType.MODAL,
      customID: [id, ...context].join(separator),
      title: options.title,
      components: Object.keys(options.fields).map((key) => {
        const field = options.fields[key];
        return {
          type: MessageComponentType.ACTION_ROW,
          components: [{
            type: MessageComponentType.TEXT_INPUT,
            label: field.label,
            value: field.value,
            style: field.style,
            minLength: field.minLength,
            maxLength: field.maxLength,
            required: field.required,
            customID: key,
          }],
        };
      }),
    });
  };
}
