import { Collection } from "./collection.ts";
import { Character } from "../../character.ts";
import { PreferenceCollection } from "./preferenceCollection.ts";

type Storage = {
  characters: Collection<Character>;
  preferences: PreferenceCollection;
};

type Collections = Record<
  keyof Storage,
  {
    collection: new (
      database: IDBDatabase,
      name: string,
    ) => unknown;
    options?: IDBObjectStoreParameters;
  }
>;

function setup(): Collections {
  return {
    characters: {
      collection: Collection,
      options: {
        keyPath: "id",
      },
    },
    preferences: {
      collection: PreferenceCollection,
      options: {
        keyPath: "id",
      },
    },
  };
}

function createStorage(): Promise<Storage> {
  return new Promise((resolve, reject) => {
    const collections = setup();

    const request = indexedDB.open("wodvault", 1);

    request.onupgradeneeded = (event) => {
      const database = (event.target as IDBOpenDBRequest).result;

      for (const key in collections) {
        const value = collections[key as keyof Storage];
        if (value.options) {
          database.createObjectStore(key, value.options);
        }
      }
    };

    request.onsuccess = () => {
      console.log("Database opened!");

      const result: Record<string, unknown> = {};

      for (const key in collections) {
        const value = collections[key as keyof Storage];
        result[key] = new value.collection(request.result, key);
      }

      resolve(result as Storage);
    };

    request.onerror = () => {
      console.error("Database error:", request.error);
      reject(request.error);
    };
  });
}

export const storage = await createStorage();
