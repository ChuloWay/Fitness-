// seeder.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeederService } from './seeder.service';
import { Member } from '../member/entities/member.entity';
import { Subscription } from '../subscription/entities/subscription.entity';
import { AddOnService } from '../add-on-service/entities/add-on-service.entity';
import { Invoice } from 'src/invoice/entities/invoice.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Member, Subscription, AddOnService, Invoice])],
  providers: [SeederService],
  exports: [SeederService],
})
export class SeederModule {}
