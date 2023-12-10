import React, {
  useEffect,
  useState,
  useRef,
} from "react";

import useFetch from "./hooks/useFetch";
import { toast } from "react-toastify";
import { useEmulatorStore } from "./store.tsx";
import { EMULATOR_URL } from "./constants.js";

export const StatesContext = React.createContext({});

const useStates = () => {
  const {
    staticEmulators,
    AssignedTelephoneNumber,
    setAssignedTelephoneNumber,
    isTableVisible,
    setIsTableVisible,
    hoveredMarker,
    setHoveredMarker,
    showToast,
  } = React.useContext(StatesContext);
  return {
    staticEmulators,
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
  const fetchEmulators = useEmulatorStore((state) => state.fetchEmulators);
  const selectEmulator = useEmulatorStore((state) => state.selectEmulator);

  const { data: staticEmulators, setData: setStaticEmulators } = useFetch(EMULATOR_URL);

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
        fetchEmulators();
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
  }, [fetchEmulators]);

  return (
    <StatesContext.Provider
      value={{
        staticEmulators,
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
