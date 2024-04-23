import { Payload } from "./meshtastic.payload";

export interface MeshtasticMessage {
    channel: number;
    from: number;
    id: string;
    payload: Payload;
    rssi: number;
    sender: string;
    snr: number;
    timestamp: number;
    to: number;
    type: string;
}
