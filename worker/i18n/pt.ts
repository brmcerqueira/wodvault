import { LocaleType } from "./localeType.ts";
import { LocaleType as BaseLocaleType } from "../../i18n/localeType.ts";
import { basePt } from "../../i18n/pt.ts";

export const pt: LocaleType & BaseLocaleType = Object.assign({
  imageFileIsRequired: "O arquivo de imagem é obrigatório.",
  emptyImage: "A imagem está vazia.",
  imageExceedsLimit: "A imagem excede o limite de tamanho permitido.",
  invalidImageType:
    "Tipo de imagem inválido. Formatos permitidos: JPEG, PNG e WebP.",
  failedToUploadImage: "Não foi possível enviar a imagem. Tente novamente.",
  clan: "Clã",
  predator: "Predador",
  generation: "Geração",
  auspice: "Augúrio",
  tribe: "Tribo",
}, basePt);
