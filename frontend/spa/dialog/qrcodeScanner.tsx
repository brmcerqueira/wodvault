import { Html5Qrcode } from "html5-qrcode";
import { locale } from "../i18n/locale.ts";
import { DialogBody } from "./dialogBody.ts";
import { Spinner } from "react-bootstrap";

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
    const devices = await Html5Qrcode.getCameras();

    const camera = devices.find((c) => /camera 0/i.test(c.label)) ||
      devices.find((c) => /back|rear|traseira|environment/i.test(c.label)) ||
      devices[0] || null;

    if (camera) {
      this.qrCode = new Html5Qrcode(qrcodeId);

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
    return (
      <div
        id={qrcodeId}
        className="d-flex justify-content-center align-items-center"
      >
        {this.qrCode == undefined && (
          <Spinner animation="border" size="sm" className="me-2" />
        )}
      </div>
    );
  }
}
