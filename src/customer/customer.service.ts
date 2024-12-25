import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from './customer.entity';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { CustomerDto } from './dto/customer.dto';
import { CUSTOMER_ERROR_MESSAGES } from './enum/customer-messages.enum';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
  ) {}

  async getCustomerByEmail(email: string): Promise<Customer> {
    return await this.customerRepository.findOne({ where: { email } });
  }

  async getById(id: string): Promise<Customer> {
    const customer = await this.customerRepository.findOne({ where: { id } });
    if (!customer) {
      throw new NotFoundException(CUSTOMER_ERROR_MESSAGES.CUSTOMER_NOTFOUND);
    }
    return customer;
  }

  async createCustomer(createCustomerDto: CreateCustomerDto): Promise<CustomerDto> {
    const existingCustomer = await this.getCustomerByEmail(createCustomerDto.email);
    if (existingCustomer) {
      throw new ConflictException(CUSTOMER_ERROR_MESSAGES.CUSTOMER_INVALID);
    }

    const newCustomer = this.customerRepository.create(createCustomerDto);
    const savedCustomer = await this.customerRepository.save(newCustomer);

    // Map entity to DTO (optional step if DTO differs from the entity)
    return this.mapToCustomerDto(savedCustomer);
  }

  async getCustomers(): Promise<Customer[]> {
    return await this.customerRepository.find();
  }

  async getCustomersMapped(): Promise<CustomerDto[]> {
    const customers = await this.customerRepository.find();
    return customers.map(customer => this.mapToCustomerDto(customer));
  }

  private mapToCustomerDto(customer: Customer): CustomerDto {
    return {
      id: customer.id,
      name: customer.name,
      email: customer.email,
    };
  }
}
