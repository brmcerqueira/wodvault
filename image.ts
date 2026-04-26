import { locale } from "./i18n/backend/locale.ts";

const apiImage = "api/image/";
const imgbbApiKey = Deno.env.get("IMGBB_API_KEY") ?? "";
const imgbbUploadUrl = "https://api.imgbb.com/1/upload";
const allowedImageHosts = new Set(["i.ibb.co"]);

export async function uploadImage(image: File): Promise<string> {
  if (!imgbbApiKey) {
    throw new Error(locale.sendImageError);
  }

  const form = new FormData();

  form.append("image", image, image.name);
  form.append("name", image.name);

  const response = await fetch(`${imgbbUploadUrl}?key=${encodeURIComponent(imgbbApiKey)}`, {
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

  return `${apiImage}${encodeURIComponent(remoteUrl)}`;
}

export async function getImage(
  path: string,
): Promise<
  { body: ReadableStream<Uint8Array<ArrayBuffer>> | null; contentType: string }
> {
  const remoteUrl = new URL(decodeURIComponent(path));

  if (
    remoteUrl.protocol !== "https:" ||
    !allowedImageHosts.has(remoteUrl.hostname)
  ) {
    throw new Error(locale.invalidFile);
  }

  const response = await fetch(remoteUrl, {
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