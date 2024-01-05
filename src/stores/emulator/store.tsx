import { create, StateCreator } from "zustand";
import { devtools } from "zustand/middleware";
import { DragEmulator, Emulator, TripData, TripPoint } from "./types.tsx";
import {
  Center,
  defaultLng,
  defaultLat,
  compareEmulatorsCompletely,
} from "./types_maps.tsx";
import { BASE_URL, EMULATOR_URL, TRIP_URL } from "../../constants";
import { deviceStore, createDeviceSlice } from "../call/storeCall.tsx";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import { TripDataResponse } from "../../model/response.tsx";
import { TwillioDevice } from "../call/types.tsx";

export interface EmulatorsSlice {
  eventSource: AbortController | null;
  selectedEmulator: Emulator | null;
  emulators: Emulator[] | [];
  hoveredEmulator: Emulator | null;
  dragEmulatorRequest: DragEmulator | null;
  updateEmulators: (emulators: Emulator[]) => void;
  fetchEmulators: () => Promise<void>;
  selectEmulator: (emulator: Emulator | null) => void;
  hoverEmulator: (emulator: Emulator | null) => void;
  dragEmulator: (emulator: DragEmulator | null) => void;
}

export interface TripDataSlice {
  // latitude: number | null
  center: Center;
  tripData: TripData | null;
  pathTraveled: TripPoint[] | null;
  pathNotTraveled: TripPoint[] | null;
  fetchTripData: (selectedEmulator: Emulator | null) => Promise<void>;
  setTripData: (tripData: TripData | null) => void;
  setPaths: (tripData: TripData | null) => void;
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
  hoveredEmulator: null,
  dragEmulatorRequest: null,
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
        get().fetchTripData(selectedEmulator);
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
    get().fetchTripData(emulator);
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
          get().fetchTripData(selectedEmulatorNew);
        }
        set({ selectedEmulator: selectedEmulatorNew });
      }
    }
    set({ emulators: newEmulators });
  },
  hoverEmulator: (emulator) => set({ hoveredEmulator: emulator }),
  dragEmulator: (dragEmulatorRequest) => set({ dragEmulatorRequest }),
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
  fetchTripData: async (selectedEmulator: Emulator | null) => {
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
        const tripDataOld = get().tripData;
        var tripDataOldDistance = 0;
        if (
          tripDataOld !== null &&
          tripDataOld !== undefined &&
          tripDataOld.distance !== null &&
          tripDataOld.distance !== undefined
        ) {
          tripDataOldDistance = tripDataOld.distance;
        }
        // pass tripDataOldDistance as a query parameter
        const response = await fetch(TRIP_URL + `/${selectedEmulator.id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ distance: tripDataOldDistance }),
        });
        // can return either the TripData or a string
        const tripDataResp: TripDataResponse = await response.json();
        if (tripDataResp.data === null || tripDataResp.data === undefined) {
          console.warn(
            "TripData is null",
            tripDataResp.status + " " + tripDataResp.statusText
          );
          set({ tripData: tripDataOld });
          get().setPaths(tripDataOld);
        } else {
          const tripData = tripDataResp.data;
          set({ tripData });
          get().setPaths(tripData);
        }
      } catch (error) {
        console.error("Failed to fetch trip data:", error);
        set({ tripData: null, pathTraveled: null, pathNotTraveled: null });
      }
    }
  },
  setTripData: (tripData: TripData | null) => {
    set({ tripData });
    get().setPaths(tripData);
  },
  setPaths: (tripData: TripData | null) => {
    const selectedEmulator = get().selectedEmulator;
    if (selectedEmulator === null || tripData === null) {
      return;
    }
    let pathTraveledIndex = selectedEmulator.currentTripPointIndex + 1;
    let pathNotTraveledIndex = selectedEmulator?.currentTripPointIndex;
    if (selectedEmulator?.currentTripPointIndex < 0) {
      pathTraveledIndex = 1;
      pathNotTraveledIndex = 0;
    }
    const pathTraveled = tripData?.tripPoints?.slice(0, pathTraveledIndex);
    const pathNotTraveled = tripData?.tripPoints?.slice(pathNotTraveledIndex);
    set({ pathTraveled, pathNotTraveled });
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
    const ctrl = new AbortController();

    fetchEventSource(`${BASE_URL}/sse`, {
      method: "GET",
      headers: {
        Accept: "text/event-stream",
        Authorization: `Bearer ${token}`,
      },
      onopen: async (res: Response) => {
        if (res.status >= 400 && res.status < 500 && res.status !== 429) {
          console.error("Client side error ", res);
        }
      },
      onmessage(event) {
        const parsedData: Emulator[] = JSON.parse(event.data);
        useEmulatorStore.getState().updateEmulators(parsedData);
      },
      onclose() {
        console.warn("Connection closed by the server");
      },
      onerror(err) {
        console.error("There was an error from the server", err);
      },
      signal: ctrl.signal,
    });
    get().eventSource = ctrl;
  },
  logout: () => {
    console.log("logout");
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
      devices.forEach((twillioDevice: TwillioDevice | null) => {
        twillioDevice?.device?.destroy();
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
