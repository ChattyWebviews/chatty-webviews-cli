import { ModuleDirectoryPath } from "./config";

export type CreateReleaseProps = {
    appId: string;
    version: string;
    name: string;
    modules: Array<{ moduleName: string, modulePath: ModuleDirectoryPath }>;
}

export type ModuleReleaseProps = {
    version: string;
    releaseName: string;
    moduleName: string;
    modulePath: ModuleDirectoryPath;
}

export type AuthProps = {
    appId: string;
    userEmail: string;
    userPassword: string;
};