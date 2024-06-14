import { Module } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Invoice } from './entities/invoice.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Invoice])],
  controllers: [],
  providers: [InvoiceService],
})
export class InvoiceModule {}
