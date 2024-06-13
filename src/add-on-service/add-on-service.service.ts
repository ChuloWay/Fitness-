import { Injectable } from '@nestjs/common';
import { CreateAddOnServiceDto } from './dto/create-add-on-service.dto';
import { UpdateAddOnServiceDto } from './dto/update-add-on-service.dto';

@Injectable()
export class AddOnServiceService {
  create(createAddOnServiceDto: CreateAddOnServiceDto) {
    return 'This action adds a new addOnService';
  }

  findAll() {
    return `This action returns all addOnService`;
  }

  findOne(id: number) {
    return `This action returns a #${id} addOnService`;
  }

  update(id: number, updateAddOnServiceDto: UpdateAddOnServiceDto) {
    return `This action updates a #${id} addOnService`;
  }

  remove(id: number) {
    return `This action removes a #${id} addOnService`;
  }
}
