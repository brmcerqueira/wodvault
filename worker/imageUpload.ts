import type { Context } from "hono";
import type { Bindings } from "./bindings.ts";
import { locale } from "./i18n/locale.ts";
import { response } from "./response.ts";

const MAX_FILE_SIZE = 32 * 1024 * 1024;

export async function imageUpload(
  context: Context<Bindings>,
): Promise<Response> {
  if (context.req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: response.corsHeaders,
    });
  }

  try {
    const incoming = await context.req.formData();
    const image = incoming.get("image");

    if (!(image instanceof File)) {
      return response.json({ error: locale.imageFileIsRequired }, 400);
    }

    if (image.size === 0) {
      return response.json({ error: locale.emptyImage }, 400);
    }

    if (image.size > MAX_FILE_SIZE) {
      return response.json({ error: locale.imageExceedsLimit }, 413);
    }

    if (!image.type.startsWith("image/")) {
      return response.json({ error: locale.invalidImageType }, 415);
    }

    const form = new FormData();
    form.append("image", image, image.name);

    const name = incoming.get("name");
    if (typeof name === "string" && name.length > 0) {
      form.append("name", name);
    }

    const expiration = incoming.get("expiration");
    if (typeof expiration === "string" && expiration.length > 0) {
      form.append("expiration", expiration);
    }

    const imgbbUrl = new URL(
      "https://api.imgbb.com/1/upload",
    );

    imgbbUrl.searchParams.set("key", context.env.IMGBB_API_KEY);

    const imageResponse = await fetch(imgbbUrl, {
      method: "POST",
      body: form,
    });

    const body = await imageResponse.text();

    return new Response(body, {
      status: imageResponse.status,
      headers: {
        ...response.corsHeaders,
        "Content-Type": imageResponse.headers.get("Content-Type") ??
          "application/json",
      },
    });
  } catch (error) {
    console.error("Upload error:", error);

    return response.json(
      { error: locale.failedToUploadImage },
      500,
    );
  }
}
