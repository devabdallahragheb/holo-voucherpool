import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HttpException, HttpStatus } from '@nestjs/common';
import { VoucherService } from '../voucher.service';
import { Voucher } from '../voucher.entity';
import { CustomerService } from 'src/customer/customer.service';
import { OfferService } from 'src/offer/offer.service';
import { GenerateVoucherDto } from '../dto/generate-voucher.dto';
import { Customer } from 'src/customer/customer.entity';
import { RedeemVoucherDto } from '../dto/redeem-voucher.dto';
import { VOUCHERERRORS } from '../enum/voucher-messages.enum';
import { ValidVoucherCodeDto } from '../dto/valid-voucher-code.dto';

jest.mock('../util/utils', () => ({
  generateRandomText: jest.fn(() => 'RANDOM123'),
}));

const mockVoucherRepository = () => ({
  create: jest.fn(),
  save: jest.fn(),
  findOne: jest.fn(),
  find: jest.fn(), 
  createQueryBuilder: jest.fn(() => ({
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    getMany: jest.fn(),
  })),
});

const mockCustomerService = () => ({
  getById: jest.fn(),
  getCustomerByEmail: jest.fn(),
});

const mockOfferService = () => ({
  getOfferById: jest.fn(),
});

describe('VoucherService', () => {
  let service: VoucherService;
  let voucherRepository: jest.Mocked<Repository<Voucher>>;
  let customerService: jest.Mocked<CustomerService>;
  let offerService: jest.Mocked<OfferService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VoucherService,
        { provide: getRepositoryToken(Voucher), useFactory: mockVoucherRepository },
        { provide: CustomerService, useFactory: mockCustomerService },
        { provide: OfferService, useFactory: mockOfferService },
      ],
    }).compile();

    service = module.get<VoucherService>(VoucherService);
    voucherRepository = module.get(getRepositoryToken(Voucher));
    customerService = module.get<CustomerService>(CustomerService) as jest.Mocked<CustomerService>;
    offerService = module.get<OfferService>(OfferService) as jest.Mocked<OfferService>;
  });

  describe('generateVouchers', () => {
    it('should generate and save a voucher', async () => {
      const generateVoucherDto: GenerateVoucherDto = {
        offerId: 'offer-id',
        customerId: 'customer-id',
        expirationDate: new Date(),
      };
      const customer = { id: 'customer-id' } as Customer;
      const offer = { id: 'offer-id', name: 'Special Offer', "discountPercentage": 20 };

      customerService.getById.mockResolvedValue(customer);
      offerService.getOfferById.mockResolvedValue(offer);
      voucherRepository.create.mockReturnValue({
        code: 'RANDOM123',
        customer,
        offer,
        expirationDate: generateVoucherDto.expirationDate,
      } as Voucher);
      voucherRepository.save.mockResolvedValue({
        code: 'RANDOM123',
        customer,
        offer,
      } as Voucher);

      const result = await service.generateVouchers(generateVoucherDto);

      expect(customerService.getById).toHaveBeenCalledWith(generateVoucherDto.customerId);
      expect(offerService.getOfferById).toHaveBeenCalledWith(generateVoucherDto.offerId);
      expect(voucherRepository.create).toHaveBeenCalled();
      expect(voucherRepository.save).toHaveBeenCalled();
      expect(result.code).toEqual('RANDOM123');
    });

    it('should throw an error if customer or offer is not found', async () => {
      customerService.getById.mockResolvedValue(null);
      offerService.getOfferById.mockResolvedValue(null);

      const generateVoucherDto: GenerateVoucherDto = {
        offerId: 'invalid-offer',
        customerId: 'invalid-customer',
        expirationDate: new Date(),
      };

      await expect(service.generateVouchers(generateVoucherDto)).rejects.toThrow('Customer or SpecialOffer not found');
    });
  });

  describe('validateVoucherCode', () => {
    it('should validate a voucher code successfully', async () => {
      const redeemVoucherDto: RedeemVoucherDto = { code: 'VALID123', email: 'aabdelglil4@gmail.com' };
      const voucher = {
        code: 'VALID123',
        customer: { email: 'aabdelglil4@gmail.com' },
        dateOfUsage: null,
      } as Voucher;

      voucherRepository.findOne.mockResolvedValue(voucher);

      const result = await service.validateVoucherCode(redeemVoucherDto);

      expect(voucherRepository.findOne).toHaveBeenCalledWith({
        where: { code: redeemVoucherDto.code },
        relations: ['customer', 'offer'],
      });
      expect(result).toEqual(voucher);
    });

    it('should throw an error if the voucher does not exist', async () => {
      voucherRepository.findOne.mockResolvedValue(null);

      const redeemVoucherDto: RedeemVoucherDto = { code: 'INVALID', email: 'aabdelglil4@gmail.com' };

      await expect(service.validateVoucherCode(redeemVoucherDto)).rejects.toThrow(
        new HttpException(VOUCHERERRORS.VOUCER_NOTFOUNFD, HttpStatus.NOT_FOUND),
      );
    });

    it('should throw an error if the email does not match', async () => {
      const redeemVoucherDto: RedeemVoucherDto = { code: 'VALID123', email: 'wrong@example.com' };
      const voucher = {
        code: 'VALID123',
        customer: { email: 'aabdelglil4@gmail.com' },
        dateOfUsage: null,
      } as Voucher;

      voucherRepository.findOne.mockResolvedValue(voucher);

      await expect(service.validateVoucherCode(redeemVoucherDto)).rejects.toThrow(
        new HttpException(VOUCHERERRORS.VOUCHER_NOTVALID_EMAIL, HttpStatus.NOT_FOUND),
      );
    });
  });

  describe('redeemVoucher', () => {
    it('should redeem a voucher successfully', async () => {
      const redeemVoucherDto: RedeemVoucherDto = { code: 'VALID123', email: 'aabdelglil4@gmail.com' };
      const voucher = {
        code: 'VALID123',
        customer: { email: 'aabdelglil4@gmail.com' },
        offer: { discountPercentage: 20 },
        dateOfUsage: null,
      } as Voucher;

      jest.spyOn(service, 'validateVoucherCode').mockResolvedValue(voucher);
      voucherRepository.save.mockResolvedValue({ ...voucher, dateOfUsage: new Date() });

      const result = await service.redeemVoucher(redeemVoucherDto);

      expect(service.validateVoucherCode).toHaveBeenCalledWith(redeemVoucherDto);
      expect(voucherRepository.save).toHaveBeenCalled();
      expect(result.discountPercentage).toEqual(20);
      expect(result.dateOfUsage).toBeDefined();
    });
  });

  describe('getValidVouchersByEmail', () => {
    it('should return valid vouchers for a customer email', async () => {
      const email = 'aabdelglil4@gmail.com';
      const customer = { id: 'customer-id' } as Customer;
      const vouchers = [
        { code: 'VOUCHER1', offer: { name: 'Offer1' } },
        { code: 'VOUCHER2', offer: { name: 'Offer2' } },
      ] as Voucher[];

      customerService.getCustomerByEmail.mockResolvedValue(customer);
      jest.spyOn(service, 'getValidVouchersForCustomer').mockResolvedValue(vouchers);

      const result = await service.getValidVouchersByEmail(email);

      expect(customerService.getCustomerByEmail).toHaveBeenCalledWith(email);
      expect(service.getValidVouchersForCustomer).toHaveBeenCalledWith(customer);
      expect(result).toEqual([
        new ValidVoucherCodeDto({ code: 'VOUCHER1', offer: 'Offer1' }),
        new ValidVoucherCodeDto({ code: 'VOUCHER2', offer: 'Offer2' }),
      ]);
    });
  });
  describe('getVouchersByEmail', () => {
    it('should return vouchers for a valid customer email', async () => {
      const email = 'aabdelglil4@gmail.com';
      const vouchers = [
        {
          code: 'VOUCHER1',
          customer: { email: 'aabdelglil4@gmail.com' },
        },
        {
          code: 'VOUCHER2',
          customer: { email: 'aabdelglil4@gmail.com' },
        },
      ] as Voucher[];
  
      voucherRepository.find.mockResolvedValue(vouchers);
  
      const result = await service.getVouchersByEmail(email);
  
      expect(voucherRepository.find).toHaveBeenCalledWith({
        where: {
          customer: {
            email: email,
          },
        },
        relations: ['customer'],
      });
      expect(result).toEqual(vouchers);
    });
  
    it('should return an empty array if no vouchers are found for the email', async () => {
      const email = 'aabdelglil4@gmail.com';
  
      voucherRepository.find.mockResolvedValue([]);
  
      const result = await service.getVouchersByEmail(email);
  
      expect(voucherRepository.find).toHaveBeenCalledWith({
        where: {
          customer: {
            email: email,
          },
        },
        relations: ['customer'],
      });
      expect(result).toEqual([]);
    });
  });
  
  describe('getCustomerByEmail', () => {
    it('should return the customer if they exist', async () => {
      const email = 'aabdelglil4@gmail.com';
      const customer = { id: 'customer-id', email: 'aabdelglil4@gmail.com' } as Customer;
  
      customerService.getCustomerByEmail.mockResolvedValue(customer);
  
      const result = await service.getCustomerByEmail(email);
  
      expect(customerService.getCustomerByEmail).toHaveBeenCalledWith(email);
      expect(result).toEqual(customer);
    });
  
    it('should throw an error if the customer is not found', async () => {
      const email = 'aabdelglil4@gmail.com';
  
      customerService.getCustomerByEmail.mockResolvedValue(null);
  
      await expect(service.getCustomerByEmail(email)).rejects.toThrow(
        new HttpException(VOUCHERERRORS.VOUCHER_CUSTOMR_EMAIL_NOT_FOUND, HttpStatus.NOT_FOUND),
      );
  
      expect(customerService.getCustomerByEmail).toHaveBeenCalledWith(email);
    });
  });
});
