import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { BoltController } from './bolt.controller';
import { BoltService } from './bolt.service';
import { BoltDeeplinkService } from './bolt-deeplink.service';
import { RequestLoggerService } from '../utils/request-logger.service';

@Module({
  imports: [HttpModule],
  controllers: [BoltController],
  providers: [BoltService, BoltDeeplinkService, RequestLoggerService],
})
export class BoltModule {}