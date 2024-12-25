import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { Min } from 'class-validator';
import { Customer } from '../customer/customer.entity';
import { Offer } from '../offer/offer.entity';
import { BaseEntity } from 'src/common/entities/base.entity';
@Entity('vouchers')
@Index(['code'], { unique: true })
@Index(['customer', 'code', 'offer'], { unique: true })
export class Voucher extends BaseEntity {
  @Min(8)
  @Column('varchar', { length: 16, unique: true })
  code: string;

  @Column('timestamp', { nullable: true })
  expirationDate: Date;

  @Column('timestamp', { nullable: true })
  dateOfUsage?: Date;

  @ManyToOne(() => Customer, (customer) => customer.vouchers)
  customer: Customer;

  @ManyToOne(() => Offer, (offer) => offer.vouchers)
  offer: Offer;
}
