import { Args, Command, Flags, ux } from '@oclif/core'
import { CreateReleaseProps, ModuleReleaseProps } from "../../services/types/props.js";
import { ChattyWebViewsConfig, Email, ModuleDirectoryPath } from "../../services/types/config.js";
import { loginWithPrompt } from '../../services/auth.js';
import inquirer from 'inquirer';
import { collectModulesForRelease, getChattyWebViewsConfigOrThrow } from '../../services/config.js';
import { ReleaseService } from '../../services/release.js';
import { db, storage } from '../../services/init/firebase-initializer.js';

const ReleaseConfig = "Release configuration:";

const ReleaseConfigHeader = () => {
    ux.log('\n');
    ux.styledHeader(ReleaseConfig);
};

export default class Release extends Command {
    static description = 'Relase a new version of an application'

    static examples = [
        `$ chatty release --version 12.1 --release-name 'test release' --module-name moduleA --module-path ./moduleA --target-users example1@mail.com example2@mail.com`,
        `$ chatty release --version 12.1 --release-name 'test release' --module-name moduleA --module-path ./moduleA --target-all`,
        `$ chatty release --version 12.1 --release-name 'test release' --module-name moduleA --module-path ./moduleA`,
        `$ chatty release --app <app-id> --version 12.1 --release-name 'test release' --module-name moduleA --module-path ./moduleA`,
    ];

    static flags = {};

    static args = {};

    releaseService = new ReleaseService();

    async run(): Promise<void> {
        await this.parse(Release);
        const chattyWebViewsConfig = await getChattyWebViewsConfigOrThrow();

        await loginWithPrompt();

        const createReleaseProps: CreateReleaseProps = await this.createReleaseProps(chattyWebViewsConfig);
        await this.releaseService.createRelease(createReleaseProps)
    }

    private async createReleaseProps(chattyWebViewsConfig: ChattyWebViewsConfig): Promise<CreateReleaseProps> {
        const appId = chattyWebViewsConfig.appId;

        ReleaseConfigHeader();

        const version = await this.askForVersion();
        const name = await this.askForReleaseName();
        const explicitModules = await this.askForExplicitModules();

        const modules = collectModulesForRelease(chattyWebViewsConfig, explicitModules);
        return {
            appId: appId,
            version: version,
            name: name,
            modules: modules,
        }
    }

    protected async askForVersion(): Promise<string> {
        const answers = await inquirer.prompt([
            {
                name: 'version',
                message: 'Enter release version',
                type: 'input'
            }
        ])

        return answers.version;
    }

    protected async askForReleaseName(): Promise<string> {
        const answers = await inquirer.prompt([
            {
                name: 'name',
                message: 'Enter release name',
                type: 'input'
            }
        ])

        return answers.name;
    }

    protected async askForExplicitModules(): Promise<string[] | undefined> {
        const hasExplicitModulesAnswers = await inquirer.prompt([
            {
                name: 'hasExplicitModules',
                message: 'Do you want to release only some modules?',
                type: 'confirm',
                default: false
            }
        ]);

        if (!hasExplicitModulesAnswers.hasExplicitModules) {
            return undefined;
        }

        const config = await getChattyWebViewsConfigOrThrow();

        if (!config.modules) {
            throw new Error('There are no app modules defined in `chattyWebViews.json`. Have you called the `init` command and specified the modules?');
        }

        const modulesAnswers = await inquirer.prompt([{
            name: 'modules',
            message: 'Select app modules: ',
            type: 'checkbox',
            loop: true,
            choices: Object.keys(config.modules)
        }]);

        return modulesAnswers.modules;
    }
}