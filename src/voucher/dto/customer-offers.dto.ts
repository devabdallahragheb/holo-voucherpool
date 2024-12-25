import {
  IsNotEmpty,
  IsEmail,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CustomerOffersDto {
  @ApiProperty()
  @MinLength(8)
  @IsNotEmpty()
   code: string;

   @ApiProperty({ example: '"black friday', description: ' offer  name and details' })
  offer: string;

}

