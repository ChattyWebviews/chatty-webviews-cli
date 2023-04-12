import { Command, ux } from '@oclif/core'
import inquirer from 'inquirer';
import { loginOrRegisterWithPrompt } from '../../services/auth.js';
import { ChattyWebViewsAppConfig, ChattyWebViewsAppModules, ChattyWebViewsAppModulesConfig, ChattyWebViewsConfig, Email, ModuleDirectoryPath } from '../../services/types/config.js';
import { storeChattyWebViewsConfig } from '../../services/config.js';

const AppConfigHeader = () => {
    ux.log('\n');
    ux.styledHeader("Application configuration:");
};

const AppModulesConfigHeader = () => {
    ux.log('\n');
    ux.styledHeader("Application modules configuration:")
};

const ConfirmConfigHeader = () => {
    ux.log('\n');
    ux.styledHeader("Confirm configuration:");
}

export default class Init extends Command {
    static description = 'Initialize the configurations for a ChattyWebViews application'

    static examples = [
        `$ chatty init`,
    ]

    static flags = {}

    static args = {}

    async run(): Promise<void> {
        const { args, flags } = await this.parse(Init);

        const userCredentials = await loginOrRegisterWithPrompt();

        if (!userCredentials) {
            this.error('Couldn\'t log in. Please, try again.');
        }

        const appConfig = await this.askForAppConfig();
        const appModulesConfig = await this.askForAppModulesConfig();

        const config: ChattyWebViewsConfig = {
            appId: appConfig.appId,
            maintainers: appConfig.maintainers,
            modules: appModulesConfig.modules,
        }

        const isConfirmed = await this.confirmConfig(config);
        if (isConfirmed) {
            await storeChattyWebViewsConfig(config);
        }
    }

    private async confirmConfig(config: ChattyWebViewsConfig): Promise<boolean> {
        ConfirmConfigHeader();

        let confirmMessage = `Is this config ok? \n ${JSON.stringify(config, null, 2)}`;
        const answers = await inquirer.prompt([
            {
                name: 'isConfigConfirmed',
                message: confirmMessage,
                type: 'confirm'
            }
        ]);

        return answers.isConfigConfirmed;
    }

    private async askForAppConfig(): Promise<ChattyWebViewsAppConfig> {
        AppConfigHeader();

        const answers = await inquirer.prompt([
            {
                name: 'appName',
                message: 'What\'s your application name?',
                type: 'input'
            }
        ]);

        const appName: string = answers.appName;
        const maintainers: Email[] = await this.askForMaintainers();

        return {
            appId: appName,
            maintainers: maintainers
        }
    }

    private async askForMaintainers(): Promise<Email[]> {
        const hasMaintainersAnswers = await inquirer.prompt([
            {
                name: 'hasOtherMaintainers',
                message: 'Do you have other maintainers?',
                type: 'confirm'
            }
        ]);

        const maintainers: Email[] = [];

        let loop = hasMaintainersAnswers.hasOtherMaintainers;
        while (loop) {
            const maintainerAnswers = await inquirer.prompt([
                {
                    name: 'maintainerEmail',
                    message: 'What\'s your maintainer\'s email?',
                    type: 'input'
                },
                {
                    name: 'hasOtherMaintainers',
                    message: 'Do you have other maintainers?',
                    type: 'confirm'
                }
            ]);
            maintainers.push(maintainerAnswers.maintainerEmail)
            loop = maintainerAnswers.hasOtherMaintainers;
        }

        return maintainers;
    }

    private async askForAppModulesConfig(): Promise<ChattyWebViewsAppModulesConfig> {
        const answers = await inquirer.prompt([
            {
                name: 'isAppModular',
                message: 'Is your application modular?',
                type: 'confirm'
            }
        ]);

        const modules: ChattyWebViewsAppModules = answers.isAppModular
            ? await this.askForModulesConfig()
            : await this.askForDefaultModule()

        return {
            modules: modules
        }
    }

    private async askForDefaultModule(): Promise<ChattyWebViewsAppModules> {
        const answers = await inquirer.prompt([
            {
                name: 'modulePath',
                message: 'What\'s your app path',
                type: 'input'
            }
        ]);

        const moduleName = 'default';
        const modulePath = answers.modulePath;

        const modules: ChattyWebViewsAppModules = {};
        modules[moduleName] = modulePath;
        return modules;
    }

    private async askForModulesConfig(): Promise<ChattyWebViewsAppModules> {
        AppModulesConfigHeader();

        const modules: ChattyWebViewsAppModules = {};
        let loop = true;

        while (loop) {
            const moduleAnswers = await inquirer.prompt([
                {
                    name: 'moduleName',
                    message: 'What\'s your module name?',
                    type: 'input'
                },
                {
                    name: 'modulePath',
                    message: 'What\'s your module path?',
                    type: 'input'
                },
                {
                    name: 'hasOtherModules',
                    message: 'Do you have other modules?',
                    type: 'confirm'
                }
            ]);

            const moduleName: string = moduleAnswers.moduleName;
            const modulePath: ModuleDirectoryPath = moduleAnswers.modulePath;
            modules[moduleName] = modulePath;

            loop = moduleAnswers.hasOtherModules;
        }

        return modules;
    }
}
