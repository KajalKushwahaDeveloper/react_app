import { Marker } from '@react-google-maps/api'
import React, { useCallback, useEffect, useRef } from 'react'
import {
  MAXIMUM_VELOCITY_METERS_PER_MILLISECONDS,
  MINIMUM_VELOCITY_METERS_PER_MILLISECONDS
} from '../../../../MetricsConstants.js'
import { useStates } from '../../../../StateProvider.js'
import useMarkerStore from '../../../../stores/emulator/markerStore.js'
import { useEmulatorStore } from '../../../../stores/emulator/store.tsx'

const EmulatorMarker = ({ id }) => {
  const { showToast } = useStates()
  const emulators = useEmulatorStore.getState().emulators
  const dragEmulator = useEmulatorStore.getState().dragEmulator
  const hoverEmulator = useEmulatorStore.getState().hoverEmulator
  const selectEmulator = useEmulatorStore.getState().selectEmulator

  const hoveredEmulatorRef = useRef(useEmulatorStore.getState().hoveredMarker)
  const draggedEmulatorsRef = useRef(
    useEmulatorStore.getState().draggedEmulators
  )

  // create emulatorRef by finding the emulator with the id from the emulators
  const emulatorRef = useRef(emulators.find((emulator) => emulator.id === id))
  // else create a default emulatorRef
  if (!emulatorRef.current) {
    emulatorRef.current = {
      id,
      telephone: '+1 000 000 0000',
      tripStatus: 'PAUSED',
      status: 'OFFLINE',
      latitude: 37.7749,
      longitude: -122.4194
    }
  }

  // PAUSED RESTING RUNNING STOP //HOVER SELECT DEFAULT //ONLINE OFFLINE INACTIVE
  let iconUrl = `images/${emulatorRef.current?.tripStatus}/`
  iconUrl = iconUrl + 'DEFAULT'
  if (
    emulatorRef.current?.startLat &&
    emulatorRef.current?.startLat !== 0 &&
    (emulatorRef.current?.velocity > MAXIMUM_VELOCITY_METERS_PER_MILLISECONDS ||
      emulatorRef.current?.velocity < MINIMUM_VELOCITY_METERS_PER_MILLISECONDS)
  ) {
    iconUrl = `${iconUrl}/FLASH`
  }
  iconUrl = `${iconUrl}/${emulatorRef.current?.status}.svg`

  const emulatorIcon = {
    url: iconUrl,
    scaledSize: new window.google.maps.Size(20, 20),
    anchor: new window.google.maps.Point(10, 10)
  }

  const markerRef = useRef(null)

  // callback function to update marker position
  const restoreMarkerPosition = useCallback(() => {
    const newPosition = new window.google.maps.LatLng(
      emulatorRef.current?.latitude,
      emulatorRef.current?.longitude
    )
    markerRef.current?.setPosition(newPosition)
  }, [])

  // callback function to update marker icon
  const updateMarkerIcon = useCallback(() => {
    let iconUrl = `images/${emulatorRef.current?.tripStatus}/`
    if (hoveredEmulatorRef.current?.id === id) {
      iconUrl = iconUrl + 'HOVER'
    } else {
      iconUrl = iconUrl + 'DEFAULT'
    }
    // check velocity and add flash if velocity is greater than MAXIMUM_VELOCITY_METERS_PER_MILLISECONDS or less than MINIMUM_VELOCITY_METERS_PER_MILLISECONDS
    if (
      emulatorRef.current?.startLat &&
      emulatorRef.current?.startLat !== 0 &&
      (emulatorRef.current?.velocity >
        MAXIMUM_VELOCITY_METERS_PER_MILLISECONDS ||
        emulatorRef.current?.velocity <
          MINIMUM_VELOCITY_METERS_PER_MILLISECONDS)
    ) {
      iconUrl = `${iconUrl}/FLASH`
    }
    iconUrl = `${iconUrl}/${emulatorRef.current?.status}.svg`
    const emulatorIcon = {
      url: iconUrl,
      scaledSize: new window.google.maps.Size(20, 20),
      anchor: new window.google.maps.Point(10, 10)
    }
    // can further optimize by checking if the icon and title is the same
    markerRef.current?.setIcon(emulatorIcon)
  }, [id])

  const updateTitle = useCallback(() => {
    // if the marker is being dragged, show the draggedEmulatorRef.current timeout
    if (markerRef.current === null || markerRef.current === undefined) {
      return
    }
    let title = `${emulatorRef.current?.telephone} ${emulatorRef.current?.tripStatus}(${emulatorRef.current?.status})`
    const draggedEmulator = draggedEmulatorsRef.current.find(
      (draggedEmulator) =>
        draggedEmulator.emulator.id === emulatorRef.current?.id &&
        draggedEmulator.isDragMarkerDropped
    )
    if (draggedEmulator) {
      title = `${emulatorRef.current?.telephone} ${emulatorRef.current?.tripStatus}(${emulatorRef.current?.status}) - ${draggedEmulator.timeout} seconds`
    }
    markerRef.current?.setTitle(title)
  }, [])

  const getTitle = () => {
    let title = `${emulatorRef.current?.telephone} ${emulatorRef.current?.tripStatus}(${emulatorRef.current?.status})`
    const draggedEmulator = draggedEmulatorsRef.current.find(
      (draggedEmulator) =>
        draggedEmulator.emulator.id === emulatorRef.current?.id &&
        draggedEmulator.isDragMarkerDropped
    )
    if (draggedEmulator) {
      title = `${emulatorRef.current?.telephone} ${emulatorRef.current?.tripStatus}(${emulatorRef.current?.status}) - ${draggedEmulator.timeout} seconds`
    }
    return title
  }

  // hoveredEmulator subscription
  useEffect(
    () =>
      useEmulatorStore.subscribe(
        (state) => state.hoveredEmulator,
        (hoveredEmulator) => {
          if (hoveredEmulator && hoveredEmulator.id === id) {
            // if the hoveredEmulator is the same as this marker (id), we set the hoveredEmulatorRef to only this marker
            hoveredEmulatorRef.current = hoveredEmulator
            return
          }
          if (hoveredEmulator === null || hoveredEmulator === undefined) {
            // if the hoveredEmulator is null, we set the hoveredEmulatorRef to null
            hoveredEmulatorRef.current = hoveredEmulator
          }
          updateMarkerIcon()
        }
      ),
    [id, updateMarkerIcon]
  )

  // draggedEmulators subscription
  useEffect(
    () =>
      useEmulatorStore.subscribe(
        (state) => state.draggedEmulators,
        (draggedEmulators) => {
          draggedEmulatorsRef.current = draggedEmulators
          // TODO: maybe we need to set Position of the marker to the draggedEmulator position
          if (markerRef.current === null || markerRef.current === undefined) {
            return
          }
          const draggedEmulator = draggedEmulatorsRef.current.find(
            (draggedEmulator) =>
              draggedEmulator.emulator.id === emulatorRef.current?.id
          )
          // found the draggedEmulator whose emulator.id == connectedEmulator.id
          if (draggedEmulator === null || draggedEmulator === undefined) {
            // [#2] We cannot tell if a draggedEmulator was dropped or not, when it's set position was cancelled by connectedEmulator subscription.
            // So we need to check if it was dropped or not on the connectedEmulator subscription
            // when the draggedEmulator position was cancelled, it will remove the draggedEmulator from this draggedEmulatorsRef.current
            // so, we need to verify this by checking that last connectedEmulator state's lat long is the same as the current emulatorRef.current lat long and does not exist in draggedEmulatorsRef.current
            return
          }
          // if draggedEmulator is not null, then set the marker position to draggedEmulator position
          if (draggedEmulator.isDragMarkerDropped) {
            const position = new window.google.maps.LatLng(
              draggedEmulator.latitude,
              draggedEmulator.longitude
            )
            markerRef.current?.setPosition(position)
            updateTitle()
          }
        }
      ),
    [updateTitle, id]
  )

  // emulator subscription
  useEffect(
    () =>
      useMarkerStore.subscribe((state) => {
        if (markerRef.current === null || markerRef.current === undefined) {
          return
        }
        emulatorRef.current = state[id]
        // if current marker (non selected!) is being  dragged, skip
        const draggedEmulator = draggedEmulatorsRef.current.find(
          (draggedEmulator) =>
            draggedEmulator.emulator.id === emulatorRef.current?.id
        )
        // FIXME: We just need to prevent setting new position when the marker is being dragged or moved
        // NOTE: ^ FIXED!!
        if (draggedEmulator !== null && draggedEmulator !== undefined) {
          console.log('skipping position due to draggedEmulator')
        } else {
          // Update marker position
          restoreMarkerPosition()
        }

        // Update marker icon
        updateMarkerIcon()

        // Update marker title
        // FIXME: THIS RUNS A LOT.. maybe remove this or change useMarkerStore to not update all emulators on individual emulator updates.
        updateTitle()
      }),
    [updateTitle, id, updateMarkerIcon, restoreMarkerPosition]
  )

  // connectedEmulator subscription
  useEffect(
    () =>
      useEmulatorStore.subscribe(
        (state) => state.connectedEmulator,
        (connectedEmulator) => {
          if (connectedEmulator?.id === id) {
            // hide the marker
            setMarkerVisibility(false)
            return
          }
          // show the marker
          // [#2]

          // skip for draggedEmulator
          const draggedEmulator = draggedEmulatorsRef.current.some(
            (draggedEmulator) =>
              draggedEmulator.emulator.id === emulatorRef.current?.id &&
              draggedEmulator.isDragMarkerDropped
          )
          if (!draggedEmulator) {
            restoreMarkerPosition() // TODO: runs [#2} issue check unnecessarily for every other emulator which didn't had a draggedEmulator set to null.
            // NOTE: ^ FIXED!!
          }
          setMarkerVisibility(true)
        }
      ),
    [id, restoreMarkerPosition]
  )

  // function to set Marker to be visible or not after checking it's existing visibility
  const setMarkerVisibility = (isVisible) => {
    if (markerRef.current?.getVisible() !== isVisible) {
      markerRef.current.setVisible(isVisible)
    }
  }

  function handleDragStart(event) {
    const isDraggable = getDraggable()
    if (!isDraggable) {
      return
    }
    const { latLng } = event
    dragEmulator({
      emulator: emulatorRef.current,
      latitude: latLng.lat(),
      longitude: latLng.lng(),
      isDragMarkerDropped: false,
      timeout: -1,
      retries: 0
    })
  }

  function handleDragEnd(event) {
    const isDraggable = getDraggable()
    if (!isDraggable) {
      showToast(
        'Emulator is in a trip, Please select the emulator to modify location.',
        'error'
      )
      restoreMarkerPosition()
      return
    }
    const { latLng } = event
    dragEmulator({
      emulator: emulatorRef.current,
      latitude: latLng.lat(),
      longitude: latLng.lng(),
      isDragMarkerDropped: true,
      timeout: 15,
      retries: 0
    })
  }

  const getMarkerPosition = () => {
    // loop draggedEmulatorsRef to get the draggedEmulator whose emulator.id == connectedEmulator.id
    const draggedEmulator = draggedEmulatorsRef.current.find(
      (draggedEmulator) =>
        draggedEmulator.emulator.id === emulatorRef.current?.id
    )
    if (draggedEmulator === null || draggedEmulator === undefined) {
      return new window.google.maps.LatLng(
        emulatorRef.current?.latitude,
        emulatorRef.current?.longitude
      )
    }
    return new window.google.maps.LatLng(
      draggedEmulator.latitude,
      draggedEmulator.longitude
    )
  }

  function isThisEmulatorDraggedButNotDropped() {
    return draggedEmulatorsRef.current.some(
      (draggedEmulator) =>
        draggedEmulator.emulator.id === emulatorRef.current?.id &&
        !draggedEmulator.isDragMarkerDropped
    )
  }

  function getDraggable() {
    console.log('checking if draggable')
    // true if emulator is not in a trip
    let draggable = true
    if (emulatorRef.current === undefined || emulatorRef.current === null) {
      console.log('emulator is undefined or null')
      draggable = false
    }
    if (
      emulatorRef.current?.tripStatus === 'PAUSED' &&
      emulatorRef.current?.status === 'RESTING'
    ) {
      console.log('emulator is in a trip 1')
      draggable = false
    }
    if (
      emulatorRef.current?.startLat !== null &&
      emulatorRef.current?.startLat !== 0
    ) {
      console.log('emulator is in a trip 2')
      draggable = false
    }

    return draggable
  }

  return (
    <Marker
      key={id}
      icon={emulatorIcon}
      // check of emulatorRef.current id exist in draggedEmulatorsRef.current list, if yes, show the draggedEmulatorRef.current position, else show the emulatorRef.current position
      position={getMarkerPosition()}
      onLoad={(marker) => (markerRef.current = marker)}
      title={getTitle()}
      onClick={() => selectEmulator(emulatorRef.current)}
      onMouseOver={() => {
        // check if the same marker is being dragged or hovered already
        if (
          isThisEmulatorDraggedButNotDropped() ||
          hoveredEmulatorRef.current?.id === id
        ) {
          return
        }
        hoverEmulator(emulatorRef.current)
      }}
      onMouseOut={() => {
        // check if the same marker is being dragged
        // if (isThisEmulatorDragged) {
        //   return
        // }
        hoverEmulator(null)
      }}
      draggable={true}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      zIndex={1}
    />
  )
}

export default EmulatorMarker
