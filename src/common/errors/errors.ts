import { BadRequestException } from "@nestjs/common";

export class ScriptValidationError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'ScriptValidationError';
    }
}

export class ScriptValidationException extends BadRequestException {
    constructor(message: string) {
        super(`Script validation failed: ${message}`);
        this.name = 'ScriptValidationException';
    }
}

export class ScriptExecutionException extends BadRequestException {
    constructor(message: string) {
        super(`Script execution failed: ${message}`);
        this.name = 'ScriptExecutionException';
    }
}

export class ValidationError extends BadRequestException {
    constructor(message: string) {
        super(`Validation error: ${message}`);
        this.name = 'ValidationError';
    }
}
