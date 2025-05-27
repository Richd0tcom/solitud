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
  async saveConfig(@Body() configDto: ConfigDto) {
    return this.appService.saveConfig(configDto)
  }


  @Post('api/:name')
  async run(@Body() request: Record<string, any>, @Param('name') name: string) {
    return this.appService.runConfig(request, name);
  }

}
