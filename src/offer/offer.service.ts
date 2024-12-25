import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Offer } from './offer.entity';
import { CreateOfferDto } from './dto/create-offer.dto';
import { OfferDto } from './dto/offer.dto';
import { OFFERERRORS } from './enum/offer-message.enum';

@Injectable()
export class OfferService {
  constructor(
    @InjectRepository(Offer)
    private readonly offerRepository: Repository<Offer>
  ) {}

  async getOfferById(id: string): Promise<OfferDto> {
    const offer = await this.findOfferById(id);
    return this.mapToOfferDto(offer);
  }

  async createOffer(createOfferDto: CreateOfferDto): Promise<OfferDto> {
    const existingOffer = await this.offerRepository.findOne({ where: { name: createOfferDto.name } });
    if (existingOffer) {
       throw new ConflictException(OFFERERRORS.OFFER_EXSIT);
    }
    const newOffer = this.offerRepository.create(createOfferDto);
    const savedOffer = await this.offerRepository.save(newOffer);
    return this.mapToOfferDto(savedOffer);
  }

  async getOffers(): Promise<OfferDto[]> {
    const offers = await this.offerRepository.find();
    return offers.map(this.mapToOfferDto);
  }

  // Private helper methods
  private async findOfferById(id: string): Promise<Offer> {
    const offer = await this.offerRepository.findOne({ where: { id } });
    if (!offer) {
      throw new NotFoundException(OFFERERRORS.OFFER_NOT_FOUND);
    }
    return offer;
  }

  private mapToOfferDto(offer: Offer): OfferDto {
    return {
      id: offer.id,
      name: offer.name,
      discountPercentage: offer.discountPercentage,
    };
  }
}
