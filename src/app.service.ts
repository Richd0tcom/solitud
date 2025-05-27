import { Injectable, NotFoundException } from '@nestjs/common';
import { SandBox } from './common/sandbox/ivm';
import { ConfigDto } from './common/types/config.dto';

@Injectable()
export class AppService {
  private readonly configMap = new Map<string, ConfigDto>();

 
  getHello(): string {
    return 'Hello World!';
  }

  async saveConfig(data: ConfigDto): Promise<string> {

    data.customValidation = data.customValidation.trim();

    const sb = new SandBox(128);
    try {
      sb.validateUserScript(data.customValidation)
      await sb.compileUserScript(data.customValidation)
    } catch (error) {
      throw new ScriptValidationError(`Script validation failed: ${error.message}`);
    } finally {
      sb.cleanup();
    }
    
    
    this.configMap.set(data.name, data);

    return `Config for ${data.name} saved successfully!`;
  }

  async runConfig(body: Record<string, any>, name: string): Promise<any> {
    const { request } = body;
    const config = this.configMap.get(name);

    if (!config) {
      throw new NotFoundException(`Config with name ${name} not found`);
    }

    const sb = new SandBox(128);
    try {
      sb.validateUserScript(config.customValidation);
      const script = await sb.compileUserScript(config.customValidation);
      await sb.runScript(script);

      const result = await sb.evaluateScript(`(${config.customValidation})(${JSON.stringify(request)})`);
    } catch (error) {
      throw new Error(`Error running config: ${error.message}`);
    } finally {
      sb.cleanup();
    }
  }
}
