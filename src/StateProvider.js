import React, {
  useEffect,
  useState,
  useRef,
} from "react";

import useFetch from "./hooks/useFetch";
import { toast } from "react-toastify";
import { EMULATOR_URL } from "./constants.js";
import { useEmulatorStore } from "./stores/emulator/store.tsx";

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

  const { data: staticEmulators } = useFetch(EMULATOR_URL);

  const [AssignedTelephoneNumber, setAssignedTelephoneNumber] = useState(0);

  const [isTableVisible, setIsTableVisible] = useState(false);

  const [hoveredMarker, setHoveredMarker] = useState(null);

  const showToast = (message, type) => {
    console.log("Showing toast...");
    toast[type](message); // Use the 'type' argument to determine the toast type
  };

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
