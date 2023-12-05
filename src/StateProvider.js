import React, {
  useEffect,
  useState,
  useRef,
  useMemo,
  useCallback,
} from "react";
import useFetch from "./hooks/useFetch";
import {
  TRIP_STOPS_URL,
  TRIP_POINTS_URL,
  EMULATOR_URL,
  TRIP_URL,
  WEBHOOK_CONNECTED_EMULATORS_URL,
} from "./constants";
import ApiService from "./ApiService";

export const StatesContext = React.createContext({});

const useStates = () => {
  const {
    selectedEmId,
    paths,
    stops,
    tripData,
    emulators,
    setEmulators,
    emulator,
    setEmulator,
    setSelectedEmId,
    pathsRoute,
    setPathsRoute,
    selectedEmulator,
    setSelectedEmulator,
    AssignedTelephoneNumber,
    setAssignedTelephoneNumber,
    isTableVisible,
    setIsTableVisible,
    validateEmulatorsData,
    hoveredMarker,
    setHoveredMarker,
  } = React.useContext(StatesContext);
  return {
    selectedEmId,
    paths,
    stops,
    tripData,
    emulators,
    setEmulators,
    emulator,
    setEmulator,
    setSelectedEmId,
    pathsRoute,
    setPathsRoute,
    selectedEmulator,
    setSelectedEmulator,
    AssignedTelephoneNumber,
    setAssignedTelephoneNumber,
    isTableVisible,
    setIsTableVisible,
    validateEmulatorsData,
    hoveredMarker,
    setHoveredMarker,
  };
};

export { useStates };

export const StateProvider = ({ children }) => {
  const [selectedEmId, setSelectedEmId] = useState(null);
  const { data: paths } = useFetch(TRIP_POINTS_URL + `/${selectedEmId}`);
  const { data: stops } = useFetch(TRIP_STOPS_URL + `/${selectedEmId}`);
  const { data: tripData } = useFetch(TRIP_URL + `/${selectedEmId}`);
  const { data: emulators, setData: setEmulators } = useFetch(EMULATOR_URL);
  const { data: emulator, setData: setEmulator } = useFetch(
    EMULATOR_URL + `/${selectedEmId}`
  );

  const [pathsRoute, setPathsRoute] = useState(null);
  const [selectedEmulator, setSelectedEmulator] = useState(null);
  const [AssignedTelephoneNumber, setAssignedTelephoneNumber] = useState(0);

  const [isTableVisible, setIsTableVisible] = useState(false);

  const [hoveredMarker, setHoveredMarker] = useState(null);
  let emulatorInterval;

  const validateEmulatorsData = (newEmulatorsData, newEmulatorData) => {
    var selectedEmulatorToValidate = null;
    if (newEmulatorData) {
      if (newEmulatorData.id === selectedEmId) {
        selectedEmulatorToValidate = newEmulatorData;
      }
      const updatedEmulators = emulators.map((oldEmulator) => {
        if (oldEmulator.id === newEmulatorData.id) {
          const isOldEmulatorChanged =
            oldEmulator.latitude !== newEmulatorData.latitude ||
            oldEmulator.longitude !== newEmulatorData.longitude ||
            oldEmulator.tripStatus !== newEmulatorData.tripStatus ||
            oldEmulator.address !== newEmulatorData.address ||
            oldEmulator.status !== newEmulatorData.status ||
            oldEmulator.currentTripPointIndex !==
              newEmulatorData.currentTripPointIndex;

          if (isOldEmulatorChanged) {
            return {
              ...oldEmulator,
              ...newEmulatorData,
            };
          }
        }
        return oldEmulator;
      });
      setEmulators(updatedEmulators);
    }

    if (newEmulatorsData) {
      selectedEmulatorToValidate = newEmulatorsData.find(
        (item) => item.id === selectedEmId
      );
      const updatedEmulators = emulators?.map((oldEmulator) => {
        const newEmulatorData = newEmulatorsData.find(
          (item) => item.id === oldEmulator.id
        );
        if (newEmulatorData) {
          const isOldEmulatorChanged =
            oldEmulator.latitude !== newEmulatorData.latitude ||
            oldEmulator.longitude !== newEmulatorData.longitude ||
            oldEmulator.tripStatus !== newEmulatorData.tripStatus ||
            oldEmulator.address !== newEmulatorData.address ||
            oldEmulator.status !== newEmulatorData.status ||
            oldEmulator.currentTripPointIndex !==
              newEmulatorData.currentTripPointIndex;

          if (isOldEmulatorChanged) {
            return {
              ...oldEmulator,
              ...newEmulatorData,
            };
          }
        }
        return oldEmulator;
      });
      setEmulators(updatedEmulators);
    }

    if (selectedEmulatorToValidate) {
      validateEmulatorData(selectedEmulatorToValidate);
    }
  };

  const validateEmulatorData = (newEmulatorData) => {
    if (newEmulatorData === null || newEmulatorData === undefined) {
      return;
    }
    const {
      latitude,
      longitude,
      status,
      tripStatus,
      address,
      currentTripPointIndex,
    } = newEmulatorData;

    if (newEmulatorData.id === selectedEmId) {
      // Validate old selected emulator
      const isEmulatorChanged =
        emulator.latitude !== latitude ||
        emulator.longitude !== longitude ||
        emulator.tripStatus !== tripStatus ||
        emulator.address !== address ||
        emulator.status !== status ||
        emulator.currentTripPointIndex !== currentTripPointIndex;
      if (isEmulatorChanged) {
        console.log("Old Emulator Updated!");
        setEmulator(newEmulatorData);
      }
    }
  };

  const startEmulatorInterval = () => {
    const token = localStorage.getItem("token");
    emulatorInterval = setInterval(async () => {
      // Manually trigger the fetch to get the latest emulator data
      const { success, data, error } = await ApiService.makeApiCall(
        EMULATOR_URL,
        "GET",
        null,
        token
      );
      if (success) {
        validateEmulatorsData(data, null);
      } else {
        console.log("old Emulator ERROR : ", error);
      }
    }, 5000);
  };

  const emulatorIntervalRef = useRef(null);
  // Auto refresh emulators
  useEffect(() => {
    let emulatorInterval;
    const startEmulatorInterval = () => {
      const token = localStorage.getItem("token");
      emulatorInterval = setInterval(async () => {
        // Manually trigger the fetch to get the latest emulator data
        const { success, data, error } = await ApiService.makeApiCall(
          EMULATOR_URL,
          "GET",
          null,
          token
        );
        if (success) {
          validateEmulatorsData(data, null);
        } else {
          console.log("old Emulator ERROR : ", error);
        }
        // Manually trigger the Update web Hook Connected Emulators
        const payload = { emulators };
        const { success2, data2, error2 } = await ApiService.makeApiCall(
          WEBHOOK_CONNECTED_EMULATORS_URL,
          "POST",
          payload,
          token
        );
        if (success2) {
          console.log("Successfully Updated web Hook Connected Emulators", data2);
        } else {
          console.log("ERROR during web Hook Connected Emulators Update : ", error2);
        }
      }, 5000);
    };

    const stopEmulatorInterval = () => {
      clearInterval(emulatorInterval);
    };

    emulatorIntervalRef.current = {
      start: startEmulatorInterval,
      stop: stopEmulatorInterval,
    };
    // Start the emulator interval
    emulatorIntervalRef.current.start();

    return () => {
      stopEmulatorInterval();
    };
  }, [emulator, emulators, setEmulator, setEmulators]);

  return (
    <StatesContext.Provider
      value={{
        selectedEmId,
        paths,
        stops,
        tripData,
        emulators,
        setEmulators,
        emulator,
        setEmulator,
        setSelectedEmId,
        pathsRoute,
        setPathsRoute,
        selectedEmulator,
        setSelectedEmulator,
        AssignedTelephoneNumber,
        setAssignedTelephoneNumber,
        isTableVisible,
        setIsTableVisible,
        validateEmulatorsData,
        hoveredMarker,
        setHoveredMarker,
      }}
    >
      {children}
    </StatesContext.Provider>
  );
};
