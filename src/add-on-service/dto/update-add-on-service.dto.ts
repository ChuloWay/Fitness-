import { PartialType } from '@nestjs/mapped-types';
import { CreateAddOnServiceDto } from './create-add-on-service.dto';

export class UpdateAddOnServiceDto extends PartialType(CreateAddOnServiceDto) {}
