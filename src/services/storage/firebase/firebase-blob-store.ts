import { ref, uploadBytes, getDownloadURL, FirebaseStorage } from "firebase/storage";
import { BlobStore } from "../blob-store";

export class FirebaseBlobStore implements BlobStore {

    constructor(private storage: FirebaseStorage) { }

    async add(data: Blob | Uint8Array | ArrayBuffer, path: string): Promise<void> {
        const fileStorageRef = ref(this.storage, path);
        await uploadBytes(fileStorageRef, data);
    }

    async createDownloadUrl(path: string): Promise<string> {
        const fileStorageRef = ref(this.storage, path);
        return await getDownloadURL(fileStorageRef);
    }
}