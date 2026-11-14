import {
  ApplicationCommandPayload,
  Client,
  EmojiPayload,
  GatewayIntents,
  Interaction,
  InteractionResponseType,
  InteractionType,
} from "$harmony/mod.ts";
import { colors, emojis, InteractionResponseError } from "./utils.ts";
import {
  createMissingCommands,
  interactionCommand,
} from "./commands/module.ts";
import { logger } from "./logger.ts";
import { encodeBase64 } from "$std/encoding/base64.ts";
import { interactionCustomId } from "./actions/module.ts";
import { locale } from "./i18n/locale.ts";
import { CreateEmojiPayload } from "$harmony/src/types/mod.ts";
import { start } from "./webSocketService.ts";

async function cleanCommands(
  discordCommands: ApplicationCommandPayload[],
  ...keys: string[]
) {
  for (let index = 0; index < discordCommands.length; index++) {
    const command = discordCommands[index];
    if (keys.length == 0 || (keys && keys.indexOf(command.name) > -1)) {
      await client.rest.endpoints.deleteGlobalApplicationCommand(
        client.applicationID!,
        command.id,
      );
      discordCommands.splice(index, 1);
      index--;
      logger.info("Delete Command %v", command);
    }
  }
}

const client = new Client({
  token: Deno.env.get("DISCORD_TOKEN")!,
  intents: [
    GatewayIntents.GUILDS,
    GatewayIntents.GUILD_MESSAGES,
    GatewayIntents.GUILD_MESSAGE_REACTIONS,
    GatewayIntents.DIRECT_MESSAGES,
    GatewayIntents.DIRECT_MESSAGE_REACTIONS,
    GatewayIntents.MESSAGE_CONTENT,
  ],
});

async function getGlobalApplicationCommands(
  applicationId: string,
): Promise<ApplicationCommandPayload[]> {
  return await client.rest.get(`/applications/${applicationId}/commands`);
}

async function listGlobalApplicationEmojis(
  applicationId: string,
): Promise<{ items: EmojiPayload[] }> {
  return await client.rest.get(`/applications/${applicationId}/emojis`);
}

async function createGlobalApplicationEmoji(
  applicationId: string,
  payload: CreateEmojiPayload,
): Promise<EmojiPayload> {
  return await client.rest.post(
    `/applications/${applicationId}/emojis`,
    payload,
  );
}

client.on("ready", async () => {
  try {
    logger.info("Loading Wodbot...");

    const discordCommands = await getGlobalApplicationCommands(
      client.applicationID!,
    );

    const cleanFlagIndex = Deno.args.indexOf("-c");
    if (cleanFlagIndex > -1) {
      const cleanCommandKeys = Deno.args.slice(cleanFlagIndex + 1);
      await cleanCommands(discordCommands, ...cleanCommandKeys);
    }

    await createMissingCommands(
      client.applicationID!,
      discordCommands,
      client.rest.endpoints,
    );

    const applicationEmojis =
      (await listGlobalApplicationEmojis(client.applicationID!))
        .items;

    for (const key in emojis) {
      let emoji = applicationEmojis.find((e) => e.name == key);

      if (!emoji) {
        emoji = await createGlobalApplicationEmoji(
          client.applicationID!,
          {
            name: key,
            image: `data:image/webp;base64,${
              encodeBase64(await Deno.readFile(`./emojis/${key}.webp`))
            }`,
          },
        );
      }

      emojis[key] = emoji;
    }

    logger.info("Wodbot online!");
  } catch (error) {
    logger.error(error);
  }
}).on("interactionCreate", async (interaction: Interaction) => {
  try {
    logger.info(
      "Interaction %v %v",
      interaction.type,
      interaction.data,
    );

    if (!interaction.user.bot) {
      if (!interaction.guild) {
        throw new InteractionResponseError(locale.unauthorized);
      }
      if (
        interaction.type == InteractionType.MESSAGE_COMPONENT ||
        interaction.type == InteractionType.MODAL_SUBMIT
      ) {
        await interactionCustomId(interaction);
      } else if (
        interaction.type == InteractionType.APPLICATION_COMMAND ||
        interaction.type == InteractionType.AUTOCOMPLETE
      ) {
        await interactionCommand(interaction);
      }
    }
  } catch (error) {
    logger.error(error);
    if (error instanceof InteractionResponseError) {
      await interaction.respond({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        embeds: [{
          title: error.message,
          color: colors.red,
        }],
        ephemeral: true,
      });
    }
  }
});

await start(parseInt(Deno.env.get("WEBSOCKET_PORT") ?? "8787"));

await client.connect();
