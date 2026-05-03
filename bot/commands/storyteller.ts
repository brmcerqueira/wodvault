import { ApplicationCommandOptionType, ChannelTypes } from "$harmony/mod.ts";
import { command } from "./common.ts";
import { locale } from "../i18n/locale.ts";
import { setCharacterToUserSolver } from "../solver/setCharacterToUserSolver.ts";
import { setStorytellerSolver } from "../solver/setStorytellerSolver.ts";
import { groupSolver } from "../solver/groupSolver.ts";
import { setDifficultySolver } from "../solver/setDifficultySolver.ts";
import { setModifierSolver } from "../solver/setModifierSolver.ts";
import { clearRollChannelSolver } from "../solver/clearRollChannelSolver.ts";
import { setRollChannelSolver } from "../solver/setRollChannelSolver.ts";
import { clearCurrentCharacterSolver } from "../solver/clearCurrentCharacterSolver.ts";
import { setCurrentCharacterSolver } from "../solver/setCurrentCharacterSolver.ts";

command({
  name: locale.commands.storyteller.name,
  description: locale.commands.storyteller.description,
  solve: groupSolver({
    character: groupSolver({
      clearCurrentCharacter: clearCurrentCharacterSolver,
      setCurrentCharacter: setCurrentCharacterSolver,
      setCharacterToUser: setCharacterToUserSolver,
    }),
    rollChannel: groupSolver({
      clear: clearRollChannelSolver,
      channel: setRollChannelSolver,
    }),
    setStoryteller: setStorytellerSolver,
    setDifficulty: setDifficultySolver,
    setModifier: setModifierSolver,
  }),
  options: {
    character: {
      name: locale.commands.storyteller.character.name,
      description: locale.commands.storyteller.character.description,
      type: ApplicationCommandOptionType.SUB_COMMAND_GROUP,
      options: {
        clearCurrentCharacter: {
          name:
            locale.commands.storyteller.character.clearCurrentCharacter.name,
          description:
            locale.commands.storyteller.character.clearCurrentCharacter
              .description,
          type: ApplicationCommandOptionType.SUB_COMMAND,
        },
        setCurrentCharacter: {
          name: locale.commands.storyteller.character.setCurrentCharacter.name,
          description: locale.commands.storyteller.character.setCurrentCharacter
            .description,
          type: ApplicationCommandOptionType.SUB_COMMAND,
          options: {
            character: {
              name: locale.commands.storyteller.character.setCurrentCharacter
                .character.name,
              description:
                locale.commands.storyteller.character.setCurrentCharacter
                  .character.description,
              type: ApplicationCommandOptionType.STRING,
              required: true,
              autocomplete: true,
            },
          },
        },
        setCharacterToUser: {
          name: locale.commands.storyteller.character.setCharacterToUser.name,
          description: locale.commands.storyteller.character.setCharacterToUser
            .description,
          type: ApplicationCommandOptionType.SUB_COMMAND,
          options: {
            player: {
              name:
                locale.commands.storyteller.character.setCharacterToUser.player
                  .name,
              description:
                locale.commands.storyteller.character.setCharacterToUser.player
                  .description,
              type: ApplicationCommandOptionType.USER,
              required: true,
            },
            character: {
              name: locale.commands.storyteller.character.setCharacterToUser
                .character.name,
              description:
                locale.commands.storyteller.character.setCharacterToUser
                  .character.description,
              type: ApplicationCommandOptionType.STRING,
              required: true,
              autocomplete: true,
            },
          },
        },
      },
    },
    rollChannel: {
      name: locale.commands.storyteller.rollChannel.name,
      description: locale.commands.storyteller.rollChannel.description,
      type: ApplicationCommandOptionType.SUB_COMMAND_GROUP,
      options: {
        clear: {
          name: locale.commands.storyteller.rollChannel.clear.name,
          description:
            locale.commands.storyteller.rollChannel.clear.description,
          type: ApplicationCommandOptionType.SUB_COMMAND,
        },
        channel: {
          name: locale.commands.storyteller.rollChannel.channel.name,
          description:
            locale.commands.storyteller.rollChannel.channel.description,
          type: ApplicationCommandOptionType.SUB_COMMAND,
          options: {
            value: {
              name: locale.commands.storyteller.rollChannel.channel.value.name,
              description: locale.commands.storyteller.rollChannel.channel.value
                .description,
              type: ApplicationCommandOptionType.CHANNEL,
              required: true,
              channel_types: [ChannelTypes.GUILD_TEXT],
            },
          },
        },
      },
    },
    setStoryteller: {
      name: locale.commands.storyteller.setStoryteller.name,
      description: locale.commands.storyteller.setStoryteller.description,
      type: ApplicationCommandOptionType.SUB_COMMAND,
      options: {
        user: {
          name: locale.commands.storyteller.setStoryteller.user.name,
          description:
            locale.commands.storyteller.setStoryteller.user.description,
          type: ApplicationCommandOptionType.USER,
          required: true,
        },
      },
    },
    setDifficulty: {
      name: locale.commands.storyteller.setDifficulty.name,
      description: locale.commands.storyteller.setDifficulty.description,
      type: ApplicationCommandOptionType.SUB_COMMAND,
      options: {
        value: {
          name: locale.commands.storyteller.setDifficulty.value.name,
          description:
            locale.commands.storyteller.setDifficulty.value.description,
          type: ApplicationCommandOptionType.INTEGER,
          required: true,
          min_value: 1,
          max_value: 10,
        },
      },
    },
    setModifier: {
      name: locale.commands.storyteller.setModifier.name,
      description: locale.commands.storyteller.setModifier.description,
      type: ApplicationCommandOptionType.SUB_COMMAND,
      options: {
        value: {
          name: locale.commands.storyteller.setModifier.value.name,
          description:
            locale.commands.storyteller.setModifier.value.description,
          type: ApplicationCommandOptionType.INTEGER,
          required: true,
          min_value: -10,
          max_value: 10,
        },
      },
    },
  },
});
