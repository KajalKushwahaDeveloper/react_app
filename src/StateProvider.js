import React, { useCallback, useState } from 'react'

import { toast } from 'react-toastify'
import { EMULATOR_URL } from './constants.js'
import useFetch from './hooks/useFetch'

export const StatesContext = React.createContext({})

// FIXME: Need to get rid of this or somehow make these(need to check other states behavior. showToast is confirmed to cause rerenders)
// stop causing rerenders like showToast is causing

const useStates = () => {
  const {
    staticEmulators,
    isTableVisible,
    setIsTableVisible,
    isMoveDialogVisible,
    setIsMoveDialogVisible,
    hoveredMarker,
    setHoveredMarker,
    showToast
  } = React.useContext(StatesContext)
  return {
    staticEmulators,
    isTableVisible,
    setIsTableVisible,
    isMoveDialogVisible,
    setIsMoveDialogVisible,
    hoveredMarker,
    setHoveredMarker,
    showToast
  }
}

export { useStates }

export const StateProvider = ({ children }) => {
  const { data: staticEmulators } = useFetch(EMULATOR_URL)

  const [isMoveDialogVisible, setIsMoveDialogVisible] = useState(false)

  const [isTableVisible, setIsTableVisible] = useState(false)

  const [hoveredMarker, setHoveredMarker] = useState(null)

  const showToast = useCallback((message, type) => {
    toast[type](message) // Use the 'type' argument to determine the toast type
  }, [])

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
        showToast
      }}
    >
      {children}
    </StatesContext.Provider>
  )
}
