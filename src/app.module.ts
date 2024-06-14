import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from './database/dbConfig';
import { MemberModule } from './member/member.module';
import { SubscriptionModule } from './subscription/subscription.module';
import { AddOnServiceModule } from './add-on-service/add-on-service.module';
import { InvoiceModule } from './invoice/invoice.module';
import { SeederModule } from './seeder/seeder.module';

@Module({
  imports: [TypeOrmModule.forRoot(dataSourceOptions), MemberModule, SubscriptionModule, AddOnServiceModule, InvoiceModule, SeederModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
