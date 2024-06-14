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

  /**
   * Finds subscriptions that are due in the next seven days.
   *
   * @return {Promise<Partial<Subscription>[] | any>} A promise that resolves to an array of partial subscription objects that are due in the next seven days, or any other type if the query fails.
   */
  async findDueInNextSevenDays(): Promise<Partial<Subscription>[] | any> {
    const currentDate = new Date();
    let sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(currentDate.getDate() + 7);

    return this.getSubscriptionsWithRelations(currentDate, sevenDaysFromNow);
  }

  /**
   * Make a payment for a subscription.
   *
   * @param {string} subscriptionId - The ID of the subscription for which the payment is made.
   * @param {number} paymentAmount - The amount of the payment to be made.
   * @return {Promise<Invoice>} The newly created invoice after the payment is made.
   */
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

  /**
   * Retrieves subscriptions with related entities, optionally filtered by a date range.
   *
   * @param {Date} [startDate] - The start date of the date range.
   * @param {Date} [endDate] - The end date of the date range.
   * @return {Promise<Partial<Subscription>[] | any>} A promise that resolves to an array of partial subscription objects with related entities, or any other type if the query fails.
   */
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

  /**
   * Calculates the total cost of a subscription, including any add-on services.
   *
   * @param {Subscription} subscription - The subscription object to calculate the total cost for.
   * @return {number} The total cost of the subscription, including any add-on services.
   */
  private calculateTotalCost(subscription: Subscription): number {
    const totalAmount = subscription?.totalAmount || 0;
    const addOnTotal = subscription.addOnServices?.reduce((sum, service) => sum + service.monthlyAmount, 0) || 0;
    return Number(totalAmount) + Number(addOnTotal);
  }
}
