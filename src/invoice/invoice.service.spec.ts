import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Invoice } from './entities/invoice.entity';
import { InvoiceService } from './invoice.service';

describe('InvoiceService', () => {
  let service: InvoiceService;
  let invoiceRepository: Repository<Invoice>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InvoiceService,
        {
          provide: getRepositoryToken(Invoice),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<InvoiceService>(InvoiceService);
    invoiceRepository = module.get<Repository<Invoice>>(getRepositoryToken(Invoice));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('updateInvoiceLink', () => {
    it('should update invoice link', async () => {
      const subscriptionId = '1';
      const invoiceLink = 'http://example.com/invoice/1';

      const updateSpy = jest.spyOn(invoiceRepository, 'update').mockResolvedValue(undefined);

      await service.updateInvoiceLink(subscriptionId, invoiceLink);

      expect(updateSpy).toHaveBeenCalledWith(subscriptionId, { link: invoiceLink });
    });

    it('should handle errors', async () => {
      const subscriptionId = '1';
      const invoiceLink = 'http://example.com/invoice/1';

      const updateSpy = jest.spyOn(invoiceRepository, 'update').mockRejectedValueOnce(new Error('Update failed'));

      await expect(service.updateInvoiceLink(subscriptionId, invoiceLink)).rejects.toThrow('Update failed');
    });
  });
});
