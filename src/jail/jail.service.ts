import { Injectable } from '@nestjs/common';
import { CreateJailDto } from './dto/create-jail.dto';
import { UpdateJailDto } from './dto/update-jail.dto';

@Injectable()
export class JailService {
  create(createJailDto: CreateJailDto) {
    return 'This action adds a new jail';
  }

  findAll() {
    return `This action returns all jail`;
  }

  findOne(id: number) {
    return `This action returns a #${id} jail`;
  }

  update(id: number, updateJailDto: UpdateJailDto) {
    return `This action updates a #${id} jail`;
  }

  remove(id: number) {
    return `This action removes a #${id} jail`;
  }
}
