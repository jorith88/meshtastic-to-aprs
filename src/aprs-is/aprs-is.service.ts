/* eslint-disable prefer-const */
import { Injectable } from '@nestjs/common';
import { ISSocket } from 'js-aprs-is';
import { Payload } from 'src/types/meshtastic.payload';
import * as config from '../../conf/config.json';

@Injectable()
export class AprsIsService {
  async sendLocationUpdate(payload: Payload) {
    console.log('Send location update to APRS-IS');
    const aprsMessage = this.createAprsMessage(payload);

    console.log(aprsMessage);
    this.send(aprsMessage);
  }

  private send(aprsMessage: string) {
    const connection = new ISSocket(
      config.aprs.server,
      config.aprs.port,
      config.aprs.callsign,
      config.aprs.passcode,
    );

    // connection.on('data', function(data) {
    //   console.log(`Data: ${data}`);
    // });
    connection.on('connect', function () {
      console.log(`Connected!`);
      connection.sendLine(connection.userLogin);
      connection.sendLine(aprsMessage);
      connection.disconnect();
    });

    connection.connect();
  }

  private createAprsMessage(payload: Payload) {
    const aprsCoordinates = this.createAprsCoordinates(payload);

    let message = `${config.aprs.callsign}>APRS,TCPIP*,qAC:!${aprsCoordinates}${config.aprs.symbol}${config.aprs.message}`;

    return message;
  }

  private createAprsCoordinates(payload: Payload) {
    // Change "http://www.maps.com/directions/address/simple_address.html" coords to Magellan GPS 310 coords.

    let dmdLatHem, dmdLongHem;
    let ddLatVal, ddLongVal;
    let ddLatVals, ddLongVals;
    let dmdLatDeg, dmdLatMin;
    let dmdLongDeg, dmdLongMin;
    let ddLatRemainder, ddLongRemainder;

    // convert int coordinates to decimal
    const latitude = payload.latitude_i / 10000000;
    const longitude = payload.longitude_i / 10000000;

    const ddLat = String(latitude),
      ddLong = String(longitude);

    // Check for southern hemisphere values
    if (ddLat.substring(0, 1) == '-') {
      dmdLatHem = 'S';
      ddLatVal = ddLat.substring(1, ddLat.length - 1); // truncates the minus off the string and writes to ddLatVal
    } else {
      dmdLatHem = 'N';
      ddLatVal = ddLat;
    }
    // Check for western hemisphere values
    if (ddLong.substring(0, 1) == '-') {
      dmdLongHem = 'W';
      ddLongVal = ddLong.substring(1, ddLong.length - 1); // truncates the minus off the string and writes to ddLongVal
    } else {
      dmdLongHem = 'E';
      ddLongVal = ddLong;
    }

    // decimal split to a 2-value array of integers before and after the point: ddL*Vals[0] & ddL*Vals[1]
    ddLatVals = ddLatVal.split('.');
    dmdLatDeg = ddLatVals[0];
    ddLongVals = ddLongVal.split('.');
    dmdLongDeg = ddLongVals[0];

    // make it a decimal again and multiply by 60 to get decimal minutes
    ddLatRemainder = Number('0.' + ddLatVals[1]) * 60;
    dmdLatMin = String(this.roundTo2(ddLatRemainder));
    ddLongRemainder = Number('0.' + ddLongVals[1]) * 60;
    dmdLongMin = String(this.roundTo2(ddLongRemainder));

    // eslint-disable-next-line prettier/prettier
    return `${dmdLatDeg.padStart(2, '0')}${dmdLatMin.padEnd(5, '0')}${dmdLatHem}${config.aprs.overlay}${dmdLongDeg.padStart(3, '0')}${dmdLongMin.padEnd(5, '0')}${dmdLongHem}`;
  }

  // Round to x places
  private roundTo2(v) {
    v = v * 100;
    v = Math.round(v);
    v = v / 100;
    return v;
  }
}
