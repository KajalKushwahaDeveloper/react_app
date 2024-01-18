import React, { useState } from "react";

import useFetch from "./hooks/useFetch";
import { toast } from "react-toastify";
import { EMULATOR_URL } from "./constants.js";

export const StatesContext = React.createContext({});

const useStates = () => {
  const {
    staticEmulators,
    isTableVisible,
    setIsTableVisible,
    isMoveDialogVisible,
    setIsMoveDialogVisible,
    hoveredMarker,
    setHoveredMarker,
    showToast,
  } = React.useContext(StatesContext);
  return {
    staticEmulators,
    isTableVisible,
    setIsTableVisible,
    isMoveDialogVisible,
    setIsMoveDialogVisible,
    hoveredMarker,
    setHoveredMarker,
    showToast,
  };
};

export { useStates };

export const StateProvider = ({ children }) => {
  const { data: staticEmulators } = useFetch(EMULATOR_URL);

  const [isMoveDialogVisible, setIsMoveDialogVisible] = useState(false);

  const [isTableVisible, setIsTableVisible] = useState(false);

  const [hoveredMarker, setHoveredMarker] = useState(null);

  const showToast = (message, type) => {
    toast[type](message); // Use the 'type' argument to determine the toast type
  };

  return (
    <StatesContext.Provider
      value={{
        staticEmulators,
        isTableVisible,
        setIsTableVisible,
        isMoveDialogVisible,
        setIsMoveDialogVisible,
        hoveredMarker,
        setHoveredMarker,
        showToast,
      }}
    >
      {children}
    </StatesContext.Provider>
  );
};
