import React, { useEffect, useRef, useState } from 'react'
import { useEmulatorStore } from '../../../../stores/emulator/store.tsx'
import EmulatorMarkerDirection from '../Markers/EmulatorMarkerDirection.jsx'
import EmulatorMarkerSelected from '../Markers/EmulatorMarkerSelected.jsx'

export function ConnectedEmulatorComponent() {
  const connectedEmulatorRef = useRef(
    useEmulatorStore.getState().connectedEmulator
  )
  const selectedEmulator = useEmulatorStore((state) => state.selectedEmulator)
  const [showThis, setShowThis] = useState(false)

  useEffect(() => {
    useEmulatorStore.subscribe(
      (state) => state.connectedEmulator,
      (connectedEmulator) => {
        if (connectedEmulator !== null && connectedEmulator !== undefined) {
          if (!showThis) {
            setShowThis(true)
          }
        } else {
          setShowThis(false)
        }
        connectedEmulatorRef.current = connectedEmulator
      }
    )
    selectedEmulator === null || selectedEmulator === undefined ? setShowThis(false) : setShowThis(true)
  }, [selectedEmulator])

  console.log('showThistesting:', selectedEmulator?.tripStatus)

  return (
    <>
      {showThis && (
        <>
          <EmulatorMarkerSelected />
          <EmulatorMarkerDirection />
        </>
      )}
    </>
  )
}
