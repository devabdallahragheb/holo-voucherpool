import { CreateCustomerDto } from './create-customer.dto';
import { ApiProperty } from '@nestjs/swagger';

export class CustomerDto extends CreateCustomerDto {
  @ApiProperty({})
   id: string;

 
}
