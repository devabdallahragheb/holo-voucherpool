import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags } from '@nestjs/swagger';
@ApiTags('healthy')

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiTags('healthy')
  
  healthy(): string {
    return this.appService.healthy();
  }
}
