import { Command } from '@oclif/core'
import { loginWithPrompt, signInWithGoogle } from '../../services/auth.js';


export default class Login extends Command {
    static description = 'Login'

    static examples = [
        `$ chatty login`,
    ]

    static flags = {}

    static args = {}

    async run(): Promise<void> {
        const { args, flags } = await this.parse(Login);
        // const userDetails = await signInWithGoogle();
        // console.log("email: " + userDetails.user.email);
        await loginWithPrompt();
    }
}
