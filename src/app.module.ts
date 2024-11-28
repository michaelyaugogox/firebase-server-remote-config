import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RemoteConfigService } from './remote-config.service';
import { ConfigModule } from '@nestjs/config';
import config from './config';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true, load: [config] })],
  controllers: [AppController],
  providers: [AppService, RemoteConfigService],
})
export class AppModule {}
