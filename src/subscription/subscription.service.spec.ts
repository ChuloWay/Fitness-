import { Test, TestingModule } from '@nestjs/testing';
import { SubscriptionService } from './subscription.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subscription } from './entities/subscription.entity';

describe('SubscriptionService', () => {
  let service: SubscriptionService;
  let repository: Repository<Subscription>;

  const mockSubscriptionRepository = {
    createQueryBuilder: jest.fn().mockReturnThis(),
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    getMany: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SubscriptionService,
        {
          provide: getRepositoryToken(Subscription),
          useValue: mockSubscriptionRepository,
        },
      ],
    }).compile();

    service = module.get<SubscriptionService>(SubscriptionService);
    repository = module.get<Repository<Subscription>>(getRepositoryToken(Subscription));
  });

  it('should fetch subscriptions with all relations', async () => {
    const mockData = [
      {
        id: '1',
        totalAmount: 500,
        member: { id: '1', firstName: 'John', lastName: 'Doe' },
        addOnServices: [{ id: '1', name: 'Personal Training', monthlyAmount: 100 }],
        invoices: [{ id: '1', amount: 500, link: null }],
        totalCost: 600,
      },
    ];

    mockSubscriptionRepository.getMany.mockResolvedValue(mockData);

    const subscriptions = await service.findAllWithRelations();
    expect(subscriptions).toBeDefined();
    expect(subscriptions.length).toBe(1);
    expect(subscriptions[0].member).toBeDefined();
    expect(subscriptions[0].addOnServices).toBeDefined();
    expect(subscriptions[0].invoices).toBeDefined();
  });

  it('should calculate totalCost for each subscription', async () => {
    const mockData = [
      {
        id: '1',
        totalAmount: 500,
        member: { id: '1', firstName: 'John', lastName: 'Doe' },
        addOnServices: [{ id: '1', name: 'Personal Training', monthlyAmount: 100 }],
        invoices: [{ id: '1', amount: 500, link: null }],
      },
    ];

    mockSubscriptionRepository.getMany.mockResolvedValue(mockData);

    const subscriptions = await service.findAllWithRelations();
    subscriptions.forEach((subscription) => {
      expect(subscription.totalCost).toBeDefined();
      expect(subscription.totalCost).toBe(600); // 500 + 100
    });
  });

  it('should handle subscriptions with no add-on services', async () => {
    const mockData = [
      {
        id: '1',
        totalAmount: 500,
        member: { id: '1', firstName: 'John', lastName: 'Doe' },
        addOnServices: [],
        invoices: [{ id: '1', amount: 500, link: null }],
      },
    ];

    mockSubscriptionRepository.getMany.mockResolvedValue(mockData);

    const subscriptions = await service.findAllWithRelations();
    subscriptions.forEach((subscription) => {
      expect(subscription.totalCost).toBeDefined();
      expect(subscription.totalCost).toBe(500); // No add-on services
    });
  });

  it('should handle subscriptions with multiple add-on services', async () => {
    const mockData = [
      {
        id: '1',
        totalAmount: 500,
        member: { id: '1', firstName: 'John', lastName: 'Doe' },
        addOnServices: [
          { id: '1', name: 'Personal Training', monthlyAmount: 100 },
          { id: '2', name: 'Nutrition Plan', monthlyAmount: 50 },
        ],
        invoices: [{ id: '1', amount: 500, link: null }],
      },
    ];

    mockSubscriptionRepository.getMany.mockResolvedValue(mockData);

    const subscriptions = await service.findAllWithRelations();
    subscriptions.forEach((subscription) => {
      expect(subscription.totalCost).toBeDefined();
      expect(subscription.totalCost).toBe(650); // 500 + 100 + 50
    });
  });
});
