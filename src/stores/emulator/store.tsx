import { create, StateCreator } from "zustand";
import { devtools } from "zustand/middleware";
import { Emulator, TripData, TripPoint } from "./types.tsx";
import {
  Center,
  defaultLng,
  defaultLat,
  compareEmulatorsCompletely,
} from "./types_maps.tsx";
import { BASE_URL, EMULATOR_URL, TRIP_URL } from "../../constants";
import { deviceStore, createDeviceSlice } from "../call/storeCall.tsx";
import {
  fetchEventSource,
  FetchEventSourceInit,
} from "@microsoft/fetch-event-source";

export interface EmulatorsSlice {
  eventSource: AbortController | null;
  selectedEmulator: Emulator | null;
  emulators: Emulator[] | [];
  updateEmulators: (emulators: Emulator[]) => void;
  fetchEmulators: () => Promise<void>;
  selectEmulator: (emulator: Emulator | null) => void;
}

export interface TripDataSlice {
  // latitude: number | null
  center: Center;
  tripData: TripData | null;
  pathTraveled: TripPoint[] | null;
  pathNotTraveled: TripPoint[] | null;
  setTripData: (selectedEmulator: Emulator | null) => Promise<void>;
}

interface SharedSlice {
  connectSse: () => void;
  logout: () => void;
  getBoth: () => void;
}

const createEmulatorsSlice: StateCreator<
  EmulatorsSlice & TripDataSlice,
  [],
  [],
  EmulatorsSlice
> = (set, get) => ({
  eventSource: null,
  emulators: [],
  selectedEmulator: null,
  fetchEmulators: async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(EMULATOR_URL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const emulators = await response.json();
      const selectedEmulator = get().selectedEmulator;
      if (selectedEmulator !== null) {
        get().setTripData(selectedEmulator);
      }
      set({ emulators });
    } catch (error) {
      console.error("V2 Failed to fetch emulators:", error);
    }
  },
  selectEmulator: (emulator) => {
    if (
      emulator !== null &&
      emulator !== undefined &&
      emulator.latitude !== null &&
      emulator.longitude !== null
    ) {
      get().center = { lat: emulator.latitude, lng: emulator.longitude };
    }
    set({ selectedEmulator: emulator });
    get().setTripData(emulator);
  },

  updateEmulators: (newEmulators) => {
    const isUpdatedEmulators = compareEmulatorsCompletely(
      get().emulators,
      newEmulators
    );

    if (isUpdatedEmulators === false) {
      return;
    }

    const selectedEmulatorOld = get().selectedEmulator;
    if (selectedEmulatorOld !== null && selectedEmulatorOld !== undefined) {
      const selectedEmulatorNew = newEmulators?.find(
        (newEmulator) => selectedEmulatorOld.id === newEmulator.id
      );
      if (selectedEmulatorNew && selectedEmulatorNew !== undefined) {
        if (
          selectedEmulatorNew.currentTripPointIndex !== null &&
          selectedEmulatorOld.currentTripPointIndex !== null &&
          selectedEmulatorNew.currentTripPointIndex !==
            selectedEmulatorOld.currentTripPointIndex
        ) {
          get().setTripData(selectedEmulatorNew);
        }
        set({ selectedEmulator: selectedEmulatorNew });
      }
    }
    set({ emulators: newEmulators });
  },
});

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
  setTripData: async (selectedEmulator: Emulator | null) => {
    const token = localStorage.getItem("token");
    if (
      selectedEmulator === null ||
      selectedEmulator === undefined ||
      token === null
    ) {
      //clear trip Data
      set({ tripData: null, pathTraveled: null, pathNotTraveled: null });
    } else {
      try {
        const response = await fetch(TRIP_URL + `/${selectedEmulator.id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const tripData: TripData = await response.json();
        let pathTraveledIndex = selectedEmulator?.currentTripPointIndex + 1;
        let pathNotTraveledIndex = selectedEmulator?.currentTripPointIndex;
        if (selectedEmulator?.currentTripPointIndex < 0) {
          pathTraveledIndex = 1;
          pathNotTraveledIndex = 0;
        }
        const pathTraveled = tripData?.tripPoints?.slice(0, pathTraveledIndex);
        const pathNotTraveled =
          tripData?.tripPoints?.slice(pathNotTraveledIndex);
        console.warn(
          "New TRIP DATA: currentTripPointIndex : ",
          selectedEmulator?.currentTripPointIndex
        );
        set({ tripData, pathTraveled, pathNotTraveled });
      } catch (error) {
        console.error("Failed to fetch trip data:", error);
        set({ tripData: null, pathTraveled: null, pathNotTraveled: null });
      }
    }
  },
});

const createSharedSlice: StateCreator<
  EmulatorsSlice & TripDataSlice & deviceStore,
  [],
  [],
  SharedSlice
> = (set, get) => ({
  connectSse: () => {
    // Run this when we are logged in. i.e. when we have a token
    const token = localStorage.getItem("token");
    console.log("fetchEventSource TRIGGERED");
    const ctrl = new AbortController();

    fetchEventSource(`${BASE_URL}/sse`, {
      method: "GET",
      headers: {
        Accept: "text/event-stream",
        Authorization: `Bearer ${token}`,
      },
      onopen: async (res: Response) => {
        if (res.ok && res.status === 200) {
          console.log("Connection made ", res);
        } else if (
          res.status >= 400 &&
          res.status < 500 &&
          res.status !== 429
        ) {
          console.log("Client side error ", res);
        }
      },
      onmessage(event) {
        const parsedData: Emulator[] = JSON.parse(event.data);
        useEmulatorStore.getState().updateEmulators(parsedData);
      },
      onclose() {
        console.log("Connection closed by the server");
      },
      onerror(err) {
        console.log("There was an error from the server", err);
      },
      signal: ctrl.signal,
    });
    get().eventSource = ctrl;
  },
  logout: () => {
    localStorage.removeItem("token");
    get().eventSource?.abort();
    set({ eventSource: null, emulators: [], selectedEmulator: null });
    set({
      tripData: null,
      pathTraveled: null,
      pathNotTraveled: null,
      center: { lat: defaultLat, lng: defaultLng },
    });
    const devices = get().devices;
    if (devices.length > 0) {
      devices.forEach((twillioDevice) => {
        twillioDevice.device.destroy();
      });
    }
    set({ devices: [], selectedDevice: null });
  },
  getBoth: () => {
    // get().bears + get().fishes
  },
});

export const useEmulatorStore = create<
  EmulatorsSlice & TripDataSlice & SharedSlice & deviceStore
>()(
  devtools((...args) => ({
    ...createEmulatorsSlice(...args),
    ...createTripDataSlice(...args),
    ...createSharedSlice(...args),
    ...createDeviceSlice(...args),
  }))
);
