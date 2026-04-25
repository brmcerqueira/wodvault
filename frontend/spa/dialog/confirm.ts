import { locale } from "../i18n/locale.ts";
import { DialogBody } from "./dialogBody.ts";

export class Confirm extends DialogBody<boolean> {

    constructor(private message: string) {
      super();
    }

    public override resolve(isConfirm: boolean): void {
      this.resolvers.resolve(isConfirm);
    }

    public override get buttonClose(): string {
      return locale.no;
    }

    public override get title(): string | undefined {
      return undefined;
    }

    public override get buttonConfirm(): string | undefined {
      return locale.yes;
    }

    public override body(): React.ReactNode {
      return this.message;
    }
}