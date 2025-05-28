import IsolatedVM, { type Reference, Isolate } from "isolated-vm";
import { ScriptValidationError } from "../errors/errors";
import { ValidationResult } from "../types/config.dto";

export class SandBox {
    private readonly isolate: IsolatedVM.Isolate;
    private readonly context: IsolatedVM.Context;
    private readonly box: Reference<any>;

    constructor(memoryLimit: number) {
        this.isolate = new Isolate({ memoryLimit })
        console.log("isooooooo", this.isolate)
        this.context = this.isolate.createContextSync()
        this.box = this.context.global
    }

    async compileUserScript(userScript: string): Promise<IsolatedVM.Script> {
        return this.isolate.compileScript(userScript)
    }

    async runScript(script: IsolatedVM.Script) {
        return script.run(this.context, {
            timeout: 5000,
        })
    }

       private validateReturnStructure(result: unknown): ValidationResult {
        if (!result || typeof result !== 'object') {
            throw new Error('Function must return an object');
        }

        const ret = result as Record<string, unknown>;

        if (!('isValid' in ret) || typeof ret.isValid !== 'boolean') {
            throw new Error('Return object must contain "isValid" field of type boolean');
        }

        if (!('message' in ret) || typeof ret.message !== 'string') {
            throw new Error('Return object must contain "message" field of type string');
        }

        return ret as unknown as ValidationResult;
    }

    async evaluateScript(call: string) {
        const result = await this.context.eval(call, {
            reference: true
        })
        const value = await result.copy();
        return this.validateReturnStructure(value);
    }

    validateUserScript(script: string): boolean {
        // Check for dangerous patterns
        const dangerousPatterns = [
            /process/g,
            /require\(/g,
            /global/g,
            /eval/g,
            /Function/g,
            /__proto__/g,
            /constructor/g
        ];

        for (const pattern of dangerousPatterns) {
            if (pattern.test(script)) {
                throw new ScriptValidationError(`Forbidden pattern detected: ${pattern}`);
            }
        }
        return true;
    }

    cleanup() {
        this.context.release()
        this.isolate.dispose()
    }
}