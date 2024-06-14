import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Subscription } from './entities/subscription.entity';
import { Invoice } from 'src/invoice/entities/invoice.entity';

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectRepository(Subscription)
    private subscriptionRepository: Repository<Subscription>,
    @InjectRepository(Invoice)
    private invoiceRepository: Repository<Invoice>,
  ) {}

  async findAllWithRelations(): Promise<Partial<Subscription>[] | any> {
    return this.getSubscriptionsWithRelations();
  }

  async findDueInNextSevenDays(): Promise<Partial<Subscription>[] | any> {
    const currentDate = new Date();
    let sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(currentDate.getDate() + 7);

    return this.getSubscriptionsWithRelations(currentDate, sevenDaysFromNow);
  }

  async makeSubscriptionPayment(subscriptionId: string, paymentAmount: number): Promise<Invoice> {
    const subscription = await this.subscriptionRepository
      .createQueryBuilder('subscription')
      .leftJoinAndSelect('subscription.member', 'member')
      .leftJoinAndSelect('subscription.addOnServices', 'addOnService')
      .where('subscription.id = :subscriptionId', { subscriptionId })
      .getOne();

    if (!subscription) {
      throw new Error('Subscription not found');
    }

    subscription.totalAmount -= paymentAmount;
    await this.subscriptionRepository.save(subscription);

    const invoice = new Invoice();
    invoice.amount = paymentAmount;
    invoice.invoiceDate = new Date();
    invoice.link = `https://example.com/invoices/${subscriptionId}-${Date.now()}`;
    invoice.subscription = subscription;

    return await this.invoiceRepository.save(invoice);
  }

  private async getSubscriptionsWithRelations(startDate?: Date, endDate?: Date): Promise<Partial<Subscription>[] | any> {
    const queryBuilder = this.subscriptionRepository
      .createQueryBuilder('subscription')
      .leftJoinAndSelect('subscription.member', 'member')
      .leftJoinAndSelect('subscription.addOnServices', 'addOnService')
      .leftJoinAndSelect('subscription.invoices', 'invoice');

    if (startDate && endDate) {
      queryBuilder.where('subscription.dueDate BETWEEN :startDate AND :endDate', { startDate, endDate });
    }

    const subscriptions = await queryBuilder.getMany();

    subscriptions.forEach((subscription) => {
      subscription.totalCost = this.calculateTotalCost(subscription);
    });

    return subscriptions;
  }

  private calculateTotalCost(subscription: Subscription): number {
    const totalAmount = subscription?.totalAmount || 0;
    const addOnTotal = subscription.addOnServices?.reduce((sum, service) => sum + service.monthlyAmount, 0) || 0;
    return Number(totalAmount) + Number(addOnTotal);
  }
}
