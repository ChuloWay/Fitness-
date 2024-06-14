import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Member } from './entities/member.entity';
import { MembersService } from './member.service';
import { MailService } from 'src/utils/mailService';

describe('MembersService', () => {
  let service: MembersService;
  let membersRepository: Repository<Member>;
  let mailService: MailService;

  const mockMembersRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockMailService = {
    sendWelcomeEmail: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MembersService,
        {
          provide: getRepositoryToken(Member),
          useValue: mockMembersRepository,
        },
        {
          provide: MailService,
          useValue: mockMailService,
        },
      ],
    }).compile();

    service = module.get<MembersService>(MembersService);
    membersRepository = module.get<Repository<Member>>(getRepositoryToken(Member));
    mailService = module.get<MailService>(MailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of members', async () => {
      const mockMembers = [
        { id: '1', firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com' },
        { id: '2', firstName: 'Jane', lastName: 'Doe', email: 'jane.doe@example.com' },
      ];
      mockMembersRepository.find.mockResolvedValue(mockMembers);

      const result = await service.findAll();
      expect(result).toEqual(mockMembers);
      expect(membersRepository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single member', async () => {
      const mockMember = { id: '1', firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com' };
      mockMembersRepository.findOne.mockResolvedValue(mockMember);

      const result = await service.findOne('1');
      expect(result).toEqual(mockMember);
      expect(membersRepository.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
    });

    it('should return null if member is not found', async () => {
      mockMembersRepository.findOne.mockResolvedValue(null);

      const result = await service.findOne('2');
      expect(result).toBeNull();
      expect(membersRepository.findOne).toHaveBeenCalledWith({ where: { id: '2' } });
    });
  });

  describe('create', () => {
    it('should create a new member and send a welcome email', async () => {
      const newMember = { firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com' };
      const savedMember = { id: '1', ...newMember };

      mockMembersRepository.create.mockReturnValue(newMember);
      mockMembersRepository.save.mockResolvedValue(savedMember);

      const result = await service.create(newMember);

      expect(result).toEqual(savedMember);
      expect(membersRepository.create).toHaveBeenCalledWith(newMember);
      expect(membersRepository.save).toHaveBeenCalledWith(newMember);

      expect(mailService.sendWelcomeEmail).toHaveBeenCalledWith(newMember.email, newMember.firstName, newMember.lastName);
    });
  });
});
