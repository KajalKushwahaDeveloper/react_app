import React from 'react'
import useMarkerStore from '../../../../stores/emulator/markerStore.js'
import EmulatorMarker from './EmulatorMarker.jsx'

const EmulatorMarkers = () => {
  const items = useMarkerStore((state) => state.items)

  return (
    <>
      {items?.map((id) => {
        return <EmulatorMarker key={id} id={id} />
      })}
    </>
  )
}

export default EmulatorMarkers
