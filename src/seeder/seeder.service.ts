import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AddOnService } from 'src/add-on-service/entities/add-on-service.entity';
import { Invoice } from 'src/invoice/entities/invoice.entity';
import { Member } from 'src/member/entities/member.entity';
import { Subscription } from 'src/subscription/entities/subscription.entity';
import { SubscriptionType } from 'src/subscription/enums/subcription.enum';
import { Repository } from 'typeorm';

@Injectable()
export class SeederService {
  constructor(
    @InjectRepository(Member)
    private memberRepository: Repository<Member>,
    @InjectRepository(Subscription)
    private subscriptionRepository: Repository<Subscription>,
    @InjectRepository(AddOnService)
    private addOnServiceRepository: Repository<AddOnService>,
    @InjectRepository(Invoice)
    private invoiceRepository: Repository<Invoice>,
  ) {}

  async seed() {
    await this.clearDatabase();

    const members = [
      { firstName: 'Chinedu', lastName: 'Okafor', email: 'user1@yopmail.com' },
      { firstName: 'Aisha', lastName: 'Abubakar', email: 'user2@yopmail.com' },
      { firstName: 'Femi', lastName: 'Adeyemi', email: 'user3@yopmail.com' },
      { firstName: 'Nneka', lastName: 'Nwosu', email: 'user4@yopmail.com' },
      { firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com' },
      { firstName: 'Jane', lastName: 'Smith', email: 'jane.smith@example.com' },
    ];

    const savedMembers = await this.memberRepository.save(members);

    const subscriptions = [
      {
        member: savedMembers[0],
        type: SubscriptionType.ANNUAL_BASIC,
        startDate: new Date('2024-01-01'),
        dueDate: new Date('2025-01-01'),
        totalAmount: 500,
        isFirstMonth: true,
      },
      {
        member: savedMembers[1],
        type: SubscriptionType.MONTHLY_PREMIUM,
        startDate: new Date('2024-03-15'),
        dueDate: new Date('2024-04-15'),
        totalAmount: 50,
        isFirstMonth: true,
      },
      {
        member: savedMembers[2],
        type: SubscriptionType.ANNUAL_PREMIUM,
        startDate: new Date('2024-05-01'),
        dueDate: new Date('2025-05-01'),
        totalAmount: 800,
        isFirstMonth: true,
      },
      {
        member: savedMembers[3],
        type: SubscriptionType.MONTHLY_BASIC,
        startDate: new Date('2024-06-01'),
        dueDate: new Date('2024-07-01'),
        totalAmount: 30,
        isFirstMonth: false,
      },
      {
        member: savedMembers[4],
        type: SubscriptionType.ANNUAL_BASIC,
        startDate: new Date('2024-01-01'),
        dueDate: new Date('2025-01-01'),
        totalAmount: 500,
        isFirstMonth: true,
      },
      {
        member: savedMembers[5],
        type: SubscriptionType.MONTHLY_PREMIUM,
        startDate: new Date('2024-03-15'),
        dueDate: new Date('2024-04-15'),
        totalAmount: 50,
        isFirstMonth: true,
      },
    ];

    const savedSubscriptions = await this.subscriptionRepository.save(subscriptions);

    const invoices = [
      {
        serviceName: 'Annual Membership Fee',
        amount: 500,
        dueDate: new Date('2025-01-01'),
        invoiceDate: new Date(),
        subscription: savedSubscriptions[0],
      },
      {
        serviceName: 'First Month Add-On: Personal Training',
        amount: 100,
        dueDate: new Date('2024-02-01'),
        invoiceDate: new Date(),
        subscription: savedSubscriptions[0],
      },
      {
        serviceName: 'Monthly Premium Fee',
        amount: 50,
        dueDate: new Date('2024-04-15'),
        invoiceDate: new Date(),
        subscription: savedSubscriptions[1],
      },
      {
        serviceName: 'Annual Membership Fee',
        amount: 500,
        dueDate: new Date('2025-01-01'),
        invoiceDate: new Date(),
        subscription: savedSubscriptions[4],
      },
      {
        serviceName: 'First Month Add-On: Personal Training',
        amount: 100,
        dueDate: new Date('2024-02-01'),
        invoiceDate: new Date(),
        subscription: savedSubscriptions[4],
      },
      {
        serviceName: 'Monthly Premium Fee',
        amount: 50,
        dueDate: new Date('2024-04-15'),
        invoiceDate: new Date(),
        subscription: savedSubscriptions[5],
      },
    ];
    await this.invoiceRepository.save(invoices);

    const addOnServices = [
      { name: 'Personal Training', monthlyAmount: 100, subscription: savedSubscriptions[0], dueDate: new Date('2024-02-01') },
      { name: 'Towel Rental', monthlyAmount: 20, subscription: savedSubscriptions[1], dueDate: new Date('2024-04-15') },
      { name: 'Personal Training', monthlyAmount: 100, subscription: savedSubscriptions[4], dueDate: new Date('2024-02-01') },
      { name: 'Towel Rental', monthlyAmount: 20, subscription: savedSubscriptions[5], dueDate: new Date('2024-04-15') },
    ];

    await this.addOnServiceRepository.save(addOnServices);

    console.log('Database seeding completed!');
  }

  async clearDatabase() {
    await Promise.all([
      this.subscriptionRepository.query('TRUNCATE TABLE "subscription" CASCADE;'),
      this.memberRepository.query('TRUNCATE TABLE "member" CASCADE;'),
      this.addOnServiceRepository.query('TRUNCATE TABLE "add_on_service" CASCADE;'),
      this.invoiceRepository.query('TRUNCATE TABLE invoice CASCADE;'),
    ]);
  }
}
