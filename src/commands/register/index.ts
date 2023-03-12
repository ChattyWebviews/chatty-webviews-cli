import { Command } from '@oclif/core'
import { registerWithPrompt } from '../../services/auth.js';


export default class Register extends Command {
    static description = 'Register'

    static examples = [
        `$ chatty register`,
    ]

    static flags = {}

    static args = {}

    async run(): Promise<void> {
        const { args, flags } = await this.parse(Register);
        
        await registerWithPrompt();
    }
}
