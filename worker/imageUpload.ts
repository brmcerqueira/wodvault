import type { Env } from "./env.ts";

const MAX_FILE_SIZE = 32 * 1024 * 1024;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });
}

export async function imageUpload(
  request: Request,
  env: Env,
): Promise<Response> {
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  if (request.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  if (!env.IMGBB_API_KEY) {
    return json({ error: "ImgBB API key not configured" }, 500);
  }

  try {
    const incoming = await request.formData();
    const image = incoming.get("image");

    if (!(image instanceof File)) {
      return json({ error: "Image file is required" }, 400);
    }

    if (image.size === 0) {
      return json({ error: "Empty image" }, 400);
    }

    if (image.size > MAX_FILE_SIZE) {
      return json({ error: "Image exceeds 32MB limit" }, 413);
    }

    if (!image.type.startsWith("image/")) {
      return json({ error: "Invalid image type" }, 415);
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

    imgbbUrl.searchParams.set("key", env.IMGBB_API_KEY);

    const response = await fetch(imgbbUrl, {
      method: "POST",
      body: form,
    });

    const body = await response.text();

    return new Response(body, {
      status: response.status,
      headers: {
        ...corsHeaders,
        "Content-Type": response.headers.get("Content-Type") ??
          "application/json",
      },
    });
  } catch (error) {
    console.error("Upload error:", error);

    return json(
      { error: "Failed to upload image" },
      500,
    );
  }
}
