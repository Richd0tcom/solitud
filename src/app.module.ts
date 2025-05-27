import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JailModule } from './jail/jail.module';

@Module({
  imports: [JailModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
