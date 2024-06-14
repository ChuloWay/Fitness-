import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Member } from './entities/member.entity';
import { CreateMemberDto } from './dto/create-member.dto';
import { MailService } from 'src/utils/mailService';

@Injectable()
export class MembersService {
  constructor(
    @InjectRepository(Member)
    private membersRepository: Repository<Member>,
    private readonly mailService: MailService,
  ) {}

  findAll(): Promise<Member[]> {
    return this.membersRepository.find();
  }

  findOne(id: string): Promise<Member> {
    return this.membersRepository.findOne({ where: { id } });
  }

  async create(createMemberDto: CreateMemberDto): Promise<Member> {
    const foundMember = await this.membersRepository.findOne({ where: { email: createMemberDto.email } });

    if (foundMember) {
      throw new Error('Member with this email already exists');
    }

    const newMember = this.membersRepository.create(createMemberDto);
    const savedMember = await this.membersRepository.save(newMember);

    await this.mailService.sendWelcomeEmail(savedMember.email, savedMember.firstName, savedMember.lastName);

    return savedMember;
  }
}
