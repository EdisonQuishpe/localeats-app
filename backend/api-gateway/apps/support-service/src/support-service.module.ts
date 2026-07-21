import { Module } from '@nestjs/common';
import { SupportServiceController } from './support-service.controller';

@Module({
  controllers: [SupportServiceController],
  providers: [],
})
export class SupportServiceModule {}