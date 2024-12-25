import { ApiProperty } from '@nestjs/swagger';
import {  IsEmail, IsString, MinLength } from 'class-validator';
import { CUSTOMER_ERROR_MESSAGES } from '../enum/customer-messages.enum';
import { ERROR_MESSAGES } from 'src/common/enums/messages.enum';

export class CreateCustomerDto {
  @ApiProperty({})
  @IsString({ message: CUSTOMER_ERROR_MESSAGES.CUSTOMER_INVALID_NAME })
  @ApiProperty({ example: 'abdullah abdelglil', description: 'the customer name  name' })
  @MinLength(2)
   name: string;

  @ApiProperty({ example: 'aabdelglil4@gmail.com', description: 'user email' })
  @IsEmail({}, { message: ERROR_MESSAGES.INVALID_EMAIL })
   email: string;
}

export default CreateCustomerDto;
