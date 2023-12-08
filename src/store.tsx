import create from 'zustand';
import { Emulator, TripData } from './types';
import { EMULATOR_URL, TRIP_URL } from './constants';


interface EmulatorStore {
    emulators: Emulator[];
    selectedEmulator: Emulator | null;
    tripData: TripData | null;
    fetchEmulators: () => Promise<void>;
    selectEmulator: (emulator: Emulator) => void;
    fetchTripData: () => Promise<void>;
    refreshEmulators: () => Promise<void>;
}

export const useEmulatorStore = create<EmulatorStore>((set, get) => ({
    emulators: [],
    selectedEmulator: null,
    tripData: null,
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
            console.log("V2", emulators);
            set({ emulators });
        } catch (error) {
            console.error('V2 Failed to fetch emulators:', error);
        }
    },
    selectEmulator: (emulator) => {
        set({ selectedEmulator: emulator });
    },
    fetchTripData: async () => {
        const { selectedEmulator } = get();
        if (selectedEmulator) {
            try {
                const response = await fetch(TRIP_URL, {
                    method: "GET",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${token}`,
                    },
                  });
                const tripData = await response.json();
                set({ tripData });
            } catch (error) {
                console.error('Failed to fetch trip data:', error);
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
            console.error('V2 Failed to fetch emulators:', error);
        }
    },
}));
