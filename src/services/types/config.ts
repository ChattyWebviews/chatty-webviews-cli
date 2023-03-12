export type Email = string;
export type ModuleDirectoryPath = string;

export type ChattyWebViewsConfig = ChattyWebViewsAppConfig & ChattyWebViewsAppModulesConfig;

export type ChattyWebViewsAppConfig = {
    appId: string;
    maintainers: Email[];
}

export type ChattyWebViewsAppModulesConfig = {
    modules?: ChattyWebViewsAppModules
}

export type ChattyWebViewsAppModules = { [key: string]: ModuleDirectoryPath };