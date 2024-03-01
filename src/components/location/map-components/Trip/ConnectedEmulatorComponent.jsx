import React, { useEffect, useRef, useState } from 'react'
import { useEmulatorStore } from '../../../../stores/emulator/store.tsx'
import EmulatorMarkerDirection from '../Markers/EmulatorMarkerDirection.jsx'
import EmulatorMarkerSelected from '../Markers/EmulatorMarkerSelected.jsx'

export function ConnectedEmulatorComponent() {
  console.log('Path component Created!')
  const connectedEmulatorRef = useRef(
    useEmulatorStore.getState().connectedEmulator
  )
  const [showThis, setShowThis] = useState(false)

  useEffect(() =>
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
  )

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
