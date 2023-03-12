import { doc, DocumentReference, Firestore, serverTimestamp, setDoc } from "firebase/firestore/lite";
import { DataStore } from "../data-store";

export class FirebaseDataStore implements DataStore {

    constructor(private db: Firestore) { }

    async add<T extends { [key: string]: any }>(data: T, path: string): Promise<DocumentReference> {
        const dataDoc = doc(this.db, path);
        await setDoc(dataDoc, data);
        return dataDoc;
    }

    timestamp() {
        return serverTimestamp();
    }

}