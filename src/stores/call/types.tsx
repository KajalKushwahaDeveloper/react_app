import { Connection, Device } from "twilio-client";

export interface TwillioDevice {
  emulatorId: number,
  number: string,
  realNumber: string | null,
  token: string,
  state: string;
  conn: Connection | null,
  device: Device,
}
