import { Handlers } from "$fresh/server.ts";
import { locale } from "../../../i18n/backend/locale.ts";
import { withJson } from "../../../withJson.ts";
import { uploadImage } from "../../../image.ts";

export const handler: Handlers = {
  async POST(request) {
    const contentType = request.headers.get("content-type") || "";

    if (!contentType.includes("multipart/form-data")) {
      throw new Error(locale.invalidFormat);
    }

    const formData = await request.formData();
    const image = formData.get("image");

    if (!(image instanceof File)) {
      throw new Error(locale.invalidFile);
    }

    return withJson(await uploadImage(image));
  },
};
