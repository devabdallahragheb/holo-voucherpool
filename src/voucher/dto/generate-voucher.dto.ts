import { IsNotEmpty, IsDateString, IsUUID, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

const currentDate = new Date();
const nextDay = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000);

export class GenerateVoucherDto {
  @ApiProperty({ format: 'uuid' })
  @IsNotEmpty()
  @IsUUID()
  offerId: string;

  @ApiProperty({ format: 'uuid' })
  @IsNotEmpty()
  @IsUUID()
  customerId: string;
  
  @ApiProperty({ default: nextDay.toISOString() })
  @IsDateString()
  expirationDate: Date;
 
  @IsDateString()
  @IsOptional()
  dateOfUsage?: Date;
}
