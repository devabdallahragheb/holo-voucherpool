import { Column, Entity, Index, OneToMany } from 'typeorm';
import { Voucher } from '../voucher/voucher.entity';
import { BaseEntity } from 'src/common/entities/base.entity';
import { Max, Min } from 'class-validator';

@Entity({ name: 'offers' })
export class Offer extends BaseEntity {
  @Column({ type: 'text', unique: true })
  @Index()
  public name: string;

  @Column({ type: 'float' })
  @Min(0)
  @Max(100)
  public discountPercentage: number;

  @OneToMany(
    () => Voucher,
    voucher => voucher.offer,
  )
  vouchers: Voucher[];
}
