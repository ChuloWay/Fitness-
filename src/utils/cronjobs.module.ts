import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { Invoice } from 'src/invoice/entities/invoice.entity';
import { CronService } from './cronService';
import { Subscription } from 'src/subscription/entities/subscription.entity';
import { SubscriptionModule } from 'src/subscription/subscription.module';
import { InvoiceModule } from 'src/invoice/invoice.module';
import { MailService } from './mailService';

@Module({
  imports: [TypeOrmModule.forFeature([Subscription, Invoice]), SubscriptionModule, InvoiceModule],
  providers: [CronService, MailService],
  exports: [CronService],
})
export class CronModule {}
