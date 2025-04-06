import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { BoltController } from './bolt.controller';
import { BoltService } from './bolt.service';

@Module({
  imports: [HttpModule],
  controllers: [BoltController],
  providers: [BoltService]
})
export class BoltModule {}