import { Test, TestingModule } from '@nestjs/testing';
import { AddOnServiceService } from './add-on-service.service';

describe('AddOnServiceService', () => {
  let service: AddOnServiceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AddOnServiceService],
    }).compile();

    service = module.get<AddOnServiceService>(AddOnServiceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
