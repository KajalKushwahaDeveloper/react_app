import create from "zustand";
import { Emulator, TripData, TripPoint } from "./types";
import { EMULATOR_URL, TRIP_URL } from "./constants";

interface EmulatorStore {
  emulators: Emulator[] | [];
  selectedEmulator: Emulator | null;
  tripData: TripData | null;
  pathTraveled: TripPoint[] | null;
  pathNotTraveled: TripPoint[] | null;
  fetchEmulators: () => Promise<void>;
  selectEmulator: (emulator: Emulator) => void;
  setTripData: (selectedEmulator: Emulator) => Promise<void>;
  refreshEmulators: () => Promise<void>;
}

export const useEmulatorStore = create<EmulatorStore>((set, get) => ({
  emulators: [],
  selectedEmulator: null,
  tripData: null,
  pathTraveled: null,
  pathNotTraveled: null,
  fetchEmulators: async () => {
    const token = localStorage.getItem("token");
    console.log("V2", token);
    try {
      const response = await fetch(EMULATOR_URL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const emulators = await response.json();
      set({ emulators });
    } catch (error) {
      console.error("V2 Failed to fetch emulators:", error);
    }
  },
  selectEmulator: (emulator) => {
    set({ selectedEmulator: emulator });
    get().setTripData(emulator);
  },
  setTripData: async (selectedEmulator: Emulator) => {
    const token = localStorage.getItem("token");
    if (selectedEmulator === null || selectedEmulator === undefined || token === null) {
      set({ tripData : null, pathTraveled: null, pathNotTraveled: null });
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
            const pathTraveled = tripData?.tripPoints?.slice(0, selectedEmulator?.currentTripPointIndex + 1);
            const pathNotTraveled = tripData?.tripPoints?.slice(selectedEmulator?.currentTripPointIndex);
            set({ tripData, pathTraveled, pathNotTraveled});
      } catch (error) {
        console.error("Failed to fetch trip data:", error);
      }
    }
  },
  refreshEmulators: async () => {
    const token = localStorage.getItem("token");
    console.log("V2", token);
    try {
      const response = await fetch(EMULATOR_URL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const emulators = await response.json();
      console.log("V2", emulators);
      set({ emulators });
    } catch (error) {
      console.error("V2 Failed to fetch emulators:", error);
    }
  },
}));
