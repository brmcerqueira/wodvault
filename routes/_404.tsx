import { Head } from "$fresh/runtime.ts";
import { locale } from "../i18n/backend/locale.ts";

export default function Error404() {
  return (
    <>
      <Head>
        <title>404 - {locale.pageNotFound}</title>
      </Head>
      <p>404 - {locale.pageNotFound}</p>
    </>
  );
}
