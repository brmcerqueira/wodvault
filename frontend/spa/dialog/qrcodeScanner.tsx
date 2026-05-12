/** @jsxImportSource $react */
/** @jsxRuntime automatic */

import { Html5Qrcode } from "$html5-qrcode";
import { locale } from "../i18n/locale.ts";
import { DialogBody } from "./dialogBody.ts";

const qrcodeId = "qrcode";

export class QrcodeScanner extends DialogBody<string | undefined> {
  private qrCode: Html5Qrcode | undefined;

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

  public override async dialogDidMount() {
    this.qrCode = new Html5Qrcode(qrcodeId);

    const devices = await Html5Qrcode.getCameras();

    if (devices.length > 0) {
      const camera = devices.find((c) =>
        /back|rear|traseira|environment/i.test(c.label)
      ) ||
        devices.find((c) => /front|frontal|user/i.test(c.label)) ||
        devices[0];

      await this.qrCode.start(
        camera.id,
        {
          fps: 10,
          qrbox: 250,
        },
        (decodedText) => this.resolvers.resolve(decodedText),
        undefined,
      );
    }
  }

  public override dialogWillUnmount() {
    this.qrCode?.stop();
  }

  public override body(): React.ReactNode {
    return <div id={qrcodeId} />;
  }
}
