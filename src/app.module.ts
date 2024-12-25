import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { validate } from './config/env.validation';
import DatabaseModule from './database/database.module';
import LoggingMiddleware from './common/middleware/logging.middleware';

import { CustomerModule } from './customer/customer.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { VoucherModule } from './voucher/voucher.module';
import { OfferModule } from './offer/offer.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validate }),
    DatabaseModule,ThrottlerModule.forRoot([{
        ttl: 60,
        limit: 2,
      }]),
  CustomerModule,VoucherModule,OfferModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes('*');
  }}