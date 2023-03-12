import { CreateReleaseProps, ModuleReleaseProps } from "./types/props.js";

import { resolve } from "node:path";
import { cwd } from "node:process";
import AdmZip from "adm-zip";
import { ModuleDirectoryPath } from "./types/config.js";
import revisionHash from "rev-hash";
import { ux } from "@oclif/core";
import { DataStore } from "./storage/data-store.js";
import { BlobStore } from "./storage/blob-store.js";
import { FirebaseDataStore } from "./storage/firebase/firebase-data-store.js";
import { db, storage } from "./init/firebase-initializer.js";
import { FirebaseBlobStore } from "./storage/firebase/firebase-blob-store.js";
import { ModuleCloudStoragePath, ModuleReleaseDB } from "./types/db.js";

export class ReleaseService {

    private dataStore: DataStore = new FirebaseDataStore(db)
    private blobStore: BlobStore = new FirebaseBlobStore(storage);

    async createRelease(createReleaseProps: CreateReleaseProps): Promise<ModuleReleaseDB[]> {
        const releasedModules: ModuleReleaseDB[] = [];
        for (const module of createReleaseProps.modules) {
            const releaseProps: ModuleReleaseProps = {
                version: createReleaseProps.version,
                moduleName: module.moduleName,
                modulePath: module.modulePath,
                releaseName: createReleaseProps.name || '',
            };

            ux.action.start(`Releasing module '${module.moduleName}' `);
            const releasedModule = await this.createModuleRelease(createReleaseProps.appId, releaseProps);
            releasedModules.push(releasedModule);
            ux.action.stop()
        }

        return releasedModules;
    }

    async createModuleRelease(appId: string, moduleReleaseProps: ModuleReleaseProps): Promise<ModuleReleaseDB> {
        const { md5Hash, path } = await this.uploadModule(appId, moduleReleaseProps.version, moduleReleaseProps.modulePath);

        const release: Omit<ModuleReleaseDB, 'firestoreDoc'> = {
            version: moduleReleaseProps.version,
            releaseName: moduleReleaseProps.releaseName,
            moduleName: moduleReleaseProps.moduleName,
            modulePath: path,
            md5: md5Hash,
            createdAt: this.dataStore.timestamp()
        };

        const releaseDoc = await this.dataStore.add(release, `applications/${appId}/modules/${moduleReleaseProps.moduleName}/releases/${moduleReleaseProps.version}`);

        return {
            ...release,
            firestoreDoc: releaseDoc
        };
    }

    private async uploadModule(appId: string, releaseVersion: string, module: ModuleDirectoryPath): Promise<{ md5Hash: string, path: ModuleCloudStoragePath }> {
        const zip = new AdmZip();
        const modulePath = resolve(cwd(), module);
        await zip.addLocalFolderPromise(modulePath, {});
        const moduleZipBuffer = await zip.toBufferPromise();

        const path = `applications/${appId}/releases/${releaseVersion}/app.zip`;
        await this.blobStore.add(moduleZipBuffer, path);
        const downloadableUrl = await this.blobStore.createDownloadUrl(path)
        const md5Hash = revisionHash(moduleZipBuffer)

        return {
            md5Hash: md5Hash,
            path: downloadableUrl
        };
    }
}

