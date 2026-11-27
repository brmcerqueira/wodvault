export class Collection<T = any> {
  constructor(
    private database: IDBDatabase,
    private name: string,
  ) {
  }

  private getTransactionAndStore(
    mode?: IDBTransactionMode,
  ): [IDBTransaction, IDBObjectStore] {
    const transaction = this.database.transaction(this.name, mode);
    return [transaction, transaction.objectStore(this.name)];
  }

  private readOnly(
    callback: (store: IDBObjectStore) => IDBRequest,
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      const [_, store] = this.getTransactionAndStore("readonly");

      const request = callback(store);

      request.onsuccess = () => {
        console.log("request success!");
        resolve(request.result);
      };

      request.onerror = () => {
        console.error("request error:", request.error);
        reject(request.error);
      };
    });
  }

  private readWrite(
    callback: (store: IDBObjectStore) => void,
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const [transaction, store] = this.getTransactionAndStore("readwrite");

      callback(store);

      transaction.oncomplete = () => {
        console.log("transaction complete!");
        resolve();
      };

      transaction.onerror = () => {
        console.error("transaction error:", transaction.error);
        reject(transaction.error);
      };
    });
  }

  public async all(): Promise<T[]> {
    const result = await this.readOnly((store) => store.getAll());
    return result as T[];
  }

  public get(id: string): Promise<T | undefined> {
    return this.readOnly((store) => store.get(id));
  }

  public save(data: T): Promise<void> {
    return this.readWrite((store) => store.put(data));
  }

  public remove(id: string): Promise<void> {
    return this.readWrite((store) => store.delete(id));
  }
}
