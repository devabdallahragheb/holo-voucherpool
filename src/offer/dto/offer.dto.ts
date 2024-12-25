import { ApiProperty } from '@nestjs/swagger';
import { CreateOfferDto } from './create-offer.dto';

export class OfferDto extends CreateOfferDto {
  @ApiProperty({})
   id: string;

}
