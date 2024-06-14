import { Controller, Get } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';

@Controller('subscription')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Get()
  findAll() {
    return this.subscriptionService.findAllWithRelations();
  }

  @Get('/due-in-next-seven-days')
  findAllDueInNextSevenDays() {
    return this.subscriptionService.findDueInNextSevenDays();
  }
}
