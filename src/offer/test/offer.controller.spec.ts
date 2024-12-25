import { Test, TestingModule } from '@nestjs/testing';
import { OfferController } from '../offer.controller';
import { OfferService } from '../offer.service';
import { CreateOfferDto } from '../dto/create-offer.dto';
import { OfferDto } from '../dto/offer.dto';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ThrottlerGuard } from '@nestjs/throttler';
import { Offer } from '../offer.entity';

describe('OfferController', () => {
  let controller: OfferController;
  let service: OfferService;
  let offerRepository: Repository<Offer>;

  const mockOfferService = {
    createOffer: jest.fn(),
    getOffers: jest.fn(),
  };

  const mockOfferRepository = {
    save: jest.fn(),
    find: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OfferController],
      providers: [
        {
          provide: OfferService,
          useValue: mockOfferService,
        },
        {
          provide: getRepositoryToken(Offer),
          useValue: mockOfferRepository,
        },
      ],
    })
      .overrideGuard(ThrottlerGuard)
      .useValue({
        canActivate: jest.fn().mockReturnValue(true),
      })
      .compile();

    controller = module.get<OfferController>(OfferController);
    service = module.get<OfferService>(OfferService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createOffer', () => {
    it('should create a new offer', async () => {
      const createOfferDto: CreateOfferDto = {
        name: 'Sale discount',
        discountPercentage: 10,
      };

      const mockOfferDto: OfferDto = {
        id: '1',
        name: 'Sale discount',
        discountPercentage: 10,
      };

      mockOfferService.createOffer.mockResolvedValue(mockOfferDto);
      mockOfferRepository.save.mockResolvedValue(mockOfferDto);

      const result = await controller.createOffer(createOfferDto);

      expect(result).toEqual(mockOfferDto);
      expect(mockOfferService.createOffer).toHaveBeenCalledWith(createOfferDto);
    });
  });

  describe('getOffers', () => {
    it('should return all offers', async () => {
      const mockOfferDtos: OfferDto[] = [
        { id: '1', name: 'Sale discount', discountPercentage: 10 },
        { id: '2', name: 'Holiday discount', discountPercentage: 20 },
      ];

      mockOfferService.getOffers.mockResolvedValue(mockOfferDtos);
      mockOfferRepository.find.mockResolvedValue(mockOfferDtos);

      const result = await controller.getOffers();

      expect(result).toEqual(mockOfferDtos);
    });
  });
});
