import { Test, TestingModule } from '@nestjs/testing';
import { OfferService } from '../offer.service';
import { Offer } from '../offer.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { CreateOfferDto } from '../dto/create-offer.dto';
import { OfferDto } from '../dto/offer.dto';
import { OFFERERRORS } from '../enum/offer-message.enum';

describe('OfferService', () => {
  let service: OfferService;
  let repository: Repository<Offer>;

  const mockOfferRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OfferService,
        {
          provide: getRepositoryToken(Offer),
          useValue: mockOfferRepository,
        },
      ],
    }).compile();

    service = module.get<OfferService>(OfferService);
    repository = module.get<Repository<Offer>>(getRepositoryToken(Offer));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getOfferById', () => {
    it('should return an offer if found', async () => {
      const id = '123';
      const offer = { id, name: 'Winter Sale', discountPercentage: 20 };
      const offerDto: OfferDto = {
        id,
        name: 'Winter Sale',
        discountPercentage: 20,
      };

      mockOfferRepository.findOne.mockResolvedValue(offer);

      const result = await service.getOfferById(id);
      expect(result).toEqual(offerDto);
      expect(mockOfferRepository.findOne).toHaveBeenCalledWith({ where: { id } });
    });

    it('should throw NotFoundException if the offer is not found', async () => {
      const id = '123';
      mockOfferRepository.findOne.mockResolvedValue(null);

      await expect(service.getOfferById(id)).rejects.toThrowError(
        new NotFoundException(OFFERERRORS.OFFER_NOT_FOUND),
      );
    });
  });

  describe('createOffer', () => {
    it('should create and return an offer', async () => {
      const createOfferDto: CreateOfferDto = {
        name: 'Summer Sale',
        discountPercentage: 15,
      };
      const savedOffer = {
        id: '456',
        name: 'Summer Sale',
        discountPercentage: 15,
      };
      const offerDto: OfferDto = {
        id: '456',
        name: 'Summer Sale',
        discountPercentage: 15,
      };

      mockOfferRepository.create.mockReturnValue(savedOffer);
      mockOfferRepository.save.mockResolvedValue(savedOffer);

      const result = await service.createOffer(createOfferDto);

      expect(result).toEqual(offerDto);
      expect(mockOfferRepository.create).toHaveBeenCalledWith(createOfferDto);
      expect(mockOfferRepository.save).toHaveBeenCalledWith(savedOffer);
    });
  });

  describe('getOffers', () => {
    it('should return all offers as OfferDto[]', async () => {
      const offers = [
        { id: '1', name: 'Offer1', discountPercentage: 10 },
        { id: '2', name: 'Offer2', discountPercentage: 20 },
      ];
      const offerDtos = [
        { id: '1', name: 'Offer1', discountPercentage: 10 },
        { id: '2', name: 'Offer2', discountPercentage: 20 },
      ];

      mockOfferRepository.find.mockResolvedValue(offers);

      const result = await service.getOffers();

      expect(result).toEqual(offerDtos);
      expect(mockOfferRepository.find).toHaveBeenCalled();
    });
  });
});
