export abstract class DialogBody<T = any> {

  protected resolvers: PromiseWithResolvers<T>;

  constructor() {
    this.resolvers = Promise.withResolvers<T>();
  }

  public get promise(): Promise<T> {
    return this.resolvers.promise;
  }

  public abstract get buttonClose(): string;

  public abstract get title(): string | undefined;

  public abstract get buttonConfirm(): string | undefined;

  public abstract resolve(isConfirm: boolean): void;

  public abstract body(): React.ReactNode;
}
