import React, {
  useEffect,
  useState,
  useRef,
} from "react";
import useFetch from "./hooks/useFetch";
import {
  TRIP_STOPS_URL,
  TRIP_POINTS_URL,
  TRIP_URL,
} from "./constants";

import { toast } from "react-toastify";
import { useEmulatorStore } from "./store.tsx";

export const StatesContext = React.createContext({});

const useStates = () => {
  const {
    AssignedTelephoneNumber,
    setAssignedTelephoneNumber,
    isTableVisible,
    setIsTableVisible,
    hoveredMarker,
    setHoveredMarker,
    showToast,
  } = React.useContext(StatesContext);
  return {
    AssignedTelephoneNumber,
    setAssignedTelephoneNumber,
    isTableVisible,
    setIsTableVisible,
    hoveredMarker,
    setHoveredMarker,
    showToast,
  };
};

export { useStates };

export const StateProvider = ({ children }) => {
  const refreshEmulators = useEmulatorStore((state) => state.refreshEmulators);

  const [AssignedTelephoneNumber, setAssignedTelephoneNumber] = useState(0);

  const [isTableVisible, setIsTableVisible] = useState(false);

  const [hoveredMarker, setHoveredMarker] = useState(null);

  const showToast = (message, type) => {
    console.log("Showing toast...");
    toast[type](message); // Use the 'type' argument to determine the toast type
  };

  const emulatorIntervalRef = useRef(null);
  // Auto refresh emulators
  useEffect(() => {
    let emulatorInterval;
    const startEmulatorInterval = () => {
      const token = localStorage.getItem("token");
      if(token===null) {
        console.log("Auto refresh emulators -> Token is null");
        return;
      }
      emulatorInterval = setInterval(async () => {
        // Manually trigger the fetch to get the latest emulator data
        refreshEmulators();
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
  }, [refreshEmulators]);

  return (
    <StatesContext.Provider
      value={{
        AssignedTelephoneNumber,
        setAssignedTelephoneNumber,
        isTableVisible,
        setIsTableVisible,
        hoveredMarker,
        setHoveredMarker,
        showToast,
      }}
    >
      {children}
    </StatesContext.Provider>
  );
};
