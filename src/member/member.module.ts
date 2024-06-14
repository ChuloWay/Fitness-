import { Module } from '@nestjs/common';
import { MembersService } from './member.service';
import { MembersController } from './member.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Member } from './entities/member.entity';
import { MailService } from 'src/utils/mailService';

@Module({
  imports: [TypeOrmModule.forFeature([Member])],
  controllers: [MembersController],
  providers: [MembersService, MailService],
})
export class MemberModule {}
