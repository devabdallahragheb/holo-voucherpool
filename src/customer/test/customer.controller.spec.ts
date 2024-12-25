import { Test, TestingModule } from '@nestjs/testing';
import { CustomerController } from '../customer.controller';
import { CustomerService } from '../customer.service';
import { CreateCustomerDto } from '../dto/create-customer.dto';
import { CustomerDto } from '../dto/customer.dto';
import { ThrottlerGuard } from '@nestjs/throttler';

describe('CustomerController', () => {
  let controller: CustomerController;
  let service: CustomerService;

  const mockCustomerService = {
    createCustomer: jest.fn(),
    getCustomersMapped: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CustomerController],
      providers: [
        {
          provide: CustomerService,
          useValue: mockCustomerService,
        },
      ],
    })
      .overrideGuard(ThrottlerGuard)
      .useValue({
        canActivate: jest.fn().mockReturnValue(true),
      })
      .compile();

    controller = module.get<CustomerController>(CustomerController);
    service = module.get<CustomerService>(CustomerService);
  });

  describe('createCustomer', () => {
    it('should call CustomerService.createCustomer and return the result', async () => {
      const createCustomerDto: CreateCustomerDto = {
        name: 'abdullah',
        email: 'aabdelglil4@gmail.com',
      };
      const customerDto: CustomerDto = {
        id: '1',
        name: 'abdullah',
        email: 'aabdelglil4@gmail.com',
      };

      mockCustomerService.createCustomer.mockResolvedValue(customerDto);

      const result = await controller.createCustomer(createCustomerDto);

      expect(result).toEqual(customerDto);
      expect(mockCustomerService.createCustomer).toHaveBeenCalledWith(
        createCustomerDto,
      );
    });
  });

  describe('getCustomers', () => {
    it('should call CustomerService.getCustomersMapped and return the result', async () => {
      const customers: CustomerDto[] = [
        {
          id: '1',
          name: 'abdullah',
          email: 'aabdelglil4@gmail.com',
        },
        {
          id: '2',
          name: 'abdullah ragheb',
          email: 'aabdelglil41@gmail.com',
        },
      ];

      mockCustomerService.getCustomersMapped.mockResolvedValue(customers);

      const result = await controller.getCustomers();

      expect(result).toEqual(customers);
      expect(mockCustomerService.getCustomersMapped).toHaveBeenCalled();
    });
  });
});
