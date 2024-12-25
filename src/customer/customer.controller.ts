import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  UsePipes,
  ValidationPipe,
  HttpStatus,
} from '@nestjs/common';
import { CustomerService } from './customer.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { CustomerDto } from './dto/customer.dto';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { CUSTOMER_MESSGAES } from './enum/customer-messages.enum';

@Controller({ path: 'customer', version: '1' })
@ApiTags('Customer')
@UsePipes(new ValidationPipe({ transform: true })) // Validate the body of the request
@UseGuards(ThrottlerGuard) // Global throttling guard applied
@Throttle({ default: { limit: 3, ttl: 60000 } }) // Throttling configuration
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new customer' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: CUSTOMER_MESSGAES.CUSTOMERCREATED,
    type: CustomerDto,
  })
  async createCustomer(
    @Body() createCustomerDto: CreateCustomerDto,
  ): Promise<CustomerDto> {
    return this.customerService.createCustomer(createCustomerDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all customers' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: CUSTOMER_MESSGAES.GETCUSTOMERDISCRIPTION,
    type: [CustomerDto],
  })
  async getCustomers(): Promise<CustomerDto[]> {
    return this.customerService.getCustomersMapped();
  }
}
