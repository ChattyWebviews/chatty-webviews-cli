import { DataStoreReference } from "../storage/data-store";

export type ModuleReleaseDB = {
    version: string;
    releaseName: string;
    moduleName: string;
    modulePath: ModuleCloudStoragePath;
    md5: string,
    createdAt: any,
    firestoreDoc: DataStoreReference
};

export type ModuleCloudStoragePath = string;