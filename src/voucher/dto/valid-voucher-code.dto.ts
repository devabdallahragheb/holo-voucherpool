import { ApiProperty } from '@nestjs/swagger';

export class ValidVoucherCodeDto {
  @ApiProperty()
  readonly code: string;

  @ApiProperty()
  readonly offer: string;

  constructor(props: ValidVoucherCodeDto) {
    Object.assign(this, props);
  }

}
