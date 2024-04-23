import { Module } from '@nestjs/common';
import { MeshtasticController } from './meshtastic.controller';
import { AprsIsModule } from '../aprs-is/aprs-is.module';

@Module({
  imports: [AprsIsModule],
  controllers: [MeshtasticController],
  providers: [],
})
export class MeshtasticModule {}
