import { type PageProps } from "$fresh/server.ts";

export default function App({ Component }: PageProps) {
  return (
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Wodvault</title>
        <link rel="stylesheet" href="/vendor/bootstrap/bootstrap.min.css" />
        <link
          rel="stylesheet"
          href="/vendor/bootstrap-icons/bootstrap-icons.css"
        />
        <link rel="stylesheet" href="/styles.css" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" type="image/x-icon" href="favicon.ico" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body>
        <Component />
      </body>
    </html>
  );
}
