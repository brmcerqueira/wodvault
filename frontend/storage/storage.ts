import { Collection } from "./collection.ts";
import { Character } from "../../character.ts";

type Storage = {
  characters: Collection<Character>;
};

type Collections = Record<
  keyof Storage,
  IDBObjectStoreParameters | null
>;

function setup(): Collections {
  return {
    characters: {
      keyPath: "id",
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
        const options = collections[key as keyof Storage];
        if (options) {
          database.createObjectStore(key, options);
        }
      }
    };

    request.onsuccess = () => {
      console.log("Database opened!");

      const result: Record<string, Collection> = {};

      for (const key in collections) {
        result[key] = new Collection(request.result, key);
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
