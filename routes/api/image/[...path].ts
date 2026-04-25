import { Handlers } from "$fresh/server.ts";
import { locale } from "../../../i18n/backend/locale.ts";
import { getImage } from "../../../image.ts";

export const handler: Handlers = {
  async GET(_request, context) {
    const path = context.params.path;

    if (!path || path.includes("..")) {
      throw new Error(locale.invalidFile);
    }

    const image = await getImage(path);

    return new Response(image.body, {
      status: 200,
      headers: {
        "Content-Type": image.contentType,
        "Cache-Control": "public, max-age=86400",
      },
    });
  },
};
