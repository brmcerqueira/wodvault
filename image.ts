import { locale } from "./i18n/backend/locale.ts";

const imgbbApiKey = Deno.env.get("IMGBB_API_KEY") ?? "";

export async function uploadImage(image: File): Promise<string> {
  if (!imgbbApiKey) {
    throw new Error(locale.sendImageError);
  }

  const form = new FormData();

  form.append("image", image, image.name);
  form.append("name", image.name);

  const response = await fetch(`https://api.imgbb.com/1/upload?key=${encodeURIComponent(imgbbApiKey)}`, {
    method: "POST",
    body: form,
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(locale.sendImageError);
  }

  const result = await response.json();
  const remoteUrl: string | undefined = result.data?.thumb?.url ??
    result.data?.image?.url ?? result.data?.url;

  if (!remoteUrl) {
    throw new Error(locale.sendImageError);
  }

  return `api/image${new URL(remoteUrl).pathname}`;
}

export async function getImage(
  path: string,
): Promise<
  { body: ReadableStream<Uint8Array<ArrayBuffer>> | null; contentType: string }
> {
  const response = await fetch(`https://i.ibb.co/${path}`, {
    headers: {
      "User-Agent": "Wodvault-Image-Proxy",
      Accept: "image/*",
    },
  });

  if (!response.ok || !response.body) {
    throw new Error(locale.pageNotFound);
  }

  const contentType = response.headers.get("content-type");

  if (!contentType || !contentType.startsWith("image/")) {
    throw new Error(locale.unsupportedMediaType);
  }

  return {
    body: response.body,
    contentType,
  };
}