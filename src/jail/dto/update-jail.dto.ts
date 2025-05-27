import { PartialType } from '@nestjs/mapped-types';
import { CreateJailDto } from './create-jail.dto';

export class UpdateJailDto extends PartialType(CreateJailDto) {}
