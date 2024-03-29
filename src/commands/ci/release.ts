import { Command, Flags } from '@oclif/core'
import { CreateReleaseProps } from "../../services/types/props.js";
import { ChattyWebViewsConfig } from "../../services/types/config.js";
import { collectModulesForRelease, getChattyWebViewsConfigOrThrow } from '../../services/config.js';
import { ReleaseService } from '../../services/release.js';

export default class Release extends Command {
    static description = 'Relase a new version of a ChattyWebViews application or module from a CI/CD environment by passing all the required parameters'

    static examples = [
        `$ chatty ci release --version 12.1`,
        `$ chatty ci release --version 12.1 --name 'test release'`,
        `$ chatty ci release --version 12.1 --name 'test release' --modules moduleA moduleB`,
    ];

    static flags = {
        version: Flags.string({
            description: 'Release version.',
            required: true,
        }),
        'name': Flags.string({
            description: 'Release name. Defaults to \'\' if not provided.',
            default: '',
            required: false,
        }),
        'modules': Flags.string({
            description: 'Release only a set of modules by their names as specified in the `chatty-webviews.json` file.',
            multiple: true,
            required: false,
        }),
    };

    static args = {};

    releaseService = new ReleaseService();

    async run(): Promise<void> {
        const { args, flags } = await this.parse(Release);
        const chattyWebViewsConfig = await getChattyWebViewsConfigOrThrow();

        const createReleaseProps: CreateReleaseProps = await this.createReleaseProps(flags, chattyWebViewsConfig);
        await this.releaseService.createRelease(createReleaseProps)
    }

    private async createReleaseProps(flags: any, chattyWebViewsConfig: ChattyWebViewsConfig): Promise<CreateReleaseProps> {
        const appId = chattyWebViewsConfig.appId;
        const version = flags.version;
        const name = flags.name;
        const explicitModules = flags.modules;
        
        const modules = collectModulesForRelease(chattyWebViewsConfig, explicitModules);
        return {
            appId: appId,
            version: version,
            name: name,
            modules: modules
        }
    }

    
}