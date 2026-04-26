import { LocaleType } from "./localeType.ts";
import { LocaleType as BaseLocaleType } from "../localeType.ts";
import { basePt } from "../pt.ts";

export const pt: LocaleType & BaseLocaleType = Object.assign({
  unauthorized: "Não autorizado!",
  characterNotFound: "Personagem não encontrado!",
  pageNotFound: "Página não encontrada!",
  invalidFormat: "Formato inválido.",
  sendImageError: "Erro ao enviar imagem para imgBB.",
  unsupportedMediaType: "Tipo de arquivo não suportado.",
  invalidFile: "Arquivo inválido.",
}, basePt);
