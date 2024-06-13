import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AddOnServiceService } from './add-on-service.service';
import { CreateAddOnServiceDto } from './dto/create-add-on-service.dto';
import { UpdateAddOnServiceDto } from './dto/update-add-on-service.dto';

@Controller('add-on-service')
export class AddOnServiceController {
  constructor(private readonly addOnServiceService: AddOnServiceService) {}

  @Post()
  create(@Body() createAddOnServiceDto: CreateAddOnServiceDto) {
    return this.addOnServiceService.create(createAddOnServiceDto);
  }

  @Get()
  findAll() {
    return this.addOnServiceService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.addOnServiceService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAddOnServiceDto: UpdateAddOnServiceDto) {
    return this.addOnServiceService.update(+id, updateAddOnServiceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.addOnServiceService.remove(+id);
  }
}
