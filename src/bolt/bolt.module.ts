import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { BoltController } from './bolt.controller';
import { BoltService } from './bolt.service';
import { BoltDeeplinkService } from './bolt-deeplink.service';

@Module({
  imports: [HttpModule],
  controllers: [BoltController],
  providers: [BoltService, BoltDeeplinkService],
})
export class BoltModule {}