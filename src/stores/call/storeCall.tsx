import { StateCreator } from "zustand";
import { TwillioDevice } from "./types";
import { Emulator } from "../emulator/types";

import { Device, Connection } from "twilio-client";
import ApiService from "../../ApiService.js";
import { VOICE_GET_TOKEN_URL } from "../../constants.js";
import states from "../../components/location/map-components/Phone/twilio/states.js";

export interface deviceStore {
  devices: TwillioDevice[] | [];
  selectedDevice: TwillioDevice | null;
  createDevices: (emulators: Emulator[]) => Promise<void>;
  selectDevice: (selectedDevice: TwillioDevice | null) => void;
  updateDeviceState: (selectedDevice: TwillioDevice) => void;
}

export const createDeviceSlice: StateCreator<
  deviceStore,
  [],
  [],
  deviceStore
> = (set, get) => ({
  devices: [],
  selectedDevice: null,
  createDevices: async (emulators: Emulator[]) => {
    try {
      const newTwillioDevice: TwillioDevice[] = [];

      emulators.forEach(async (emulator, index) => {
        if (emulator.telephone === null || emulator.telephone === undefined) {
          return null;
        }
        const userToken = localStorage.getItem("token");
        const {
          success,
          data: token,
          error,
        } = await ApiService.makeApiCall(
          VOICE_GET_TOKEN_URL,
          "GET",
          null,
          userToken,
          emulator.telephone
        );

        if (error) {
          console.error(error);
          return;
        }

        const deviceDataModel: TwillioDevice = {
          emulatorId: emulator.id,
          token: token,
          state: states.CONNECTING,
          conn: null,
          device: new Device(),
          number: emulator.telephone,
        };

        newTwillioDevice.push(deviceDataModel);

        deviceDataModel.device.setup(deviceDataModel.token, {
          codecPreferences: [Connection.Codec.Opus, Connection.Codec.PCMU],
          fakeLocalDTMF: true,
          enableRingingState: true,
          debug: true,
        });

        deviceDataModel.device.on("ready", () => {
          console.log("device ready");
          const deviceDataModelReady: TwillioDevice = {
            emulatorId: emulator.id,
            token: deviceDataModel.token,
            state: deviceDataModel.state,
            conn: deviceDataModel.conn,
            device: deviceDataModel.device,
            number: emulator.telephone,
          };
          get().updateDeviceState(deviceDataModelReady);
        });
        deviceDataModel.device.on("connect", (connection) => {
          console.log("device connect", connection);
          const deviceDataModelConnect: TwillioDevice = {
            emulatorId: deviceDataModel.emulatorId,
            token: deviceDataModel.token,
            state: states.ON_CALL,
            conn: connection,
            device: deviceDataModel.device,
            number: emulator.telephone,
          };
          get().updateDeviceState(deviceDataModelConnect);
        });
        deviceDataModel.device.on("disconnect", () => {
          console.log("device disconnect");
          const deviceDataModelDisconnect = {
            emulatorId: emulator.id,
            token: deviceDataModel.token,
            state: states.READY,
            conn: null,
            device: deviceDataModel.device,
            number: emulator.telephone,
          };
          get().updateDeviceState(deviceDataModelDisconnect);
        });
        deviceDataModel.device.on("incoming", (incomingConnection) => {
          console.log("device Incoming call received : ", incomingConnection);
          const deviceDataModelIncoming = {
            emulatorId: emulator.id,
            token: deviceDataModel.token,
            state: states.INCOMING,
            conn: incomingConnection,
            device: deviceDataModel.device,
            number: emulator.telephone,
          };
          get().updateDeviceState(deviceDataModelIncoming);
          get().selectDevice(deviceDataModelIncoming);

          incomingConnection.on("reject", () => {
            console.log("device call rejected");
            const deviceDataModelReject = {
              emulatorId: emulator.id,
              token: deviceDataModel.token,
              state: states.READY,
              conn: null,
              device: deviceDataModel.device,
              number: emulator.telephone,
            };
            get().updateDeviceState(deviceDataModelReject);
            get().selectDevice(deviceDataModelIncoming);
          });
        });
        deviceDataModel.device.on("cancel", () => {
          console.log("device call cancel");
          const deviceDataModelCancel = {
            emulatorId: emulator.id,
            token: deviceDataModel.token,
            state: states.READY,
            conn: null,
            device: deviceDataModel.device,
            number: emulator.telephone,
          };
          get().updateDeviceState(deviceDataModelCancel);
        });
        deviceDataModel.device.on("reject", () => {
          const deviceDataModelReject = {
            emulatorId: emulator.id,
            token: deviceDataModel.token,
            state: states.READY,
            conn: null,
            device: deviceDataModel.device,
            number: emulator.telephone,
          };
          get().updateDeviceState(deviceDataModelReject);
        });
      });
      set({ devices: newTwillioDevice });
    } catch (error) {
      console.error("V2 Failed to fetch emulators:", error);
    }
  },
  selectDevice: (selectedDevice) => {
    set({ selectedDevice });
  },
  updateDeviceState: (selectedDevice) => {
    get().devices = get().devices.map((device: TwillioDevice) => {
      if (device.emulatorId === selectedDevice.emulatorId) {
        return { ...device, ...selectedDevice };
      }
      return device;
    });
  },
});
