import { Collection } from "./collection.ts";

const myIdKey = "myId";
const darkKey = "dark";

export class PreferenceCollection {
  private collection: Collection<{
    id: string;
    value: any;
  }>;
  constructor(
    database: IDBDatabase,
    name: string,
  ) {
    this.collection = new Collection(database, name);
  }

  public async myId(): Promise<string> {
    let preference = await this.collection.get(myIdKey);

    if (preference === undefined) {
      preference = {
        id: myIdKey,
        value: crypto.randomUUID(),
      };
      await this.collection.save(preference);
    }

    return preference.value;
  }

  public async isDark(): Promise<boolean> {
    const preference = await this.collection.get(darkKey);
    return preference?.value ?? false;
  }

  public async setDark(value: boolean): Promise<void> {
    await this.collection.save({
      id: darkKey,
      value,
    });
  }
}
