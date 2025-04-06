import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BoltModule } from './bolt/bolt.module';
import { UberModule } from './uber/uber.module';

@Module({
  imports: [BoltModule, UberModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
