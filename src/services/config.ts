import { existsSync } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { cwd } from "node:process";
import { ChattyWebViewsConfig, ModuleDirectoryPath } from "./types/config";

export async function getChattyWebViewsConfigOrThrow(): Promise<ChattyWebViewsConfig> {
    const chattyWebViewsConfigPath = resolve(cwd(), "chatty-webviews.json");
    if (!existsSync(chattyWebViewsConfigPath)) {
        throw new Error("`chatty-webviews.json` not found in current directory. Have you invoked `init`?");
    }

    const chattyWebViewsConfigContent = await readFile(chattyWebViewsConfigPath, 'utf-8');
    return JSON.parse(chattyWebViewsConfigContent) as ChattyWebViewsConfig;
}

export async function storeChattyWebViewsConfig(config: ChattyWebViewsConfig) {
    const configPath = resolve(cwd(), 'chatty-webviews.json');
    await writeFile(configPath, JSON.stringify(config, null, 2), { encoding: 'utf-8' });
}

export function collectModulesForRelease(chattyWebViewsConfig: ChattyWebViewsConfig, explicitModuleNames: string[] | undefined | null) {
    const allModules: Array<{ moduleName: string, modulePath: ModuleDirectoryPath }> = [];

    for (const moduleName in chattyWebViewsConfig.modules) {
        const modulePath = chattyWebViewsConfig.modules[moduleName];

        allModules.push({
            moduleName: moduleName,
            modulePath: modulePath
        });
    }

    if (explicitModuleNames && explicitModuleNames.length > 0) {
        return allModules.filter(m => explicitModuleNames.includes(m.moduleName))
    }

    return allModules;
}