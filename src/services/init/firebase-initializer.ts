import { createNodeFilePersistence } from "@vmutafov/firebase-auth-node-persistence";
import { getApp, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
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

export const app = initializeApp({
    apiKey: "AIzaSyB6Kld70q7n2MZAHtbRCt8R5yTrrXKmdOc",
    authDomain: "appwraps-releases.firebaseapp.com",
    projectId: "appwraps-releases",
    storageBucket: "appwraps-releases.appspot.com",
    messagingSenderId: "523627059398",
    appId: "1:523627059398:web:c737e1dfb9aad15f095fc7"
});

export const db = getFirestore();
export const storage = getStorage();
export const auth = getAuth();
await auth.setPersistence(nodeFilePersistence);