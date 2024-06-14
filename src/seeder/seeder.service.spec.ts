import { Test, TestingModule } from '@nestjs/testing';
import { SeederService } from './seeder.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Member } from 'src/member/entities/member.entity';
import { Subscription } from 'src/subscription/entities/subscription.entity';
import { AddOnService } from 'src/add-on-service/entities/add-on-service.entity';
import { Invoice } from 'src/invoice/entities/invoice.entity';

describe('SeederService', () => {
  let service: SeederService;
  let memberRepository: Repository<Member>;
  let subscriptionRepository: Repository<Subscription>;
  let addOnServiceRepository: Repository<AddOnService>;
  let invoiceRepository: Repository<Invoice>;

  const mockMemberRepository = {
    save: jest.fn(),
    query: jest.fn(),
  };

  const mockSubscriptionRepository = {
    save: jest.fn(),
    query: jest.fn(),
  };

  const mockAddOnServiceRepository = {
    save: jest.fn(),
    query: jest.fn(),
  };

  const mockInvoiceRepository = {
    save: jest.fn(),
    query: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SeederService,
        {
          provide: getRepositoryToken(Member),
          useValue: mockMemberRepository,
        },
        {
          provide: getRepositoryToken(Subscription),
          useValue: mockSubscriptionRepository,
        },
        {
          provide: getRepositoryToken(AddOnService),
          useValue: mockAddOnServiceRepository,
        },
        {
          provide: getRepositoryToken(Invoice),
          useValue: mockInvoiceRepository,
        },
      ],
    }).compile();

    service = module.get<SeederService>(SeederService);
    memberRepository = module.get<Repository<Member>>(getRepositoryToken(Member));
    subscriptionRepository = module.get<Repository<Subscription>>(getRepositoryToken(Subscription));
    addOnServiceRepository = module.get<Repository<AddOnService>>(getRepositoryToken(AddOnService));
    invoiceRepository = module.get<Repository<Invoice>>(getRepositoryToken(Invoice));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('seed', () => {
    it('should clear the database', async () => {
      await service.clearDatabase();
      expect(subscriptionRepository.query).toHaveBeenCalledWith('TRUNCATE TABLE "subscription" CASCADE;');
      expect(memberRepository.query).toHaveBeenCalledWith('TRUNCATE TABLE "member" CASCADE;');
      expect(addOnServiceRepository.query).toHaveBeenCalledWith('TRUNCATE TABLE "add_on_service" CASCADE;');
      expect(invoiceRepository.query).toHaveBeenCalledWith('TRUNCATE TABLE invoice CASCADE;');
    });

    it('should seed the database with members, subscriptions, invoices, and add-on services', async () => {
      const mockMembers = [
        { firstName: 'Chinedu', lastName: 'Okafor', email: 'user1@yopmail.com' },
        { firstName: 'Aisha', lastName: 'Abubakar', email: 'user2@yopmail.com' },
        { firstName: 'Femi', lastName: 'Adeyemi', email: 'user3@yopmail.com' },
        { firstName: 'Nneka', lastName: 'Nwosu', email: 'user4@yopmail.com' },
        { firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com' },
        { firstName: 'Jane', lastName: 'Smith', email: 'jane.smith@example.com' },
      ];

      const savedMembers = mockMembers.map((member, index) => ({
        id: `${index + 1}`,
        ...member,
      }));

      mockMemberRepository.save.mockResolvedValue(savedMembers);

      const mockSubscriptions = savedMembers.map((member, index) => ({
        id: `${index + 1}`,
        member,
        type: index % 2 === 0 ? 'ANNUAL_BASIC' : 'MONTHLY_PREMIUM',
        startDate: new Date('2024-01-01'),
        dueDate: new Date('2025-01-01'),
        totalAmount: index % 2 === 0 ? 500 : 50,
        isFirstMonth: true,
      }));

      mockSubscriptionRepository.save.mockResolvedValue(mockSubscriptions);

      await service.seed();

      expect(memberRepository.save).toHaveBeenCalledWith(mockMembers);
      expect(subscriptionRepository.save).toHaveBeenCalled();

      expect(invoiceRepository.save).toHaveBeenCalled();
      expect(addOnServiceRepository.save).toHaveBeenCalled();
    });
  });
});
