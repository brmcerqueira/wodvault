/** @jsxImportSource $react */
/** @jsxRuntime automatic */

import { Html5Qrcode, Html5QrcodeCameraScanConfig } from "$html5-qrcode";
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

  private get config(): Html5QrcodeCameraScanConfig {
    return {
      fps: 10,
      qrbox: 250,
    };
  }

  public override async dialogDidMount() {
    this.qrCode = new Html5Qrcode(qrcodeId);

    try {
      await this.qrCode.start(
        { facingMode: "environment" },
        this.config,
        this.onScanSuccess.bind(this),
        undefined,
      );
    } catch {
      await this.qrCode.start(
        { facingMode: "user" },
        this.config,
        this.onScanSuccess.bind(this),
        undefined,
      );
    }
  }

  private onScanSuccess(decodedText: string) {
    this.resolvers.resolve(decodedText);
  }

  public override dialogWillUnmount() {
    this.qrCode?.stop();
  }

  public override body(): React.ReactNode {
    return <div id={qrcodeId} />;
  }
}
