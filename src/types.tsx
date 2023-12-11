
import { Device, Connection } from "twilio-client";

export interface TwillioDevice {
  emulatorId: number,
  number: number,
  token: string,
  state: Connection.State,
  conn: Connection,
  device: Device,
}
