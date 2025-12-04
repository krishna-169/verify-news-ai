// Type declarations for Puter.js
interface PuterAI {
    chat(prompt: string, options?: { model?: string }): Promise<string>;
    txt2img(prompt: string): Promise<string>;
}

interface Puter {
    ai: PuterAI;
    auth: {
        isSignedIn(): boolean;
    };
}

declare global {
    interface Window {
        puter: Puter;
    }
}

declare const puter: Puter;
