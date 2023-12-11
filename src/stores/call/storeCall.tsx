import { StateCreator } from "zustand";
import { TwillioDevice } from "./types";
import { Emulator } from "../emulator/types";

import { Device, Connection } from "twilio-client";
import ApiService from "../../ApiService.js";
import { EMULATOR_URL, VOICE_GET_TOKEN_URL } from "../../constants.js";
import states from "../../components/location/map-components/Phone/twilio/states.js";
import useFetch from "../../hooks/useFetch.js";
import { useEmulatorStore } from "../emulator/store.js";

export interface deviceStore {
  devices: TwillioDevice[] | [];
  selectedDevice: TwillioDevice | null;
  createDevices: (emulators: Emulator[]) => Promise<void>;
  selectDevice: (selectedDevice: TwillioDevice | null) => void;
  updateDeviceState: (updatedDevice: TwillioDevice) => void;
  deleteAllDevices: () => void;
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
      const newDevices: TwillioDevice[] = [];
      await Promise.all(
        emulators.map(async (emulator) => {
          if (emulator.telephone === null || emulator.telephone === undefined) {
            return null;
          }
          const userToken = localStorage.getItem("token");
          const { data: token, error } = await ApiService.makeApiCall(
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

          newDevices.push(deviceDataModel);

          deviceDataModel.device.setup(deviceDataModel.token, {
            codecPreferences: [Connection.Codec.Opus, Connection.Codec.PCMU],
            fakeLocalDTMF: true,
            enableRingingState: true,
            debug: true,
          });

          deviceDataModel.device.on("ready", () => {
            console.log("DEVICES device ready");
            const deviceDataModelReady: TwillioDevice = {
              emulatorId: emulator.id,
              token: deviceDataModel.token,
              state: states.READY,
              conn: deviceDataModel.conn,
              device: deviceDataModel.device,
              number: emulator.telephone,
            };
            get().updateDeviceState(deviceDataModelReady);
          });
          deviceDataModel.device.on("connect", (connection) => {
            console.log("DEVICES device connect", connection);
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
            console.log("DEVICES device disconnect");
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
            console.log(
              "DEVICES device Incoming call received : ",
              incomingConnection
            );
            const deviceDataModelIncoming = {
              emulatorId: emulator.id,
              token: deviceDataModel.token,
              state: states.INCOMING,
              conn: incomingConnection,
              device: deviceDataModel.device,
              number: emulator.telephone,
            };
            get().updateDeviceState(deviceDataModelIncoming);

            incomingConnection.on("reject", () => {
              console.log("DEVICES device call rejected");
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
          deviceDataModel.device.on("cancel", () => {
            console.log("DEVICES device call cancel");
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
            console.log("DEVICES device call reject");
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
        })
      );
      console.log("DEVICES newDevices:", newDevices);
      set({ devices: newDevices });
      console.error("DEVICES created Devices:", get().devices);
    } catch (error) {
      console.error("DEVICES Failed to create Devices:", error);
    }
  },
  selectDevice: (selectedDevice) => {
    console.log("DEVICES selectedDevice:", selectedDevice);
    set({ selectedDevice });
  },
  updateDeviceState: (updatedDevice) => {
    const updatedDevices = get().devices.map((device: TwillioDevice) => {
      if (device.emulatorId === updatedDevice.emulatorId) {
        if (
          updatedDevice.state === states.INCOMING ||
          updatedDevice.state === states.ON_CALL
        ) {
          get().selectDevice(updatedDevice); // if incoming or on call, select the device
        } else if (
          updatedDevice.state === states.READY ||
          updatedDevice.state === states.OFFLINE
        ) {
          get().selectDevice(null); // if not incoming or on call, deselect the device
        }
        return { ...device, ...updatedDevice };
      }
      return device;
    });
    set({ devices: updatedDevices });
  },
  deleteAllDevices: () => {
    get().devices.forEach((twillioDevice) => {
      twillioDevice.device.destroy();
    });
    set({ devices: [] });
    get().selectDevice(null);
  }
});

// NOTE:: SPECIFICALLY FOR GPS_PAGE_TABLE to open/close dialog incoming/disconnect calls
export function compareSelectedDeviceForDialog(
  oldSelectedDevice: TwillioDevice | null,
  newSelectedDevice: TwillioDevice | null
) {
  //INCOMING
  if (
    newSelectedDevice !== null &&
    newSelectedDevice.state === states.INCOMING
  ) {
    return false;
  }
  //END CALL
  if (newSelectedDevice !== null && oldSelectedDevice !== null) {
    if (
      newSelectedDevice.state === states.READY ||
      newSelectedDevice.state === states.OFFLINE
    ) {
      if (oldSelectedDevice.state === states.ON_CALL) return false;
    }
  }
  return true;
}
