import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BoltModule } from './bolt/bolt.module';
import { UberModule } from './uber/uber.module';
import { RidesController } from './rides.controller';
import { HttpModule } from '@nestjs/axios';
import { BoltService } from './bolt/bolt.service';
import { BoltDeeplinkService } from './bolt/bolt-deeplink.service';
import { RequestLoggerService } from './utils/request-logger.service';

@Module({
  imports: [
    BoltModule, 
    UberModule, 
    HttpModule
  ],
  controllers: [
    AppController, 
    RidesController
  ],
  providers: [
    AppService, 
    BoltService, 
    BoltDeeplinkService,
    RequestLoggerService
  ],
})
export class AppModule {}