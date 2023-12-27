import React, {
  useState,
} from "react";

import useFetch from "./hooks/useFetch";
import { toast } from "react-toastify";
import { EMULATOR_URL } from "./constants.js";

export const StatesContext = React.createContext({});

const useStates = () => {
  const {
    staticEmulators,
    isTableVisible,
    setIsTableVisible,
    hoveredMarker,
    setHoveredMarker,
    showToast,
  } = React.useContext(StatesContext);
  return {
    staticEmulators,
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
