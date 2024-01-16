import { create, StateCreator } from "zustand";
import { devtools } from "zustand/middleware";
import { DragEmulator, Emulator, TripData, TripPoint } from "./types.tsx";
import { SelectedEmulatorData, toTripData } from "./SelectedEmulatorData.tsx";
import {
  Center,
  defaultLng,
  defaultLat,
} from "./types_maps.tsx";
import { BASE_URL, EMULATOR_URL } from "../../constants";
import { deviceStore, createDeviceSlice } from "../call/storeCall.tsx";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import { TwillioDevice } from "../call/types.tsx";
import { EmulatorEvent } from "../../model/EmulatorEvent.tsx";

export interface EmulatorsSlice {
  isLoading: boolean;
  emulatorsEventSource: AbortController | null;
  selectedEmulatorEventSource: AbortController | null;
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
  connectedEmulator: Emulator | null;
  center: Center;
  tripData: TripData | null;
  pathTraveled: TripPoint[] | null;
  pathNotTraveled: TripPoint[] | null;
  connectSelectedEmulatorSSE: (selectedEmulator: Emulator | null) => void;
  setSelectedEmulatorSSEData: (selectedEmulatorData: SelectedEmulatorData | null) => void;
  setPaths: (emulator: Emulator, tripData: TripData) => void;
}

interface SharedSlice {
  connectEmulatorsSSE: () => void;
  logout: () => void;
  getBoth: () => void;
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
      set({ center: { lat: emulator.latitude, lng: emulator.longitude } });
    }
    // if same as selectedEmulator, then do nothing..
    if (emulator === get().selectedEmulator || emulator?.id === get().selectedEmulator?.id) {
      return;
    }

    set({ selectedEmulator: emulator });
    get().connectSelectedEmulatorSSE(emulator);
  },
  hoverEmulator: (emulator) => set({ hoveredEmulator: emulator }),
  dragEmulator: (dragEmulatorRequest) => set({ dragEmulatorRequest }),
  updateEmulators: (newEmulators) => {
    // NOTE: Realistically, there will be emulators being updated all the time.. Don't need to check if they are the same
    // const isUpdatedEmulators = compareEmulatorsCompletely(
    //   get().emulators,
    //   newEmulators
    // );

    // if (isUpdatedEmulators === false) {
    //   return;
    // }

    // TODO: This will be changed to SSE fetching selected Emulator Details
    // const selectedEmulatorOld = get().selectedEmulator;
    // if (selectedEmulatorOld !== null && selectedEmulatorOld !== undefined) {
    //   const selectedEmulatorNew = newEmulators?.find(
    //     (newEmulator) => selectedEmulatorOld.id === newEmulator.id
    //   );
    //   if (selectedEmulatorNew && selectedEmulatorNew !== undefined) {
    //     if (
    //       selectedEmulatorNew.currentTripPointIndex !== null &&
    //       selectedEmulatorOld.currentTripPointIndex !== null &&
    //       selectedEmulatorNew.currentTripPointIndex !==
    //         selectedEmulatorOld.currentTripPointIndex
    //     ) {
    //       get().fetchTripData(selectedEmulatorNew);
    //     }
    //     set({ selectedEmulator: selectedEmulatorNew });
    //   }
    // }
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
  connectedEmulator: null,
  connectSelectedEmulatorSSE: (selectedEmulator: Emulator | null) => {
    const selectedEmulatorEventSource = get().selectedEmulatorEventSource;
    if ((selectedEmulator === null || selectedEmulator === undefined)) {
      selectedEmulatorEventSource?.abort(); // abort the emulatorsEventSource
      set({ connectedEmulator: null, tripData: null, pathTraveled: null, pathNotTraveled: null, selectedEmulatorEventSource: null }); // clear trip data
      return
    }
    // We connect to the emulator's SSE
    const token = localStorage.getItem("token");
    const ctrl = new AbortController();
    console.log("Connecting to SSE", `${BASE_URL}/sse/${selectedEmulator?.id}`);
    set({ isLoading: true });
    fetchEventSource(`${BASE_URL}/sse/${selectedEmulator?.id}`, {
      method: "GET",
      headers: {
        Accept: "text/event-stream",
        Authorization: `Bearer ${token}`,
      },
      onopen: async (res: Response) => {
        if (res.status >= 400 && res.status < 500 && res.status !== 429) {
          console.error("Client side error ", res);
        }
        set({ isLoading: false });
      },
      onmessage(event) {
        console.log("onmessage", event.event);
        // check event.event with EmulatorEvent
        if (event.event === EmulatorEvent.EMULATOR_CONNECTED_NO_TRIP) {
          const emulatorData: SelectedEmulatorData = JSON.parse(event.data);
          set({ connectedEmulator: emulatorData.emulatorDetails });
        } else if (event.event === EmulatorEvent.EMULATOR_CONNECTED || event.event === EmulatorEvent.EMULATOR_TRIP_DETAILS_UPDATED) {
          const emulatorData: SelectedEmulatorData = JSON.parse(event.data);
          get().setSelectedEmulatorSSEData(emulatorData);
          set({ center: { lat: emulatorData?.emulatorDetails?.latitude, lng: emulatorData?.emulatorDetails?.longitude } });
        } else if (event.event === EmulatorEvent.EMULATOR_LOCATION_UPDATED) {
          const emulatorData: SelectedEmulatorData = JSON.parse(event.data);
          set({ connectedEmulator: emulatorData?.emulatorDetails });
          var tripData = get().tripData;
          if (tripData !== null) {
            get().setPaths(emulatorData?.emulatorDetails, tripData);
          }
        }
      },
      onclose() {
        console.warn("Connection closed by the server");
        set({ isLoading: false });
      },
      onerror(err) {
        console.log("err", err)
        console.error("There was an error from the server", err);
        set({ isLoading: false });
      },
      signal: ctrl.signal,
    });
    get().selectedEmulatorEventSource = ctrl;
  },
  setSelectedEmulatorSSEData: (selectedEmulatorData: SelectedEmulatorData | null) => {
    if (selectedEmulatorData === null) {
      // TODO: Handle this case
      return
    }
    const tripData = toTripData(selectedEmulatorData);
    const tripPoints = tripData?.tripPoints;
    console.log("tripPoints", tripPoints.length, "expected : 69053");
    console.log("count", tripPoints, "expected : 30859");
    const tripPointCombinedDistance = tripPoints.reduce((acc, tripPoint) => acc + tripPoint.distance, 0);
    console.log("distance", tripPointCombinedDistance, "expected : 4799824/4798271.0");
    // WITH SUB POINTS
    // points size: 81056
    // distance: 5314352

    // WITHOUT SUB POINTS
    // points size: 38197
    // distance: 4799123
    set({ connectedEmulator: selectedEmulatorData?.emulatorDetails, tripData: tripData });
    get().setPaths(selectedEmulatorData?.emulatorDetails, tripData);
  },
  setPaths: (sseEmulator: Emulator, tripData: TripData) => {
    let pathTraveledIndex = sseEmulator.currentTripPointIndex + 1;
    let pathNotTraveledIndex = sseEmulator?.currentTripPointIndex;
    if (sseEmulator?.currentTripPointIndex < 0) {
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
  connectEmulatorsSSE: () => {
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
    get().emulatorsEventSource = ctrl;
  },
  logout: () => {
    localStorage.removeItem("token");
    get().emulatorsEventSource?.abort();
    set({ emulatorsEventSource: null, emulators: [], selectedEmulator: null });
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
