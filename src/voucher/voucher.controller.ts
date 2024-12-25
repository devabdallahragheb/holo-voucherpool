import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
  HttpStatus,
} from '@nestjs/common';
import { VoucherService } from './voucher.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GenerateVoucherDto } from './dto/generate-voucher.dto';
import { RedeemVoucherDto } from './dto/redeem-voucher.dto';
import { ValidVoucherCodeDto } from './dto/valid-voucher-code.dto';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { Voucher } from './voucher.entity';
import { RedeemVoucherResponseDto } from './dto/redeem-voucher-response.dto';
@Controller({ path: 'voucher', version: '1' })
@ApiTags('Voucher') 
@UsePipes(new ValidationPipe({ transform: true }))  
@UseGuards(ThrottlerGuard)  
@Throttle({ default: { limit: 3, ttl: 60000 } })  
export class VoucherController {
  constructor(private readonly voucherService: VoucherService) {}

  @Post('generate')
  @ApiOperation({ summary: 'Generate a voucher code for a customer and offer' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Customer has successfully received a new voucher.',
    type: ValidVoucherCodeDto,  
  })
  async generateVoucher(
    @Body() generateVoucherDto: GenerateVoucherDto,
  ): Promise<Voucher> {
    return this.voucherService.generateVouchers(generateVoucherDto);
  }

  @Post('redeem-voucher')
  @ApiOperation({ summary: 'Redeem a voucher' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Voucher redeemed successfully.',
    type: ValidVoucherCodeDto, 
  })
  async redeemVoucher(
    @Body() redeemVoucherDto: RedeemVoucherDto,
  ): Promise<RedeemVoucherResponseDto> {
    return this.voucherService.redeemVoucher(redeemVoucherDto);
  }

  @Get('get-valid-vouchers-by-email')
  @ApiOperation({ summary: 'List of valid voucher codes for a customer' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of valid vouchers for the customer.',
    type: [ValidVoucherCodeDto],  
  })
  async getValidVouchersByEmail(
    @Query('email') email: string,
  ): Promise<ValidVoucherCodeDto[]> {
    return this.voucherService.getValidVouchersByEmail(email);
  }
  @Get('get-vouchers-by-email')
  @ApiOperation({ summary: 'List of  voucher codes for a customer' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of vouchers for the customer.',
    type: [ValidVoucherCodeDto], 
  })
  async getVouchersByEmail(
    @Query('email') email: string,
  ): Promise<Voucher[]> {
    return this.voucherService.getVouchersByEmail(email);
  }
}
