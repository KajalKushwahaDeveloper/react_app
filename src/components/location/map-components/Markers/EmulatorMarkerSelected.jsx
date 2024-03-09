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
  const draggedEmulatorsRef = useRef(
    useEmulatorStore.getState().draggedEmulators
  )

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
            markerRef.current?.setAnimation(window.google.maps.Animation.DROP)

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
        (state) => state.draggedEmulators,
        (draggedEmulators) => {
          draggedEmulatorsRef.current = draggedEmulators
          // if there is a draggedEmulator inside draggedEmulatorsRef whose emulator.id == connectedEmulator.id, then set dragEmulatorRef to that draggedEmulator
          const draggedEmulator = draggedEmulatorsRef.current.find(
            (draggedEmulator) =>
              draggedEmulator.emulator.id === emulatorRef.current?.id
          )
          if (draggedEmulator) {
            draggedEmulatorRef.current = draggedEmulator
          } else {
            draggedEmulatorRef.current = null
          }
          if (markerRef.current === null || markerRef.current === undefined) {
            return
          }
          if (draggedEmulator === null || draggedEmulator === undefined) {
            const position = new window.google.maps.LatLng(
              emulatorRef.current?.latitude,
              emulatorRef.current?.longitude
            )
            markerRef.current?.setPosition(position)
          } else {
            // NOTE: this will not be able to switch position of when already dragged, and then get's selected.
            // For that behavior, we need to make the default position of the marker to be the draggedEmulator position when selected. [#1]
            // if draggedEmulator is not null, then set the marker position to draggedEmulator position
            const position = new window.google.maps.LatLng(
              draggedEmulator.latitude,
              draggedEmulator.longitude
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

  function handleDragStart(event) {
    // remove any animation on marker
    markerRef.current?.setAnimation(null)
    const { latLng } = event
    dragEmulator({
      emulator: emulatorRef.current,
      latitude: latLng.lat(),
      longitude: latLng.lng(),
      isDragMarkerDropped: false,
      timeout: -1
    })
    // if drag started from a MovedEmulator, reset moveMarker to false
    if (
      movedEmulatorRef.current?.emulator?.id === emulatorRef.current?.id &&
      movedEmulatorRef.current?.moveMarker === true
    ) {
      moveEmulator({
        emulator: emulatorRef.current,
        latitude: emulatorRef.current.latitude,
        longitude: emulatorRef.current.longitude,
        moveMarker: false
      })
    }
  }

  function handleDragEnd(event) {
    const { latLng } = event
    dragEmulator({
      emulator: emulatorRef.current,
      latitude: latLng.lat(),
      longitude: latLng.lng(),
      isDragMarkerDropped: true,
      timeout: 150
    })
  }

  return (
    <>
      <Marker
        key={emulatorRef.current?.id}
        icon={emulatorIcon}
        // [#1]
        position={{
          lat: draggedEmulatorRef.current
            ? draggedEmulatorRef.current.latitude
            : emulatorRef.current?.latitude,
          lng: draggedEmulatorRef.current
            ? draggedEmulatorRef.current.longitude
            : emulatorRef.current?.longitude
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
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        zIndex={1}
      />
    </>
  )
}

export default EmulatorMarkerSelected
