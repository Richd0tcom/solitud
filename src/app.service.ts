import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  config(): string {
    return 'Config endpoint hit!';
  }
}
