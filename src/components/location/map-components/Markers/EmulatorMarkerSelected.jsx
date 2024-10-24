import { Marker } from '@react-google-maps/api'
import React, { useEffect, useRef, useState } from 'react'
import {
  MAXIMUM_VELOCITY_METERS_PER_MILLISECONDS,
  MINIMUM_VELOCITY_METERS_PER_MILLISECONDS
} from '../../../../MetricsConstants.js'
import { DRAG_TIMEOUT } from '../../../../constants.js'
import { useEmulatorStore } from '../../../../stores/emulator/store.tsx'

const EmulatorMarkerSelected = () => {
  const markerRef = useRef(null)
  const dragEmulator = useEmulatorStore.getState().dragEmulator
  const moveEmulator = useEmulatorStore.getState().moveEmulator

  const emulatorRef = useRef(useEmulatorStore.getState().connectedEmulator)
  const movedEmulatorRef = useRef(useEmulatorStore.getState().movedEmulator)
  const [isEmulatorOnTrip, setIsEmulatorOnTrip] = useState(false)

  // Retrieve from local storage if the emulator has an active trip
  // const isEmulatorOnTrip = localStorage.getItem('isEmulatorOnTrip') === 'true'

  const draggedEmulatorOnTripRef = useRef(
    useEmulatorStore.getState().draggedEmulatorOnTrip
  )
  const dragEmulatorOnTrip = useEmulatorStore.getState().dragEmulatorOnTrip

  const draggedEmulatorsRef = useRef(
    useEmulatorStore.getState().draggedEmulators
  )

  function isThisEmulatorDragged() {
    return (
      draggedEmulatorsRef.current.some(
        (draggedEmulator) =>
          draggedEmulator.emulator.id === emulatorRef.current?.id
      ) ||
      draggedEmulatorOnTripRef.current?.emulator?.id === emulatorRef.current?.id
    )
  }

  function isThisEmulatorMoved() {
    return movedEmulatorRef.current?.emulator?.id === emulatorRef.current?.id
  }

  // Save to local storage when emulator's trip status changes
  useEffect(() => {
    // Retrieve from local storage if the emulator has an active trip
    const storedIsEmulatorOnTrip =
      localStorage.getItem('isEmulatorOnTrip') === 'true'
    setIsEmulatorOnTrip(storedIsEmulatorOnTrip)
  }, [])

  // Save to local storage when emulator's trip status changes
  // Save to local storage when emulator's trip status changes
  useEffect(() => {
    // Check if emulatorRef.current is not null before setting isEmulatorOnTrip
    if (emulatorRef.current) {
      const isEmulatorOnTrip =
        emulatorRef.current.tripStatus !== 'PAUSED' &&
        emulatorRef.current.status !== 'RESTING'
      console.log(
        'Setting isEmulatorOnTrip in local storage:',
        isEmulatorOnTrip
      )
      localStorage.setItem('isEmulatorOnTrip', isEmulatorOnTrip.toString())
    } else {
      console.error(
        'emulatorRef.current is null when setting isEmulatorOnTrip in local storage'
      )
    }
  }, [emulatorRef.current?.id]) // Use a property of the emulatorRef.current object for the dependency array

  // Use isEmulatorOnTrip for conditional rendering or actions
  useEffect(() => {
    // Use isEmulatorOnTrip for conditional rendering or actions
    if (isEmulatorOnTrip) {
      // console.log('Emulator is currently on a trip.')
      // Perform actions specific to when the emulator is on a trip
    } else {
      // console.log('Emulator is not on a trip.')
      // Perform actions specific to when the emulator is not on a trip
    }
  }, [isEmulatorOnTrip])

  // movedEmulator subscription
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
          if (movedEmulator !== null && movedEmulator !== undefined) {
            const movedToPosition = new window.google.maps.LatLng(
              movedEmulator.latitude,
              movedEmulator.longitude
            )
            markerRef.current?.setPosition(movedToPosition)
            markerRef.current?.setAnimation(window.google.maps.Animation.DROP)
          } else {
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

  // draggedEmulators subscription
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
            const draggedEmulator = draggedEmulatorsRef.current.some(
              (draggedEmulator) =>
                draggedEmulator.emulator.id === emulatorRef.current?.id &&
                draggedEmulator.isDragMarkerDropped
            )
            if (!draggedEmulator) {
              const position = new window.google.maps.LatLng(
                draggedEmulator.latitude,
                draggedEmulator.longitude
              )
              markerRef.current?.setPosition(position)
            }
          }
        }
      ),
    []
  )

  // connectedEmulator subscription
  useEffect(
    () =>
      useEmulatorStore.subscribe(
        (state) => state.connectedEmulator,
        (connectedEmulator) => {
          emulatorRef.current = connectedEmulator
          if (markerRef.current === null || markerRef.current === undefined) {
            return
          }
          if (!connectedEmulator || connectedEmulator === undefined) {
            return
          }
          // if current marker is being dragged or moved, skip
          if (isThisEmulatorDragged() || isThisEmulatorMoved()) {
            const thisDraggedEmulator = draggedEmulatorsRef.current.filter(
              (draggedEmulator) =>
                draggedEmulator.emulator.id === emulatorRef.current?.id
            )
            if (thisDraggedEmulator.length > 0) {
              const position = new window.google.maps.LatLng(
                thisDraggedEmulator[0]?.latitude,
                thisDraggedEmulator[0]?.longitude
              )
              markerRef.current?.setPosition(position)
            }
          } else {
            const newPosition = new window.google.maps.LatLng(
              emulatorRef.current?.latitude,
              emulatorRef.current?.longitude
            )
            markerRef.current?.setPosition(newPosition)
          }

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

  // draggedEmulatorOnTrip subscription
  useEffect(
    () =>
      useEmulatorStore.subscribe(
        (state) => state.draggedEmulatorOnTrip,
        (draggedEmulatorOnTrip) => {
          console.log('draggedEmulatorOnTrip', draggedEmulatorOnTrip)
          draggedEmulatorOnTripRef.current = draggedEmulatorOnTrip
          if (markerRef.current === null || markerRef.current === undefined) {
            return
          }

          if (
            draggedEmulatorOnTrip === null ||
            draggedEmulatorOnTrip === undefined
          ) {
            // reset marker position to emulator position
            const position = new window.google.maps.LatLng(
              emulatorRef.current?.latitude,
              emulatorRef.current?.longitude
            )
            markerRef.current?.setPosition(position)
            return
          }

          // if draggedEmulatorOnTrip is not null, then set the marker position to draggedEmulatorOnTrip position
          const position = new window.google.maps.LatLng(
            draggedEmulatorOnTrip.latitude,
            draggedEmulatorOnTrip.longitude
          )
          markerRef.current?.setPosition(position)
        }
      ),
    []
  )
  // selected image
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

  function isThisEmulatorOnTrip() {
    let hasNoTrip = true
    if (
      emulatorRef.current?.tripStatus === 'PAUSED' &&
      emulatorRef.current?.status === 'RESTING'
    ) {
      console.log('emulator is in a trip 1')
      hasNoTrip = false
    }
    if (
      emulatorRef.current?.startLat !== null &&
      emulatorRef.current?.startLat !== 0
    ) {
      console.log('emulator is in a trip 2')
      hasNoTrip = false
    }

    return !hasNoTrip
  }

  function handleDragStart(event) {
    // remove any animation on marker
    markerRef.current?.setAnimation(null)
    const { latLng } = event
    if (isThisEmulatorOnTrip()) {
      dragEmulatorOnTrip({
        emulator: emulatorRef.current,
        latitude: latLng.lat(),
        longitude: latLng.lng(),
        isDragMarkerDropped: false
      })
    } else {
      dragEmulator({
        emulator: emulatorRef.current,
        latitude: latLng.lat(),
        longitude: latLng.lng(),
        isDragMarkerDropped: false,
        timeout: -1,
        retries: 0
      })
    }

    // if drag started from a MovedEmulator, reset moveMarker to false
    if (
      movedEmulatorRef.current?.emulator?.id === emulatorRef.current?.id &&
      movedEmulatorRef.current?.moveMarker === true
    ) {
      moveEmulator(null)
    }
  }

  function handleDragEnd(event) {
    const { latLng } = event
    if (isThisEmulatorOnTrip()) {
      dragEmulatorOnTrip({
        emulator: emulatorRef.current,
        latitude: latLng.lat(),
        longitude: latLng.lng(),
        isDragMarkerDropped: true
      })
    } else {
      dragEmulator({
        emulator: emulatorRef.current,
        latitude: latLng.lat(),
        longitude: latLng.lng(),
        isDragMarkerDropped: true,
        timeout: DRAG_TIMEOUT,
        retries: 0
      })
    }
  }

  function getMarkerPosition() {
    // loop draggedEmulatorsRef to get the draggedEmulator whose emulator.id == connectedEmulator.id
    const draggedEmulator = draggedEmulatorsRef.current.find(
      (draggedEmulator) =>
        draggedEmulator.emulator.id === emulatorRef.current?.id
    )
    if (draggedEmulator !== null && draggedEmulator !== undefined) {
      return new window.google.maps.LatLng(
        draggedEmulator.latitude,
        draggedEmulator.longitude
      )
    }
    return new window.google.maps.LatLng(
      emulatorRef.current?.latitude,
      emulatorRef.current?.longitude
    )
  }

  return (
    <>
      <Marker
        key={emulatorRef.current?.id}
        icon={emulatorIcon}
        // [#1]
        position={getMarkerPosition()}
        onLoad={(marker) => (markerRef.current = marker)}
        title={`${emulatorRef.current?.telephone} ${emulatorRef.current?.tripStatus}(${emulatorRef.current?.status})`}
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
