import { Test, TestingModule } from '@nestjs/testing';
import { VoucherService } from '../voucher.service';
import { GenerateVoucherDto } from '../dto/generate-voucher.dto';
import { RedeemVoucherDto } from '../dto/redeem-voucher.dto';
import { RedeemVoucherResponseDto } from '../dto/redeem-voucher-response.dto';
import { ValidVoucherCodeDto } from '../dto/valid-voucher-code.dto';
import { Voucher } from '../voucher.entity';
import { ThrottlerGuard } from '@nestjs/throttler';
import { VoucherController } from '../voucher.controller';
import * as cryptoRandomString from 'crypto-random-string';

// Mock the crypto-random-string to avoid actual function call
jest.mock('crypto-random-string', () => ({
  __esModule: true,
  default: jest.fn(() => 'mocked-voucher-code'),
}));

describe('VoucherController', () => {
  let controller: VoucherController;
  let voucherService: VoucherService;

  // Mock the VoucherService
  const mockVoucherService = {
    generateVouchers: jest.fn(),
    redeemVoucher: jest.fn(),
    getValidVouchersByEmail: jest.fn(),
    getVouchersByEmail: jest.fn(), // New method
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VoucherController],
      providers: [
        {
          provide: VoucherService,
          useValue: mockVoucherService,
        },
      ],
    })
      .overrideGuard(ThrottlerGuard)
      .useValue({
        canActivate: jest.fn().mockReturnValue(true),
      })
      .compile();

    controller = module.get<VoucherController>(VoucherController);
    voucherService = module.get<VoucherService>(VoucherService);
  });

  describe('generateVoucher', () => {
    it('should call VoucherService.generateVouchers and return the created voucher', async () => {
      const generateVoucherDto: GenerateVoucherDto = {
        offerId: 'offer-id',
        customerId: 'customer-id',
        expirationDate: new Date(),
      };

      const mockVoucher: Voucher = {
        id: '2222',
        code: 'mocked-voucher-code', // Use the mocked value here
        customer: { id: 'customer-id', email: 'aabdelglil4@gmail.com' } as any,
        offer: { id: 'offer-id', name: 'Offer 1', discountPercentage: 20 } as any,
        expirationDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
        dateOfUsage: null,
      };

      mockVoucherService.generateVouchers.mockResolvedValue(mockVoucher);

      const result = await controller.generateVoucher(generateVoucherDto);

      expect(voucherService.generateVouchers).toHaveBeenCalledWith(generateVoucherDto);
      expect(result).toEqual(mockVoucher);
    });
  });

  describe('redeemVoucher', () => {
    it('should call VoucherService.redeemVoucher and return the redeemed voucher details', async () => {
      const redeemVoucherDto: RedeemVoucherDto = {
        code: 'VALID123',
        email: 'aabdelglil4@gmail.com',
      };

      const mockResponse: RedeemVoucherResponseDto = {
        discountPercentage: 20,
        dateOfUsage: new Date(),
      };

      mockVoucherService.redeemVoucher.mockResolvedValue(mockResponse);

      const result = await controller.redeemVoucher(redeemVoucherDto);

      expect(voucherService.redeemVoucher).toHaveBeenCalledWith(redeemVoucherDto);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getValidVouchersByEmail', () => {
    it('should call VoucherService.getValidVouchersByEmail and return valid voucher codes', async () => {
      const email = 'aabdelglil4@gmail.com';
      const mockVouchers: ValidVoucherCodeDto[] = [
        { code: 'VOUCHER1', offer: 'Offer1' },
        { code: 'VOUCHER2', offer: 'Offer2' },
      ];

      mockVoucherService.getValidVouchersByEmail.mockResolvedValue(mockVouchers);

      const result = await controller.getValidVouchersByEmail(email);

      expect(voucherService.getValidVouchersByEmail).toHaveBeenCalledWith(email);
      expect(result).toEqual(mockVouchers);
    });
  });

  describe('getVouchersByEmail', () => {
    it('should call VoucherService.getVouchersByEmail and return a list of vouchers', async () => {
      const email = 'aabdelglil4@gmail.com';
      const mockVouchers: Voucher[] = [
        {
          id: '1',
          code: 'VOUCHER1',
          customer: { id: 'customer-id', email: 'aabdelglil4@gmail.com' } as any,
          offer: { id: 'offer-id', name: 'Offer 1', discountPercentage: 20 } as any,
          expirationDate: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
          dateOfUsage: null,
        },
        {
          id: '2',
          code: 'VOUCHER2',
          customer: { id: 'customer-id', email: 'aabdelglil4@gmail.com' } as any,
          offer: { id: 'offer-id-2', name: 'Offer 2', discountPercentage: 30 } as any,
          expirationDate: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
          dateOfUsage: null,
        },
      ];

      mockVoucherService.getVouchersByEmail.mockResolvedValue(mockVouchers);

      const result = await controller.getVouchersByEmail(email);

      expect(voucherService.getVouchersByEmail).toHaveBeenCalledWith(email);
      expect(result).toEqual(mockVouchers);
    });

    it('should return an empty array if no vouchers are found', async () => {
      const email = 'aabdelglil4@gmail.com';
      const mockVouchers: Voucher[] = [];

      mockVoucherService.getVouchersByEmail.mockResolvedValue(mockVouchers);

      const result = await controller.getVouchersByEmail(email);

      expect(voucherService.getVouchersByEmail).toHaveBeenCalledWith(email);
      expect(result).toEqual([]);
    });
  });
});
