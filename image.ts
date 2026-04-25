import { locale } from "./i18n/backend/locale.ts";

const apiImage = "api/image/";
const thumbs = "thumbs/";
const pixhostThumbs = `https://t1.pixhost.to/${thumbs}`;

export async function uploadImage(image: File): Promise<string> {
  const form = new FormData();

  form.append("img", image, image.name);
  form.append("content_type", "0");
  form.append("max_th_size", "420");

  const response = await fetch("https://api.pixhost.to/images", {
    method: "POST",
    body: form,
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(locale.sendPixhostError);
  }

  const result = await response.json();

  const thumbnail: string = result.th_url;

  return `${apiImage}${thumbnail.substring(thumbnail.indexOf(thumbs) + thumbs.length)}`;
}

export async function getImage(
  path: string,
): Promise<
  { body: ReadableStream<Uint8Array<ArrayBuffer>> | null; contentType: string }
> {
  const response = await fetch(`${pixhostThumbs}/${path}`, {
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

export async function getImageDataURL(path: string): Promise<string | ArrayBuffer | null> {
  const response = await fetch(path.startsWith(apiImage) ? `${pixhostThumbs}/${path.substring(path.indexOf(apiImage) + apiImage.length)}` : path);
  const blob = await response.blob();

  return await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}