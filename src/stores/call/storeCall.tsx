/* eslint-disable no-undef, no-unused-vars */
import { StateCreator } from 'zustand'
import { Emulator } from '../emulator/types'
import { TwillioDevice } from './types'

import { Connection, Device } from 'twilio-client'
import ApiService from '../../ApiService.js'
import states from '../../components/location/map-components/Phone/twilio/states.js'
import { EMULATOR_URL, VOICE_GET_TOKEN_URL } from '../../constants.js'

export interface deviceStore {
  devices: TwillioDevice[] | []
  selectedDevice: TwillioDevice | null
  createDevices: () => Promise<void>
  selectDevice: (selectedDevice: TwillioDevice | null) => void
  updateDeviceState: (updatedDevice: TwillioDevice) => void
  deleteAllDevices: () => void
}

export interface microphoneStatus {
  isMicEnabled: boolean
  setMicEnabled: (value: boolean) => void
}

export const microphoneCheckSlice: StateCreator<microphoneStatus> = (set) => ({
  isMicEnabled: false,
  setMicEnabled: (value: boolean) => set({ isMicEnabled: value })
})

export const createDeviceSlice: StateCreator<
  deviceStore,
  [],
  [],
  deviceStore
> = (set, get) => ({
  devices: [],
  selectedDevice: null,
  createDevices: async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(EMULATOR_URL, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      })
      const emulators = await response.json()
      await createDevicesFromEmulators(emulators, get, set)
    } catch (error) {
      console.error('V2 Failed to fetch emulators:', error)
    }
  },
  selectDevice: (selectedDevice) => {
    set({ selectedDevice })
  },
  updateDeviceState: (updatedDevice) => {
    const updatedDevices = get().devices.map((device: TwillioDevice) => {
      if (device.emulatorId === updatedDevice.emulatorId) {
        if (
          updatedDevice.state === states.INCOMING ||
          updatedDevice.state === states.ON_CALL
        ) {
          get().selectDevice(updatedDevice) // if incoming or on call, select the device
        } else if (
          updatedDevice.state === states.READY ||
          updatedDevice.state === states.OFFLINE
        ) {
          get().selectDevice(null) // if not incoming or on call, deselect the device
        }
        return { ...device, ...updatedDevice }
      }
      return device
    })
    set({ devices: updatedDevices })
  },
  deleteAllDevices: () => {
    get().devices.forEach((twillioDevice: TwillioDevice | null) => {
      twillioDevice?.device?.destroy()
    })
    set({ devices: [] })
    get().selectDevice(null)
  }
})

async function createDevicesFromEmulators(
  emulators: Emulator[],
  get: () => deviceStore,
  set: (
    partial:
      | deviceStore
      | Partial<deviceStore>
      | ((state: deviceStore) => deviceStore | Partial<deviceStore>),
    replace?: boolean | undefined
  ) => void
) {
  try {
    const newDevices: TwillioDevice[] = []
    await Promise.all(
      emulators.map(async (emulator) => {
        if (emulator.telephone === null || emulator.telephone === undefined) {
          return null
        }
        const userToken = localStorage.getItem('token')
        const { data: token, error } = await ApiService.makeApiCall(
          VOICE_GET_TOKEN_URL,
          'GET',
          null,
          userToken,
          emulator.telephone
        )

        if (error) {
          console.error(error)
          return
        }

        const deviceDataModel: TwillioDevice = {
          emulatorId: emulator.id,
          token,
          state: states.CONNECTING,
          conn: null,
          device: new Device(),
          number: emulator.telephone
        }

        newDevices.push(deviceDataModel)

        deviceDataModel.device.setup(deviceDataModel.token, {
          codecPreferences: [Connection.Codec.Opus, Connection.Codec.PCMU],
          fakeLocalDTMF: true,
          enableRingingState: true,
          debug: true
        })

        deviceDataModel.device.on('ready', () => {
          const deviceDataModelReady: TwillioDevice = {
            emulatorId: emulator.id,
            token: deviceDataModel.token,
            state: states.READY,
            conn: deviceDataModel.conn,
            device: deviceDataModel.device,
            number: emulator.telephone
          }
          get().updateDeviceState(deviceDataModelReady)
        })
        deviceDataModel.device.on('connect', (connection) => {
          const deviceDataModelConnect: TwillioDevice = {
            emulatorId: deviceDataModel.emulatorId,
            token: deviceDataModel.token,
            state: states.ON_CALL,
            conn: connection,
            device: deviceDataModel.device,
            number: emulator.telephone
          }
          get().updateDeviceState(deviceDataModelConnect)
        })
        deviceDataModel.device.on('disconnect', () => {
          const deviceDataModelDisconnect = {
            emulatorId: emulator.id,
            token: deviceDataModel.token,
            state: states.READY,
            conn: null,
            device: deviceDataModel.device,
            number: emulator.telephone
          }
          get().updateDeviceState(deviceDataModelDisconnect)
        })
        deviceDataModel.device.on('incoming', (incomingConnection) => {
          const deviceDataModelIncoming = {
            emulatorId: emulator.id,
            token: deviceDataModel.token,
            state: states.INCOMING,
            conn: incomingConnection,
            device: deviceDataModel.device,
            number: emulator.telephone
          }
          get().updateDeviceState(deviceDataModelIncoming)

          incomingConnection.on('reject', () => {
            const deviceDataModelReject = {
              emulatorId: emulator.id,
              token: deviceDataModel.token,
              state: states.READY,
              conn: null,
              device: deviceDataModel.device,
              number: emulator.telephone
            }
            get().updateDeviceState(deviceDataModelReject)
          })
        })
        deviceDataModel.device.on('cancel', () => {
          const deviceDataModelCancel = {
            emulatorId: emulator.id,
            token: deviceDataModel.token,
            state: states.READY,
            conn: null,
            device: deviceDataModel.device,
            number: emulator.telephone
          }
          get().updateDeviceState(deviceDataModelCancel)
        })
        deviceDataModel.device.on('reject', () => {
          const deviceDataModelReject = {
            emulatorId: emulator.id,
            token: deviceDataModel.token,
            state: states.READY,
            conn: null,
            device: deviceDataModel.device,
            number: emulator.telephone
          }
          get().updateDeviceState(deviceDataModelReject)
        })
      })
    )
    set({ devices: newDevices })
  } catch (error) {
    console.error('DEVICES Failed to create Devices:', error)
  }
}

// NOTE:: SPECIFICALLY FOR GPS_PAGE_TABLE to open/close dialog incoming/disconnect calls
export function compareSelectedDeviceForDialog(
  oldSelectedDevice: TwillioDevice | null,
  newSelectedDevice: TwillioDevice | null
) {
  // INCOMING
  if (
    newSelectedDevice !== null &&
    newSelectedDevice.state === states.INCOMING
  ) {
    return false
  }
  // END CALL
  if (newSelectedDevice !== null && oldSelectedDevice !== null) {
    if (
      newSelectedDevice.state === states.READY ||
      newSelectedDevice.state === states.OFFLINE
    ) {
      if (oldSelectedDevice.state === states.ON_CALL) return false
    }
  }
  return true
}
