import {
  Interaction,
  InteractionResponseType,
  MessageAttachment,
} from "harmony";
import { locale } from "../i18n/locale.ts";
import { InteractionResponseError } from "../utils.ts";
import { allPlayersCharacters, getStorytellerId } from "../persistence.ts";

export async function overlayCssSolver(
  interaction: Interaction,
  input: { hide?: string },
) {
  const storytellerId = await getStorytellerId();

  if (storytellerId != interaction.user.id) {
    throw new InteractionResponseError(locale.unauthorized);
  }

  const hides: string[] = [storytellerId];

  if (input.hide) {
    hides.push(input.hide);
  }

  const characters = await allPlayersCharacters();

  const content = `
    body {
      background-color: rgba(0, 0, 0, 0);
      margin: 0em;
      overflow: hidden;
    }

    .voice_state {
      display: flex;
      justify-content: flex-end;
      padding-right: 0.625em;
    }

    .voice_state img {
      display: none;
    }

    .wrapper_speaking .voice_username::before {
        border: 0.125em solid #C71585 !important;
    }

    ${
    (await Promise.all(
      Object.entries(characters).map(async (pair) => {
        const image = await imageToBase64(pair[1].image);
        return image
          ? `li[data-userid="${pair[0]}"] .voice_username::before {
        content: "";
        display: inline-block;
        width: 2.813em;
        height: 2.813em;
        margin-right: 0.375em;
        border-radius: 1em;
        border: 0.125em solid transparent;
        background-image: url(${image});
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
        vertical-align: middle;
    }

    li[data-userid="${pair[0]}"] .voice_username span::after {
      content: "(${pair[1].player})";
      color: #DC143C;
      margin-left: 0.375em;
    }
    `
          : "";
      }),
    )).join("\n    ")
  }

    ${
    hides.map((id) =>
      `li[data-userid="${id}"] {
      display: none;
    }
    `
    ).join("\n    ")
  }
  `;

  await interaction.respond({
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    files: [
      new MessageAttachment(
        "overlay.css",
        new Blob([content], {
          type: "text/css",
        }),
      ),
    ],
  });
}

async function imageToBase64(url: string): Promise<string | undefined> {
  const response = await fetch(url);

  if (!response.ok) {
    return undefined;
  }

  const blob = await response.blob();

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      resolve(reader.result as string);
    };

    reader.onerror = () => reject(reader.error);

    reader.readAsDataURL(blob);
  });
}
