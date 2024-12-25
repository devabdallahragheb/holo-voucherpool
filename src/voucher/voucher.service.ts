import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Voucher } from './voucher.entity';
import { Repository, MoreThan } from 'typeorm';
import { CustomerService } from '../customer/customer.service';
import { OfferService } from '../offer/offer.service';
import { GenerateVoucherDto } from './dto/generate-voucher.dto';
import { VOUCHERERRORS } from './enum/voucher-messages.enum';
import { Customer } from '../customer/customer.entity';
import { generateRandomText } from './util/utils';
import { RedeemVoucherDto } from './dto/redeem-voucher.dto';
import { ValidVoucherCodeDto } from './dto/valid-voucher-code.dto';
import { RedeemVoucherResponseDto } from './dto/redeem-voucher-response.dto';
import { promises } from 'dns';

@Injectable()
export class VoucherService {
  constructor(
    @InjectRepository(Voucher)
    private voucherRepository: Repository<Voucher>,
    private customerService: CustomerService,
    private offerService: OfferService,
  ) {}

  async generateVouchers(generateVoucherDto: GenerateVoucherDto): Promise<Voucher> {
    const offer = await this.offerService.getOfferById(generateVoucherDto.offerId);
    const customer = await this.customerService.getById(generateVoucherDto.customerId);

    if (!customer || !offer) {
      throw new Error('Customer or SpecialOffer not found');
    }

    const voucherCode = generateRandomText(8);
    const voucher = this.voucherRepository.create({
      code: voucherCode,
      customer: customer,
      offer: offer,
      expirationDate: generateVoucherDto.expirationDate,
    });

    return await this.voucherRepository.save(voucher);
  }

  async validateVoucherCode(redeemVoucherDto: RedeemVoucherDto): Promise<Voucher> {
    const voucher = await this.voucherRepository.findOne({
      where: { code: redeemVoucherDto.code },
      relations: ['customer', 'offer'],
    });

    if (!voucher) {
      throw new HttpException(VOUCHERERRORS.VOUCER_NOTFOUNFD, HttpStatus.NOT_FOUND);
    }
    if (voucher.customer.email !== redeemVoucherDto.email) {
      throw new HttpException(VOUCHERERRORS.VOUCHER_NOTVALID_EMAIL, HttpStatus.NOT_FOUND);
    }
    if (voucher.dateOfUsage) {
      throw new HttpException(VOUCHERERRORS.VOCHER_USERD, HttpStatus.NOT_FOUND);
    }

    return voucher;
  }
  async getCustomerByEmail(email: string): Promise<Customer> {
    const customer = await this.customerService.getCustomerByEmail(email);
  
    if (!customer) {
      throw new HttpException(VOUCHERERRORS.VOUCHER_CUSTOMR_EMAIL_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    return customer;
  }
  async getVouchersByEmail(email: string): Promise<Voucher[]> {
    return await this.voucherRepository.find({
      where: {
        customer: {
          email: email,
        },
      },
      relations: ['customer'], // Ensure the `customer` relation is loaded if needed
    });
  }
  

  async getValidVouchersByEmail(email: string): Promise<ValidVoucherCodeDto[]> {
    const customer = await this.getCustomerByEmail(email);
    const vouchers = await this.getValidVouchersForCustomer(customer);
    // Map directly to ValidVoucherCodeDto
    return vouchers.map(voucher => {
      const offerName = voucher.offer ? voucher.offer.name : '';
      return new ValidVoucherCodeDto({ code: voucher.code, offer: offerName });
    });
  }
  

  async redeemVoucher(validateVoucherDto: RedeemVoucherDto): Promise<RedeemVoucherResponseDto> {
    const voucher = await this.validateVoucherCode(validateVoucherDto);

    voucher.dateOfUsage = new Date();

    await this.voucherRepository.save(voucher);
    

    return {
      discountPercentage: voucher.offer.discountPercentage,
      dateOfUsage: voucher.dateOfUsage,
    };
  }

  async getValidVouchersForCustomer(customer: Customer): Promise<Voucher[]> {
    const vouchers = await this.voucherRepository
      .createQueryBuilder('voucher')
      .leftJoinAndSelect('voucher.offer', 'offer') 
      .where('voucher.customer = :customerId', { customerId: customer.id }) 
      .andWhere('voucher.dateOfUsage IS NULL') 
      .andWhere('voucher.expirationDate > :currentDate', { currentDate: new Date() })
      .getMany(); 
  
    return vouchers;
  }
  
  

  async getVoucherByCode(code: string): Promise<Voucher | undefined> {
    return this.voucherRepository.findOne({
      where: { code },
      relations: ['customer', 'offer'],
    });
  }
}
