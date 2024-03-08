/* eslint-disable no-undef, no-unused-vars */
import { fetchEventSource } from '@microsoft/fetch-event-source'
import { create, StateCreator } from 'zustand'
import { devtools, subscribeWithSelector } from 'zustand/middleware'
import {
  EMULATOR_URL,
  SSE_ALL_EMULATORS_URL,
  SSE_CONNECTED_EMULATOR_URL
} from '../../constants'
import { EmulatorEvent, EmulatorsSSEEvent } from '../../model/EmulatorEvent.tsx'
import {
  createDeviceSlice,
  deviceStore,
  microphoneCheckSlice,
  microphoneStatus
} from '../call/storeCall.tsx'
import { TwillioDevice } from '../call/types.tsx'
import useMarkerStore from './markerStore.js'
import { SelectedEmulatorData, toTripData } from './SelectedEmulatorData.tsx'
import {
  DragEmulator,
  Emulator,
  MoveEmulator,
  TripData,
  TripPoint
} from './types.tsx'
import { Center, defaultLat, defaultLng } from './types_maps.tsx'

export interface EmulatorsSlice {
  isLoading: boolean
  emulatorsEventSource: AbortController | null
  selectedEmulatorEventSource: AbortController | null
  selectedEmulator: Emulator | null
  emulators: Emulator[] | []
  hoveredEmulator: Emulator | null
  draggedEmulator: DragEmulator | null
  movedEmulator: MoveEmulator | null
  updateEmulators: (emulators: Emulator[]) => void
  fetchEmulators: () => Promise<void>
  selectEmulator: (emulator: Emulator | null) => void
  hoverEmulator: (emulator: Emulator | null) => void
  dragEmulator: (emulator: DragEmulator | null) => void
  moveEmulator: (emulator: MoveEmulator | null) => void
}

export interface TripDataSlice {
  // latitude: number | null
  connectedEmulator: Emulator | null
  center: Center | null
  tripData: TripData | null
  pathTraveled: TripPoint[] | null
  pathNotTraveled: TripPoint[] | null
  connectSelectedEmulatorSSE: (selectedEmulator: Emulator | null) => void
  setSelectedEmulatorSSEData: (
    selectedEmulatorData: SelectedEmulatorData
  ) => void
  setPaths: (emulator: Emulator, tripData: TripData) => void
}

interface SharedSlice {
  getEmulatorsSSE: () => void
  logout: () => void
  getBoth: () => void
  showLoader: () => void
  hideLoader: () => void
}

const createEmulatorsSlice: StateCreator<
  EmulatorsSlice & TripDataSlice,
  [],
  [],
  EmulatorsSlice
> = (set, get) => ({
  isLoading: false,
  emulatorsEventSource: null,
  selectedEmulatorEventSource: null,
  emulators: [],
  emulatorsCount: 0,
  selectedEmulator: null,
  hoveredEmulator: null,
  draggedEmulator: null,
  movedEmulator: null,
  updateEmulators: async (newEmulators) => {
    set({ emulators: newEmulators })
    await useMarkerStore.getState().advance(newEmulators)
  },
  fetchEmulators: async () => {
    const token = localStorage.getItem('token')
    try {
      const response = await fetch(EMULATOR_URL, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      })
      const emulators = await response.json()
      set({ emulators })
    } catch (error) {
      console.error('V2 Failed to fetch emulators:', error)
    }
  },
  selectEmulator: (emulator) => {
    if (
      emulator !== null &&
      emulator !== undefined &&
      emulator.latitude !== null &&
      emulator.longitude !== null
    ) {
      set({ center: { lat: emulator.latitude, lng: emulator.longitude } })
    } else {
      set({ center: null })
    }
    // if same as selectedEmulator, then do nothing..
    if (
      emulator === get().selectedEmulator ||
      emulator?.id === get().selectedEmulator?.id
    ) {
      return
    }

    set({ selectedEmulator: emulator })
    get().connectSelectedEmulatorSSE(emulator)
  },
  hoverEmulator: (hoveredEmulator) => set({ hoveredEmulator }),
  dragEmulator: (draggedEmulator) => set({ draggedEmulator }),
  moveEmulator: (movedEmulator) => set({ movedEmulator })
})

const createTripDataSlice: StateCreator<
  EmulatorsSlice & TripDataSlice,
  [],
  [],
  TripDataSlice
> = (set, get) => ({
  center: { lat: defaultLat, lng: defaultLng },
  tripData: null,
  pathTraveled: null,
  pathNotTraveled: null,
  connectedEmulator: null,
  connectSelectedEmulatorSSE: (selectedEmulator: Emulator | null) => {
    console.log('TEST@ connectSelectedEmulatorSSE')
    const selectedEmulatorEventSource = get().selectedEmulatorEventSource
    if (selectedEmulator === null || selectedEmulator === undefined) {
      selectedEmulatorEventSource?.abort() // abort the emulatorsEventSource
      set({
        connectedEmulator: null,
        tripData: null,
        pathTraveled: null,
        pathNotTraveled: null,
        selectedEmulatorEventSource: null
      }) // clear trip data
      return
    }
    if (selectedEmulator.id !== get().connectedEmulator?.id) {
      selectedEmulatorEventSource?.abort() // abort the emulatorsEventSource
      set({
        selectedEmulatorEventSource: null,
        tripData: null,
        pathNotTraveled: null,
        pathTraveled: null
      }) // clear trip data
    }
    // We connect to the emulator's SSE
    const token = localStorage.getItem('token')
    const ctrl = new AbortController()
    set({ isLoading: true })
    fetchEventSource(`${SSE_CONNECTED_EMULATOR_URL}/${selectedEmulator?.id}`, {
      method: 'GET',
      headers: {
        Accept: 'text/event-stream',
        Authorization: `Bearer ${token}`
      },
      onopen: async (res: Response) => {
        if (res.status >= 400 && res.status < 500 && res.status !== 429) {
          console.error('Client side error ', res)
        }
        set({ isLoading: false })
      },
      onmessage(event) {
        // if heartbeat, then return
        console.log('TEST@ event: ', event)
        if (event.event === 'heartbeat') {
          return
        }
        try {
          // check event.event with EmulatorEvent
          const emulatorData: SelectedEmulatorData = JSON.parse(event.data)
          console.log('TEST@ emulatorData: ', emulatorData)
          if (event.event === EmulatorEvent.EMULATOR_CONNECTED_NO_TRIP) {
            const emulatorData: SelectedEmulatorData = JSON.parse(event.data)
            set({ connectedEmulator: emulatorData.emulatorDetails })
          } else if (
            event.event === EmulatorEvent.EMULATOR_CONNECTED ||
            event.event === EmulatorEvent.EMULATOR_TRIP_DETAILS_UPDATED
          ) {
            const emulatorData: SelectedEmulatorData = JSON.parse(event.data)
            get().setSelectedEmulatorSSEData(emulatorData)
          } else if (event.event === EmulatorEvent.EMULATOR_TRIP_CANCELLED) {
            const emulatorData: Emulator = JSON.parse(event.data)
            set({
              connectedEmulator: emulatorData,
              tripData: null,
              pathTraveled: null,
              pathNotTraveled: null
            })
          } else if (event.event === EmulatorEvent.EMULATOR_LOCATION_UPDATED) {
            const emulatorData: SelectedEmulatorData = JSON.parse(event.data)
            set({ connectedEmulator: emulatorData?.emulatorDetails })
            var tripData = get().tripData
            if (tripData !== null) {
              get().setPaths(emulatorData?.emulatorDetails, tripData)
            }
          }
        } catch (error) {
          console.error('Error parsing event data', error)
        }
      },
      onclose() {
        console.error('Connection closed by the server')
        set({ isLoading: false })
      },
      onerror(err) {
        console.log('TEST@', err)
        console.error('There was an error from the server', err)
        set({ isLoading: false })
      },
      signal: ctrl.signal
    })
    get().selectedEmulatorEventSource = ctrl
  },
  setSelectedEmulatorSSEData: (selectedEmulatorData: SelectedEmulatorData) => {
    const tripData = toTripData(selectedEmulatorData)
    set({
      connectedEmulator: selectedEmulatorData.emulatorDetails,
      tripData: tripData
    })
    get().setPaths(selectedEmulatorData?.emulatorDetails, tripData)
  },
  setPaths: (sseEmulator: Emulator, tripData: TripData) => {
    let pathTraveledIndex = sseEmulator.currentTripPointIndex + 1
    let pathNotTraveledIndex = sseEmulator?.currentTripPointIndex
    if (sseEmulator?.currentTripPointIndex < 0) {
      pathTraveledIndex = 1
      pathNotTraveledIndex = 0
    }
    const pathTraveled = tripData?.tripPoints?.slice(0, pathTraveledIndex)
    const pathNotTraveled = tripData?.tripPoints?.slice(pathNotTraveledIndex)
    set({ pathTraveled, pathNotTraveled })
  }
})

const createSharedSlice: StateCreator<
  EmulatorsSlice & TripDataSlice & deviceStore,
  [],
  [],
  SharedSlice
> = (set, get) => ({
  getEmulatorsSSE: () => {
    // Run this when we are logged in. i.e. when we have a token
    const token = localStorage.getItem('token')
    const ctrl = new AbortController()

    fetchEventSource(`${SSE_ALL_EMULATORS_URL}`, {
      method: 'GET',
      headers: {
        Accept: 'text/event-stream',
        Authorization: `Bearer ${token}`
      },
      onopen: async (res: Response) => {
        if (res.status >= 400 && res.status < 500 && res.status !== 429) {
          console.error('Client side error ', res)
        }
      },
      onmessage(event) {
        // if heartbeat, then return
        if (event.event === 'heartbeat') {
          return
        }
        // check event.event with EmulatorEvent
        if (event.event === EmulatorsSSEEvent.EMULATORS_CONNECTED) {
          const emulators: Emulator[] = JSON.parse(event.data)
          useEmulatorStore.getState().updateEmulators(emulators)
        }
        if (event.event === EmulatorsSSEEvent.EMULATOR_UPDATED) {
          const emulator = JSON.parse(event.data)
          const emulators = get().emulators
          // find the emulator and update it on a new array
          const index = emulators.findIndex((e) => e.id === emulator.id)
          if (index !== -1) {
            emulators[index] = emulator
          }
          useEmulatorStore.getState().updateEmulators([...emulators])
        }
      },
      onclose() {
        console.warn('Connection closed by the server')
      },
      onerror(err) {
        console.error('There was an error from the server', err)
      },
      signal: ctrl.signal
    })
    get().emulatorsEventSource = ctrl
  },
  logout: () => {
    localStorage.removeItem('token')
    get().emulatorsEventSource?.abort()
    set({ emulatorsEventSource: null, emulators: [], selectedEmulator: null })
    set({
      tripData: null,
      pathTraveled: null,
      pathNotTraveled: null,
      center: { lat: defaultLat, lng: defaultLng }
    })
    const devices = get().devices
    if (devices.length > 0) {
      devices.forEach((twillioDevice: TwillioDevice | null) => {
        twillioDevice?.device?.destroy()
      })
    }
    set({ devices: [], selectedDevice: null })
  },
  getBoth: () => {
    // get().bears + get().fishes
  },
  showLoader: () => {
    set({ isLoading: true })
  },
  hideLoader: () => {
    set({ isLoading: false })
  }
})

export const useEmulatorStore = create<
  EmulatorsSlice & TripDataSlice & SharedSlice & deviceStore & microphoneStatus
>()(
  subscribeWithSelector(
    devtools((...args) => ({
      ...createEmulatorsSlice(...args),
      ...createTripDataSlice(...args),
      ...createSharedSlice(...args),
      ...createDeviceSlice(...args),
      ...microphoneCheckSlice(...args)
    }))
  )
)
