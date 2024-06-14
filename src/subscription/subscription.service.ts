import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subscription } from './entities/subscription.entity';

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectRepository(Subscription)
    private subscriptionRepository: Repository<Subscription>,
  ) {}

  async findAllWithRelations(): Promise<Partial<Subscription>[] | any> {
    const subscriptions = await this.subscriptionRepository
      .createQueryBuilder('subscription')
      .leftJoinAndSelect('subscription.member', 'member')
      .leftJoinAndSelect('subscription.addOnServices', 'addOnService')
      .leftJoinAndSelect('subscription.invoices', 'invoice')
      .getMany();

    subscriptions.forEach((subscription) => {
      let totalAmount = subscription?.totalAmount || 0;
      let addOnTotal = 0;

      if (subscription.addOnServices && subscription.addOnServices.length > 0) {
        addOnTotal = subscription.addOnServices.reduce((sum, service) => sum + service.monthlyAmount, 0);
      }

      subscription.totalCost = Number(totalAmount) + Number(addOnTotal);
    });

    return subscriptions;
  }
}
