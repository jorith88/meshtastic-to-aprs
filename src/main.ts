import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import * as config from '../conf/config.json';
import { MeshtasticModule } from './meshtastic/meshtastic.module';

async function bootstrap() {
    const meshtastic = await NestFactory.createMicroservice(MeshtasticModule, {
      transport: Transport.MQTT,
      options: {
        url: config.meshtastic.mqtt.url,
        username: config.meshtastic.mqtt.username,
        password: config.meshtastic.mqtt.password,
      },
    });
    await meshtastic.listen();
  }
bootstrap();
