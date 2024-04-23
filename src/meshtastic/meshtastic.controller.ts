import { Controller } from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  MqttContext,
  Payload,
} from '@nestjs/microservices';
import * as config from '../../conf/config.json';
import { MeshtasticMessage } from '../types/meshtastic.message';
import { AprsIsService } from 'src/aprs-is/aprs-is.service';

@Controller()
export class MeshtasticController {
  constructor(private readonly aprsIsService: AprsIsService) {}

  @MessagePattern(config.meshtastic.mqtt.topic)
  handleLocationUpdate(
    @Payload() data: MeshtasticMessage,
    @Ctx() context: MqttContext,
  ) {

    if (data.type === `position` && data.from === config.meshtastic.node_id) {
      console.log(`Received message from Meshtastic at ${data.timestamp}`);
      console.log(data.payload);
      this.aprsIsService.sendLocationUpdate(data.payload);
    }

  }
}
