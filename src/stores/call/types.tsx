import { Device } from "twilio-client";
import { Connection } from "twilio-client";
import states from "../../components/location/map-components/Phone/twilio/states.js";

export interface TwillioDevice {
  emulatorId: number,
  number: string,
  token: string,
  state: string;
  conn: Connection | null,
  device: Device,
}
