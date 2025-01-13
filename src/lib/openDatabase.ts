const dbName = "CodifyDB";
const storeName = "userData";

export async function openDatabase(): Promise<IDBDatabase> {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open(dbName, 1);

    request.onupgradeneeded = (event: Event) => {
      const db = (event.target as IDBRequest).result as IDBDatabase;

      if (!db.objectStoreNames.contains(storeName)) {
        db.createObjectStore(storeName, { keyPath: "id" });
      }
    };

    request.onsuccess = () => {
      resolve(request.result as IDBDatabase);
    };

    request.onerror = (event: Event) => {
      const errorEvent = event as ErrorEvent;
      if (errorEvent.target) {
        reject((errorEvent.target as IDBRequest).error);
      } else {
        reject(new Error("Unknown error occurred while opening the database."));
      }
    };
  });
}
