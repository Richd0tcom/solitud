import { Controller, Get, Param, Post, Body, ValidationPipe } from '@nestjs/common';
import { AppService } from './app.service';
import { SandBox } from './common/sandbox/ivm';
import { ConfigDto } from './common/types/config.dto';
import { request } from 'http';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('config')
  async saveConfig(configDto: ConfigDto) {
    return this.appService.saveConfig(configDto)
  }


  @Post('api/:name')
  async run(@Body() request: Record<string, any>, @Param('name') name: string) {
    const sb = new SandBox(128)

    const str = `function isEven(a, b) {
    if ((a + b) % 2 == 0) {
      return {isValid: true, message: "email is valid"}
    }

    return {isValid: false, message: "email is not valid"}
    
  }`
    const script = await sb.compileUserScript(str)
    const f = await sb.runScript(script)

    const evalS = `isEven(1,2)`
    const res = await sb.evaluateScript(evalS)
    console.log(res.copy())
    const result = await res.copy()

    sb.cleanup()
    return result
  }

}
