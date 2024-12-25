import { Test, TestingModule } from '@nestjs/testing';

import { getRepositoryToken } from '@nestjs/typeorm';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { CustomerService } from '../customer.service';
import { Customer } from '../customer.entity';
import { Repository } from 'typeorm';
import CreateCustomerDto from '../dto/create-customer.dto';
import { CUSTOMER_ERROR_MESSAGES } from '../enum/customer-messages.enum';

describe('CustomerService', () => {
  let service: CustomerService;
  let repository: Repository<Customer>;

  const mockCustomerRepository = {
    findOne: jest.fn(),
    find: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomerService,
        {
          provide: getRepositoryToken(Customer),
          useValue: mockCustomerRepository,
        },
      ],
    }).compile();

    service = module.get<CustomerService>(CustomerService);
    repository = module.get<Repository<Customer>>(getRepositoryToken(Customer));
  });

  describe('createCustomer', () => {
    it('should create a new customer successfully', async () => {
      const createCustomerDto: CreateCustomerDto = {  
        name: "Abdullah",
        email: "aabdelgil4@gmail.com" 
      };
      const savedCustomer = { id: '1', ...createCustomerDto };

      mockCustomerRepository.findOne.mockResolvedValue(null); // No existing customer
      mockCustomerRepository.create.mockReturnValue(savedCustomer);
      mockCustomerRepository.save.mockResolvedValue(savedCustomer);

      const result = await service.createCustomer(createCustomerDto);
      expect(result).toEqual({
        id: "1",
        name: "Abdullah",
        email: "aabdelgil4@gmail.com"
      });
      expect(mockCustomerRepository.findOne).toHaveBeenCalledWith({ where: { email: "aabdelgil4@gmail.com" } });
      expect(mockCustomerRepository.save).toHaveBeenCalledWith(savedCustomer);
    });

    it('should throw ConflictException if the customer already exists', async () => {
      const createCustomerDto: CreateCustomerDto = {         
        name: "Abdullah",
        email: "aabdelgil4@gmail.com" 
      };
      const existingCustomer = { id: '1', ...createCustomerDto };

      mockCustomerRepository.findOne.mockResolvedValue(existingCustomer); // Customer exists

      await expect(service.createCustomer(createCustomerDto)).rejects.toThrowError(new ConflictException(CUSTOMER_ERROR_MESSAGES.CUSTOMER_INVALID));
    });
  });

  describe('getById', () => {
    it('should return a customer if found', async () => {
      const customer ={
        id: "1",
        name: "Abdullah",
        email: "aabdelgil4@gmail.com"
      };
      mockCustomerRepository.findOne.mockResolvedValue(customer);

      const result = await service.getById('1');
      expect(result).toEqual(customer);
      expect(mockCustomerRepository.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
    });

    it('should throw NotFoundException if customer not found', async () => {
      mockCustomerRepository.findOne.mockResolvedValue(null);

      // Fix the mismatch here to use the correct enum key
      await expect(service.getById('1')).rejects.toThrowError(new NotFoundException(CUSTOMER_ERROR_MESSAGES.CUSTOMER_NOTFOUND));
    });
  });

  describe('getCustomers', () => {
    it('should return an array of customers', async () => {
      const customers = [
        { id: "1", name: "Abdullah", email: "aabdelgil4@gmail.com" },
        { id: "2", name: "Abdullah", email: "aabdelgil4@gmail.com" },
      ];
      mockCustomerRepository.find.mockResolvedValue(customers);

      const result = await service.getCustomers();
      expect(result).toEqual(customers);
      expect(mockCustomerRepository.find).toHaveBeenCalled();
    });
  });

  describe('getCustomersMapped', () => {
    it('should return an array of mapped customer DTOs', async () => {
      const customers = [
        { id: "1", name: "Abdullah", email: "aabdelgil4@gmail.com" },
        { id: "2", name: "Abdullah", email: "aabdelgil4@gmail.com" },
      ];
      const customerDtos = customers.map(customer => ({ id: customer.id, name: customer.name, email: customer.email }));

      mockCustomerRepository.find.mockResolvedValue(customers);

      const result = await service.getCustomersMapped();
      expect(result).toEqual(customerDtos);
    });
  });
});
