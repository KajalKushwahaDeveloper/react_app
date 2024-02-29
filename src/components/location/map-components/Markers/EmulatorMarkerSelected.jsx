import { Marker } from '@react-google-maps/api'
import React, { useEffect, useRef } from 'react'
import {
  MAXIMUM_VELOCITY_METERS_PER_MILLISECONDS,
  MINIMUM_VELOCITY_METERS_PER_MILLISECONDS
} from '../../../../MetricsConstants.js'
import { useEmulatorStore } from '../../../../stores/emulator/store.tsx'

const EmulatorMarkerSelected = () => {
  console.log('Selected Marker Created!')
  const markerRef = useRef(null)
  const dragEmulator = useEmulatorStore.getState().dragEmulator
  const moveEmulator = useEmulatorStore.getState().moveEmulator

  const emulatorRef = useRef(useEmulatorStore.getState().connectedEmulator)
  const movedEmulatorRef = useRef(useEmulatorStore.getState().movedEmulator)
  const draggedEmulatorRef = useRef(useEmulatorStore.getState().draggedEmulator)

  useEffect(
    () =>
      useEmulatorStore.subscribe(
        (state) => state.movedEmulator,
        (movedEmulator) => {
          if (markerRef.current === null || markerRef.current === undefined) {
            return
          }
          if (
            emulatorRef.current === null ||
            emulatorRef.current === undefined
          ) {
            return
          }
          // moved
          if (movedEmulator && movedEmulator.moveMarker === true) {
            const movedToPosition = new window.google.maps.LatLng(
              movedEmulator.latitude,
              movedEmulator.longitude
            )
            markerRef.current?.setPosition(movedToPosition)
            markerRef.current?.setAnimation(window.google.maps.Animation.BOUNCE)

            // do something maybe
          } else if (movedEmulator && movedEmulator.moveMarker === false) {
            // un-moved..
            // reset markerRef
            const newPosition = new window.google.maps.LatLng(
              emulatorRef.current?.latitude,
              emulatorRef.current?.longitude
            )
            markerRef.current?.setPosition(newPosition)
            markerRef.current?.setAnimation(null)
          }
          movedEmulatorRef.current = movedEmulator
        }
      ),
    []
  )

  useEffect(
    () =>
      useEmulatorStore.subscribe(
        (state) => state.draggedEmulator,
        (draggedEmulator) => {
          draggedEmulatorRef.current = draggedEmulator
          if (markerRef.current === null || markerRef.current === undefined) {
            return
          }
          if (draggedEmulator === null || draggedEmulator === undefined) {
            const position = new window.google.maps.LatLng(
              emulatorRef.current?.latitude,
              emulatorRef.current?.longitude
            )
            markerRef.current?.setPosition(position)
          }
        }
      ),
    []
  )

  useEffect(
    () =>
      useEmulatorStore.subscribe(
        (state) => state.connectedEmulator,
        (connectedEmulator) => {
          if (markerRef.current === null || markerRef.current === undefined) {
            return
          }
          if (!connectedEmulator || connectedEmulator === undefined) {
            return
          }
          // if current marker is being dragged or moved, skip
          if (
            draggedEmulatorRef.current?.emulator?.id === connectedEmulator.id ||
            movedEmulatorRef?.emulator?.id === connectedEmulator.id
          ) {
            return
          }

          emulatorRef.current = connectedEmulator

          const newPosition = new window.google.maps.LatLng(
            emulatorRef.current?.latitude,
            emulatorRef.current?.longitude
          )
          markerRef.current?.setPosition(newPosition)
          // TODO: use animation instead

          let iconUrl = `images/${emulatorRef.current?.tripStatus}/`
          iconUrl = iconUrl + 'SELECT' // check velocity and add flash if velocity is greater than MAXIMUM_VELOCITY_METERS_PER_MILLISECONDS or less than MINIMUM_VELOCITY_METERS_PER_MILLISECONDS
          if (
            emulatorRef.current?.velocity >
              MAXIMUM_VELOCITY_METERS_PER_MILLISECONDS ||
            emulatorRef.current?.velocity <
              MINIMUM_VELOCITY_METERS_PER_MILLISECONDS
          ) {
            iconUrl = `${iconUrl}/FLASH`
          }
          iconUrl = `${iconUrl}/${emulatorRef.current?.status}.svg`
          console.log(iconUrl)
          const emulatorIcon = {
            url: iconUrl,
            scaledSize: new window.google.maps.Size(20, 20),
            anchor: new window.google.maps.Point(10, 10)
          }

          markerRef.current?.setIcon(emulatorIcon)

          // Update marker title
          const title = `${emulatorRef.current?.telephone} ${emulatorRef.current?.tripStatus}(${emulatorRef.current?.status})`
          markerRef.current?.setTitle(title)
        }
      ),
    []
  )

  let iconUrl = `images/${emulatorRef.current?.tripStatus}/`
  iconUrl = iconUrl + 'SELECT'
  if (
    emulatorRef.current?.velocity > MAXIMUM_VELOCITY_METERS_PER_MILLISECONDS ||
    emulatorRef.current?.velocity < MINIMUM_VELOCITY_METERS_PER_MILLISECONDS
  ) {
    iconUrl = `${iconUrl}/FLASH`
  }
  iconUrl = `${iconUrl}/${emulatorRef.current?.status}.svg`

  const emulatorIcon = {
    url: iconUrl,
    scaledSize: new window.google.maps.Size(20, 20),
    anchor: new window.google.maps.Point(10, 10)
  }

  return (
    <>
      <Marker
        key={emulatorRef.current?.id}
        icon={emulatorIcon}
        position={{
          lat: emulatorRef.current?.latitude,
          lng: emulatorRef.current?.longitude
        }}
        onLoad={(marker) => (markerRef.current = marker)}
        title={`${emulatorRef.current?.telephone} ${emulatorRef.current?.tripStatus}(${emulatorRef.current?.status})`}
        labelStyle={{
          textAlign: 'center',
          width: 'auto',
          color: '#037777777777',
          fontSize: '11px',
          padding: '0px'
        }}
        labelAnchor={{ x: 'auto', y: 'auto' }}
        // onClick={() => selectEmulator(emulator)}
        draggable={true}
        onDragStart={(event) => {
          // remove any animation on marker
          markerRef.current?.setAnimation(null)
          const { latLng } = event
          dragEmulator({
            emulator: emulatorRef.current,
            latitude: latLng.lat(),
            longitude: latLng.lng(),
            isDragMarkerDropped: false
          })
          // if drag started from a MovedEmulator, reset moveMarker to false
          if (
            movedEmulatorRef.current?.emulator?.id ===
              emulatorRef.current?.id &&
            movedEmulatorRef.current?.moveMarker === true
          ) {
            moveEmulator({
              emulator: emulatorRef.current,
              latitude: emulatorRef.current.latitude,
              longitude: emulatorRef.current.longitude,
              moveMarker: false
            })
          }
        }}
        onDragEnd={(event) => {
          const { latLng } = event
          dragEmulator({
            emulator: emulatorRef.current,
            latitude: latLng.lat(),
            longitude: latLng.lng(),
            isDragMarkerDropped: true
          })
        }}
        zIndex={1}
      />
    </>
  )
}

export default EmulatorMarkerSelected
