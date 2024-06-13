import { Test, TestingModule } from '@nestjs/testing';
import { AddOnServiceController } from './add-on-service.controller';
import { AddOnServiceService } from './add-on-service.service';

describe('AddOnServiceController', () => {
  let controller: AddOnServiceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AddOnServiceController],
      providers: [AddOnServiceService],
    }).compile();

    controller = module.get<AddOnServiceController>(AddOnServiceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
