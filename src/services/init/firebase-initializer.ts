import { createNodeFilePersistence } from "@vmutafov/firebase-auth-node-persistence";
import { FirebaseOptions, getApp, initializeApp } from "firebase/app";
import { getAuth, initializeAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore/lite";
import { getStorage } from "firebase/storage";
import { existsSync, readFileSync } from "node:fs";
import { writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { cwd } from "node:process";

const filePath = resolve(cwd(), '.auth');

const nodeFilePersistence = createNodeFilePersistence({
    filePath: filePath,
    getStorage: () => {
        if (!existsSync(filePath)) {
            return {};
        }

        const storageBase64Content = readFileSync(filePath, { encoding: 'utf-8' });
        const storageContent = Buffer.from(storageBase64Content, 'base64').toString('utf-8');
        return JSON.parse(storageContent);
    },
    setStorage: async (storage) => {
        const storageContent = JSON.stringify(storage, null, 2);
        const storageBase64Content = Buffer.from(storageContent).toString('base64');
        await writeFile(filePath, storageBase64Content, { encoding: 'utf-8' });
    }
});

const firebaseConfig = createFirebaseConfigFromEnvVars();
export const app = initializeApp(firebaseConfig);

function createFirebaseConfigFromEnvVars(): FirebaseOptions {
    return {
        apiKey: process.env.FIREBASE_API_KEY,
        authDomain: process.env.FIREBASE_AUTH_DOMAIN,
        projectId: process.env.FIREBASE_PROJECT_ID,
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
        appId: process.env.FIREBASE_APP_ID
    }
}

export const db = getFirestore();
export const storage = getStorage();
export const auth = initializeAuth(app, {
    persistence: nodeFilePersistence
});