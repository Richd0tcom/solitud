import IsolatedVM, { type Reference } from "isolated-vm";

export class SandBox {
    private readonly isolate: IsolatedVM.Isolate;
    private readonly context: IsolatedVM.Context;
    private readonly box: Reference<any>;

    constructor(memoryLimit: number) {
        this.isolate = new IsolatedVM.Isolate({memoryLimit})
        this.context = this.isolate.createContextSync()
        this.box =  this.context.global
    }

    async compileUserScript(userScript: string) {
        
    }
}