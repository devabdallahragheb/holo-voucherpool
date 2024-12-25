import {
  Controller,
  Get,
  Post,
  Body,
  UsePipes,
   UseGuards,
   ValidationPipe
} from '@nestjs/common';
import { OfferService } from './offer.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { OfferDto } from './dto/offer.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { OFFERERRORS } from './enum/offer-message.enum';
@Controller({ path: 'offer', version: '1' })
@ApiTags('Offer')
@UsePipes(new ValidationPipe({ transform: true }))
@UseGuards(ThrottlerGuard)
@Throttle({ default: { limit: 3, ttl: 60000 } })
export class OfferController {
  constructor(private readonly offerService: OfferService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new offer' })
  @ApiResponse({
    status: 201,
    description: OFFERERRORS.OFFER_CREATED_DESCRIPTION,
    type: OfferDto,
  })
  async createOffer(@Body() createOfferDto: CreateOfferDto): Promise<OfferDto> {
    return this.offerService.createOffer(createOfferDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all offers' })
  @ApiResponse({
    status: 200,
    description: OFFERERRORS.GET_OFFER_DESCRIPTION,
    type: OfferDto,
    isArray: true,
  })
  async getOffers(): Promise<OfferDto[]> {
    return this.offerService.getOffers();
  }
}
