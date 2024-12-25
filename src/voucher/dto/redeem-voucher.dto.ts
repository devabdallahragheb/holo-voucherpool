import {
  IsNotEmpty,
  IsEmail,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CUSTOMER_ERROR_MESSAGES } from 'src/customer/enum/customer-messages.enum';
import { ERROR_MESSAGES } from 'src/common/enums/messages.enum';

export class RedeemVoucherDto {
  @ApiProperty()
  @MinLength(8)
  @IsNotEmpty()
   code: string;

   @ApiProperty({ example: 'aabdelglil4@gmail.com', description: 'user email' })
  @IsNotEmpty()
  @IsEmail({}, { message: ERROR_MESSAGES.INVALID_EMAIL })
   email: string;

}
