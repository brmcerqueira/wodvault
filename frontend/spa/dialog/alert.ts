import { locale } from "../i18n/locale.ts";
import { DialogBody } from "./dialogBody.ts";

export class Alert extends DialogBody<void> {

    constructor(private message: string) {
      super();
    }

    public override resolve(): void {
      this.resolvers.resolve();
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

    public override body(): React.ReactNode {
      return this.message;
    }
}