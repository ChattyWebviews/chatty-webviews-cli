export interface BlobStore {
    add(data: Blob | Uint8Array | ArrayBuffer, path: string): Promise<void>;
    createDownloadUrl(path: string): Promise<string>
}