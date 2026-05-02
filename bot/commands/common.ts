import {
  ApplicationCommandChoice,
  ApplicationCommandOptionPayload,
  ApplicationCommandOptionType,
  ApplicationCommandPayload,
  ApplicationCommandType,
  Interaction,
  InteractionApplicationCommandData,
  InteractionApplicationCommandOption,
  RESTEndpoints,
} from "$harmony/mod.ts";
import { Solver } from "../utils.ts";
import { Guild } from "../guild.ts";
import { logger } from "../logger.ts";
import { keys } from "../../utils.ts";

export type CommandOption = {
  min_length?: number;
  max_length?: number;
  options?: RecordCommandOptions;
} & Omit<ApplicationCommandOptionPayload, "options">;

export type RecordCommandOptions = Record<string, CommandOption>;

export function buildChoices<T extends object>(
  o: T, excludeName?: boolean,
  getName?: (item: T[Exclude<keyof T, "name">]) => string
): ApplicationCommandChoice[] {
  let array = keys(o);

  if (excludeName) {
    array = array.filter((key) => key != "name");
  }

  return array.map((key) => {
    return {
      name: getName ? getName(o[key] as T[Exclude<keyof T, "name">]) : o[key] as string,
      value: key,
    };
  });
}

function transformOptions(
  record?: RecordCommandOptions,
): ApplicationCommandOptionPayload[] | undefined {
  return record
    ? keys(record).map((key) => {
      const { options, ...rest } = record![key];
      return {
        ...rest,
        options: transformOptions(options),
      } as ApplicationCommandOptionPayload;
    })
    : undefined;
}

export async function createMissingCommands(
  applicationId: string,
  discordCommands: ApplicationCommandPayload[],
  endpoints: RESTEndpoints,
) {
  for (const command of commands) {
    if (!discordCommands.find((c) => c.name == command.name)) {
      const data = {
        name: command.name,
        type: command.type || ApplicationCommandType.CHAT_INPUT,
        description: command.description,
        options: transformOptions(command.options),
      };
      logger.info("Create Command %v", data);
      await endpoints.createGlobalApplicationCommand(
        applicationId,
        data,
      );
    }
  }
}

function parseCommandOptions(
  options: RecordCommandOptions,
  interactionOptions: InteractionApplicationCommandOption[],
  data: InteractionApplicationCommandData,
) {
  const values: any = {};

  for (const key in options) {
    const option = options[key];
    const interactionOption = interactionOptions.find((o) =>
      o.name == option.name
    );

    if (interactionOption) {
      let value: any = undefined;
      switch (option.type) {
        case ApplicationCommandOptionType.SUB_COMMAND:
          if (option.options) {
            value = parseCommandOptions(
              option.options,
              interactionOption.options!,
              data,
            );
          } else {
            value = true;
          }
          break;
        case ApplicationCommandOptionType.SUB_COMMAND_GROUP:
          value = parseCommandOptions(
            option.options!,
            interactionOption.options!,
            data,
          );
          break;
        case ApplicationCommandOptionType.ATTACHMENT:
          value =
            (data.resolved! as any)["attachments"][interactionOption.value];
          break;
        case ApplicationCommandOptionType.BOOLEAN:
          value = interactionOption.value == true;
          break;
        case ApplicationCommandOptionType.INTEGER:
          value = parseInt(interactionOption.value);
          break;
        case ApplicationCommandOptionType.STRING:
          if (interactionOption.value === "false") {
            value = false;
            break;
          }

          value = interactionOption.value === "true" ||
            interactionOption.value || null;
          break;
        default:
          value = interactionOption.value || null;
          break;
      }

      values[key] = option.autocomplete
        ? {
          value: value,
          focused: interactionOption.focused,
        }
        : value;
    }
  }

  return values;
}

export async function interactionCommand(
  interaction: Interaction,
  guild: Guild,
) {
  const data = interaction.data as InteractionApplicationCommandData;
  for (const command of commands) {
    if (data.name == command.name) {
      let input: any;

      if (data.type == ApplicationCommandType.MESSAGE) {
        input = {
          message: data.resolved!.messages![data.target_id!],
          button: data.name,
        };
      } else if (command.options && data.options) {
        input = parseCommandOptions(command.options, data.options, data);
      }

      await command.solve(
        interaction,
        guild,
        input,
      );

      break;
    }
  }
}

export type CommandSolver = {
  name: string;
  solve: Solver;
  type?: ApplicationCommandType;
  description?: string;
  options?: RecordCommandOptions;
};

const commands: CommandSolver[] = [];

export function command(command: CommandSolver) {
  commands.push(command);
}
