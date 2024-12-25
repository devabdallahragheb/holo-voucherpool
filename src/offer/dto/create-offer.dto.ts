import { IsNotEmpty, IsNumber, IsString, Max, Min, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CUSTOMER_ERROR_MESSAGES } from '../../customer/enum/customer-messages.enum';
import { OFFERERRORS } from '../enum/offer-message.enum';

export class CreateOfferDto {
  @ApiProperty({ example: ' sale discount', description: 'dicount for slae' })
  @IsNotEmpty()
  @IsString({ message: OFFERERRORS. NAME_INVALID})
  @MinLength(4)
   name: string;

   @ApiProperty({ example: 10 , description: 'percentage of descoint' })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(100)
discountPercentage: number;

  
}
