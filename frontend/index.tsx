import { renderToStaticMarkup } from "react-dom/server";

const basePath = Deno.env.get("BASE_PATH") ?? "/";

function Index() {
  return (
    <html>
      <head>
        <base href={basePath} />
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        <title>Wodvault</title>

        <link rel="stylesheet" href="vendor/bootstrap/bootstrap.min.css" />
        <link
          rel="stylesheet"
          href="vendor/bootstrap-icons/bootstrap-icons.css"
        />
        <link rel="stylesheet" href="styles.css" />
        <link rel="manifest" href="manifest.json" />
        <link rel="icon" type="image/x-icon" href="favicon.ico" />

        <meta name="mobile-web-app-capable" content="yes" />
      </head>

      <body>
        <div id="root" />
        <script type="module" src="main.min.js" defer />
      </body>
    </html>
  );
}

await Deno.writeTextFile(
  "./static/index.html",
  renderToStaticMarkup(
    <Index />,
  ),
);

Deno.exit(0);
