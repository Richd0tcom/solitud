import { Module } from '@nestjs/common';
import { JailService } from './jail.service';
import { JailController } from './jail.controller';

@Module({
  controllers: [JailController],
  providers: [JailService],
})
export class JailModule {}
