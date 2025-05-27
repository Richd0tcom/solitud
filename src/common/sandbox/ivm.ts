import IsolatedVM, { type Reference, Isolate } from "isolated-vm";
import { ScriptValidationError } from "../errors/errors";

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

    async evaluateScript(call: string) {
        const result = await this.context.eval(call, {
            reference: true
        })
        return result
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