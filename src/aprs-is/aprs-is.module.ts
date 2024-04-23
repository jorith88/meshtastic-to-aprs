import { Module } from '@nestjs/common';
import { AprsIsService } from './aprs-is.service';

@Module({
  imports: [],
  controllers: [],
  providers: [AprsIsService],
  exports: [AprsIsService],
})
export class AprsIsModule {}
