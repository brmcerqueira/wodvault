/** @jsxImportSource $react */
/** @jsxRuntime automatic */

import { Html5QrcodeScanner } from "$html5-qrcode";
import { locale } from "../i18n/locale.ts";
import { DialogBody } from "./dialogBody.ts";

const qrcodeScannerId = "qrcode-scanner";

export class QrcodeScanner extends DialogBody<string | undefined> {
  private scanner: Html5QrcodeScanner | undefined;

  public override resolve(): void {
    this.resolvers.resolve(undefined);
  }

  public override get buttonClose(): string {
    return locale.close;
  }

  public override get title(): string | undefined {
    return undefined;
  }

  public override get buttonConfirm(): string | undefined {
    return undefined;
  }

  public override dialogDidMount() {
   this.scanner = new Html5QrcodeScanner(
      qrcodeScannerId,
      {
        fps: 10,
        qrbox: 250,
      },
      false,
    );

    this.scanner.render(
      (decodedText) => {
        this.resolvers.resolve(decodedText);
      },
      (error) => {
        console.log(error);
      },
    );
  }

  public override dialogWillUnmount() {
    this.scanner?.clear();
  }

  public override body(): React.ReactNode {
    return <div id={qrcodeScannerId}/>;
  }
}
