import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ProxyController } from './proxy/proxy.controller';

@Module({
  imports: [HttpModule],
  controllers: [ProxyController],
})
export class AppModule {}
