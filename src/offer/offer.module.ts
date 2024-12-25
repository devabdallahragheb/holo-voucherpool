import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Offer } from './offer.entity';
import { ThrottlerModule } from '@nestjs/throttler';
import { OfferService } from './offer.service';
import { OfferController } from './offer.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Offer]),],
  providers: [OfferService],
  exports: [OfferService],
  controllers: [OfferController],
})
export class OfferModule {}
