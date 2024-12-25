import {
  IsNotEmpty,
  MinLength,
  IsDateString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RedeemVoucherResponseDto {
  @ApiProperty()
  @MinLength(8)
  @IsNotEmpty()
  discountPercentage: number;

   @IsDateString()
   dateOfUsage?: Date;

}
