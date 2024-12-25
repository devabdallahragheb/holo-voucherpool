import { Column, Entity, Index, OneToMany } from 'typeorm';
import { Voucher } from '../voucher/voucher.entity';
import { BaseEntity } from 'src/common/entities/base.entity';
@Index(['email'], { unique: true })
@Entity('customers')
export class Customer extends BaseEntity {
  @Column({ type: 'text', unique: true })
  @Index()
  name: string;

  @Column('text', { unique: true })
  email: string;

  @OneToMany(() => Voucher, (voucher) => voucher.customer)
  vouchers: Voucher[];
}
