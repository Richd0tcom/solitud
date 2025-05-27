export class ScriptValidationError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'ScriptValidationError';
    }
}

