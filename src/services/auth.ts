import { auth } from "./init/firebase-initializer.js";
import { ux } from "@oclif/core";
import { signInWithBrowser } from "@vmutafov/firebase-auth-node-browser";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, UserCredential, onAuthStateChanged, User, GoogleAuthProvider, FacebookAuthProvider } from "firebase/auth";
import inquirer from "inquirer";

const AuthHeader = () => ux.styledHeader("Authenticate:");

export async function signInWithGoogle(): Promise<UserCredential> {
    const userCredential: UserCredential = await signInWithBrowser(auth, [new GoogleAuthProvider(), new FacebookAuthProvider()]);
    return userCredential;
}

export async function login(email: string, password: string): Promise<UserCredential> {
    return await signInWithEmailAndPassword(auth, email, password);
}

export async function register(email: string, password: string): Promise<UserCredential> {
    return await createUserWithEmailAndPassword(auth, email, password);
}

export async function getUser(): Promise<User> {
    return new Promise<User>((resolve, reject) => {
        onAuthStateChanged(auth, user => {
            if (user) {
                resolve(user);
            }
        }, err => {
            reject(err);
        })
    });

}

export async function loginOrRegisterWithPrompt(): Promise<UserCredential | null> {
    AuthHeader();

    const isRegisteredAnswers = await inquirer.prompt([
        {
            name: 'isRegistered',
            message: 'Are you already registered?',
            type: 'confirm'
        }
    ]);

    if (isRegisteredAnswers.isRegistered) {
        return await loginWithPrompt(true)
    }

    return await registerWithPrompt(true);
}

export async function loginWithPrompt(skipPromptHeader = false): Promise<UserCredential | null> {
    if (!skipPromptHeader) {
        AuthHeader();
    }

    const loginAnswers = await inquirer.prompt([
        {
            name: 'email',
            message: 'Enter your email:',
            type: 'input'
        },
        {
            name: 'password',
            message: 'Enter your password:',
            type: 'password'
        }
    ]);

    return await login(loginAnswers.email, loginAnswers.password);
}

export async function registerWithPrompt(skipPromptHeader = false): Promise<UserCredential | null> {
    if (!skipPromptHeader) {
        AuthHeader();
    }

    const registerAnswers = await inquirer.prompt([
        {
            name: 'email',
            message: 'Enter your email:',
            type: 'input'
        },
        {
            name: 'password',
            message: 'Enter your password:',
            type: 'password'
        },
        {
            name: 'confirmPassword',
            message: 'Confirm your password:',
            type: 'password'
        }
    ]);

    const email = registerAnswers.email;
    const password = registerAnswers.password;
    const confirmPassword = registerAnswers.confirmPassword;

    if (password !== confirmPassword) {
        ux.error('Passwords do not match. Please, try again.')
    }

    return await register(email, password);
}

