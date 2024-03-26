import React from 'react'
import useMarkerStore from '../../../../stores/emulator/markerStore.js'
import { useEmulatorStore } from '../../../../stores/emulator/store.tsx'
import EmulatorMarker from './EmulatorMarker.jsx'

const EmulatorMarkers = () => {
  const items = useMarkerStore((state) => state.items)
  const selectedEmulator = useEmulatorStore((state) => state.selectedEmulator)

  const copyEmulator = [...items]

  const indexEmulator = selectedEmulator?.id
  const index = copyEmulator.indexOf(indexEmulator)

  let itemEmulatorIds
  if (indexEmulator) {
    if (index > -1) {
      copyEmulator.splice(index, 1)
    }
    itemEmulatorIds = copyEmulator
  } else {
    itemEmulatorIds = items
  }

  return (
    <>
      {itemEmulatorIds?.map((id) => {
        return <EmulatorMarker key={id} id={id} />
      })}
    </>
  )
}

export default EmulatorMarkers
