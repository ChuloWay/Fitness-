import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';

import { Member } from './entities/member.entity';
import { MembersService } from './member.service';
import { CreateMemberDto } from './dto/create-member.dto';

@Controller('members')
export class MembersController {
  membersRepository: any;
  constructor(private readonly membersService: MembersService) {}

  @Get()
  findAll(): Promise<Member[]> {
    return this.membersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Member> {
    return this.membersService.findOne(id);
  }
  @Post()
  async create(@Body() createMemberDto: CreateMemberDto): Promise<Member> {
    return this.membersService.create(createMemberDto);
  }
}
