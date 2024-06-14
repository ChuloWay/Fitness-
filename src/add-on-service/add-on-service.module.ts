import { Module } from '@nestjs/common';
import { AddOnService } from './entities/add-on-service.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([AddOnService])],
  controllers: [],
  providers: [],
})
export class AddOnServiceModule {}
