import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Voucher } from './voucher.entity';
import { CustomerModule } from '../customer/customer.module';
import { OfferModule } from '../offer/offer.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { VoucherService } from './voucher.service';
import { VoucherController } from './voucher.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Voucher]),
    CustomerModule,
    OfferModule
  ],
  providers: [VoucherService],
  exports: [VoucherService],
  controllers: [VoucherController],
})
export class VoucherModule {
}