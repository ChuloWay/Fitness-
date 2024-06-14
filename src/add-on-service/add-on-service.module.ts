import { Module } from '@nestjs/common';
import { AddOnServiceService } from './add-on-service.service';
import { AddOnServiceController } from './add-on-service.controller';
import { AddOnService } from './entities/add-on-service.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([AddOnService])],
  controllers: [AddOnServiceController],
  providers: [AddOnServiceService],
})
export class AddOnServiceModule {}
