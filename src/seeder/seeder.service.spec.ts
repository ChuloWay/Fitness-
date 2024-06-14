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
        { firstName: 'Olusegun', lastName: 'Adebayo', email: 'user5@yopmail.com' },
        { firstName: 'Zainab', lastName: 'Yusuf', email: 'user6@yopmail.com' },
        { firstName: 'Ifeanyi', lastName: 'Eze', email: 'user7@yopmail.com' },
        { firstName: 'Hauwa', lastName: 'Mohammed', email: 'user8@yopmail.com' },
        { firstName: 'Chiamaka', lastName: 'Nwankwo', email: 'user9@yopmail.com' },
        { firstName: 'Ibrahim', lastName: 'Suleiman', email: 'user10@yopmail.com' },
        { firstName: 'Yetunde', lastName: 'Akinwale', email: 'user11@yopmail.com' },
        { firstName: 'Emeka', lastName: 'Okonkwo', email: 'user12@yopmail.com' },
        { firstName: 'Funmi', lastName: 'Ayodele', email: 'user13@yopmail.com' },
        { firstName: 'Musa', lastName: 'Danjuma', email: 'user14@yopmail.com' },
        { firstName: 'Kelechi', lastName: 'Ogu', email: 'user15@yopmail.com' },
        { firstName: 'Halima', lastName: 'Bello', email: 'user16@yopmail.com' },
        { firstName: 'Obinna', lastName: 'Nwachukwu', email: 'user17@yopmail.com' },
        { firstName: 'Adebisi', lastName: 'Alade', email: 'user18@yopmail.com' },
        { firstName: 'Adaeze', lastName: 'Eze', email: 'user19@yopmail.com' },
        { firstName: 'Sulaiman', lastName: 'Abubakar', email: 'user20@yopmail.com' },
        { firstName: 'Amaka', lastName: 'Chukwu', email: 'user21@yopmail.com' },
        { firstName: 'Chigozie', lastName: 'Umeh', email: 'user22@yopmail.com' },
        { firstName: 'Yemi', lastName: 'Adedoyin', email: 'user23@yopmail.com' },
        { firstName: 'Chinwe', lastName: 'Onwubiko', email: 'user24@yopmail.com' },
        { firstName: 'Aminu', lastName: 'Garba', email: 'user25@yopmail.com' },
        { firstName: 'Ifunanya', lastName: 'Obinna', email: 'user26@yopmail.com' },
        { firstName: 'Tunde', lastName: 'Ajayi', email: 'user27@yopmail.com' },
        { firstName: 'Ngozi', lastName: 'Anozie', email: 'user28@yopmail.com' },
        { firstName: 'Ebuka', lastName: 'Okeke', email: 'user29@yopmail.com' },
        { firstName: 'Mariam', lastName: 'Lawal', email: 'user30@yopmail.com' },
        { firstName: 'Nnamdi', lastName: 'Kalu', email: 'user31@yopmail.com' },
        { firstName: 'Rahmat', lastName: 'Suleiman', email: 'user32@yopmail.com' },
        { firstName: 'Tochukwu', lastName: 'Egbuna', email: 'user33@yopmail.com' },
        { firstName: 'Temidayo', lastName: 'Afolabi', email: 'user34@yopmail.com' },
        { firstName: 'Bolaji', lastName: 'Ogundipe', email: 'user35@yopmail.com' },
        { firstName: 'Latifat', lastName: 'Mustapha', email: 'user36@yopmail.com' },
        { firstName: 'Chukwuma', lastName: 'Obinna', email: 'user37@yopmail.com' },
        { firstName: 'Kudirat', lastName: 'Olamide', email: 'user38@yopmail.com' },
        { firstName: 'Ekene', lastName: 'Anyanwu', email: 'user39@yopmail.com' },
        { firstName: 'Modupe', lastName: 'Adebayo', email: 'user40@yopmail.com' },
      ] as Partial<Member>[];

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
