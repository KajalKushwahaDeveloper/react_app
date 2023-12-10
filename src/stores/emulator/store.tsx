import { create, StateCreator } from "zustand";
import { devtools } from "zustand/middleware";
import { Emulator, TripData, TripPoint } from "./types";
import { EMULATOR_URL, TRIP_URL } from "../../constants";
import { deviceStore, createDeviceSlice } from "../call/storeCall.tsx";

export interface EmulatorsSlice {
  emulators: Emulator[] | [];
  selectedEmulator: Emulator | null;
  fetchEmulators: () => Promise<void>;
  selectEmulator: (selectedEmulator: Emulator | null) => void;
}

export interface TripDataSlice {
  // latitude: number | null;
  // longitude: number | null;
  tripData: TripData | null;
  pathTraveled: TripPoint[] | null;
  pathNotTraveled: TripPoint[] | null;
  setTripData: (selectedEmulator: Emulator | null) => Promise<void>;
}

interface SharedSlice {
  addBoth: () => void;
  getBoth: () => void;
}

const createEmulatorsSlice: StateCreator<
  EmulatorsSlice & TripDataSlice,
  [],
  [],
  EmulatorsSlice
> = (set, get) => ({
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
  selectEmulator: (selectedEmulator) => {
    set({ selectedEmulator: selectedEmulator });
    get().setTripData(selectedEmulator);
  },
});

const createTripDataSlice: StateCreator<
  EmulatorsSlice & TripDataSlice,
  [],
  [],
  TripDataSlice
> = (set, get) => ({
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
        set({ tripData, pathTraveled, pathNotTraveled });
      } catch (error) {
        console.error("Failed to fetch trip data:", error);
      }
    }
  },
});

const createSharedSlice: StateCreator<
  EmulatorsSlice & TripDataSlice,
  [],
  [],
  SharedSlice
> = (set, get) => ({
  addBoth: () => {
    // you can reuse previous methods
    // get().fetchEmulators()
    // get().setTripData(0)
    // or do them from scratch
    // set((state) => ({ bears: state.bears + 1, fishes: state.fishes + 1 })
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
