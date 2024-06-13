import { Module } from '@nestjs/common';
import { AddOnServiceService } from './add-on-service.service';
import { AddOnServiceController } from './add-on-service.controller';

@Module({
  controllers: [AddOnServiceController],
  providers: [AddOnServiceService],
})
export class AddOnServiceModule {}
