import { Polyline } from '@react-google-maps/api'
import React, { useEffect, useRef } from 'react'
import ApiService from '../../../../ApiService.js'
import { TRIP_STOPS_URL } from '../../../../constants.js'
import { useEmulatorStore } from '../../../../stores/emulator/store.tsx'

export function PathComponent() {
  console.log('Path component Created!')
  // const { showToast } = useStates();
  const pathTraveled = useEmulatorStore.getState().pathTraveled
  const pathNotTraveled = useEmulatorStore.getState().pathNotTraveled

  const pathTraveledRef = useRef(null)
  const pathNotTraveledRef = useRef(null)

  const connectedEmulatorRef = useRef(
    useEmulatorStore.getState().connectedEmulator
  )

  useEffect(() =>
    useEmulatorStore.subscribe(
      (state) => state.connectedEmulator,
      (connectedEmulator) => {
        connectedEmulatorRef.current = connectedEmulator
      }
    )
  )

  useEffect(() =>
    useEmulatorStore.subscribe(
      (state) => state.pathTraveled,
      (pathTraveled) => {
        if (pathTraveled === null || pathTraveled === undefined) {
          // reset the path
          pathTraveledRef.current.setPath([])
          return
        }
        if (pathTraveledRef.current) {
          pathTraveledRef.current.setPath(pathTraveled)
        }
      }
    )
  )

  useEffect(() =>
    useEmulatorStore.subscribe(
      (state) => state.pathNotTraveled,
      (pathNotTraveled) => {
        if (pathNotTraveled === null || pathNotTraveled === undefined) {
          // reset the path
          pathNotTraveledRef.current.setPath([])
          return
        }
        if (pathNotTraveledRef.current) {
          pathNotTraveledRef.current.setPath(pathNotTraveled)
        }
      }
    )
  )

  function onPolyLineClickTraveled(e) {
    if (
      connectedEmulatorRef.current === null ||
      connectedEmulatorRef.current === undefined
    ) {
      return
    }
    const emulatorId = connectedEmulatorRef.current.id
    const clickedLatLng = { lat: e.latLng.lat(), lng: e.latLng.lng() }

    const findClosestPointIndex = (path) => {
      return path.reduce((closestIndex, currentLatLng, index) => {
        const d1 =
          Math.pow(currentLatLng.lat - clickedLatLng.lat, 2) +
          Math.pow(currentLatLng.lng - clickedLatLng.lng, 2)
        const d2 =
          closestIndex === -1
            ? Infinity
            : Math.pow(path[closestIndex].lat - clickedLatLng.lat, 2) +
              Math.pow(path[closestIndex].lng - clickedLatLng.lng, 2)
        return d1 < d2 ? index : closestIndex
      }, -1)
    }

    const closestIndexPath = findClosestPointIndex(pathTraveled)
    if (closestIndexPath && closestIndexPath !== -1) {
      requestNewStopCreation(pathTraveled[closestIndexPath], emulatorId)
    }
  }

  function onPolyLineClickNotTraveled(e) {
    if (
      connectedEmulatorRef.current === null ||
      connectedEmulatorRef.current === undefined
    ) {
      return
    }
    const emulatorId = connectedEmulatorRef.current.id
    const clickedLatLng = { lat: e.latLng.lat(), lng: e.latLng.lng() }

    const findClosestPointIndex = (path) => {
      return path.reduce((closestIndex, currentLatLng, index) => {
        const d1 =
          Math.pow(currentLatLng.lat - clickedLatLng.lat, 2) +
          Math.pow(currentLatLng.lng - clickedLatLng.lng, 2)
        const d2 =
          closestIndex === -1
            ? Infinity
            : Math.pow(path[closestIndex].lat - clickedLatLng.lat, 2) +
              Math.pow(path[closestIndex].lng - clickedLatLng.lng, 2)
        return d1 < d2 ? index : closestIndex
      }, -1)
    }

    const closestIndexPath = findClosestPointIndex(pathNotTraveled)
    if (closestIndexPath && closestIndexPath !== -1) {
      requestNewStopCreation(pathNotTraveled[closestIndexPath], emulatorId)
    }
  }

  async function requestNewStopCreation(tripPoint, emulatorId) {
    // confirm from window alert
    const confirm = window.confirm('Create a new Stop at this location?')
    if (!confirm) {
      return
    }

    const token = localStorage.getItem('token')
    // showToast("Creating Stop...", "info");
    const { success, error } = await ApiService.makeApiCall(
      TRIP_STOPS_URL,
      'POST',
      tripPoint,
      token,
      emulatorId
    )
    if (success) {
      // showToast("Stop created!", "success");
      // setTripData(data); NOTE: THIS IS NOT NEEDED, THE SSE SHOULD BE ABLE TO RESPOND TO THIS CHANGE WITHIN 500 ms
    } else {
      // showToast("Error creating Stop!", "error");
      console.error('Error creating Stop: ', error)
    }
  }

  console.log('pathTraveled : ', pathTraveled?.length)
  console.log('pathNotTraveled : ', pathNotTraveled?.length)
  return (
    <>
      <Polyline
        onLoad={(polyline) => (pathTraveledRef.current = polyline)}
        path={pathTraveled}
        options={{
          strokeColor: '#0058A5',
          strokeWeight: 3,
          strokeOpacity: 1,
          defaultVisible: true
        }}
        onClick={onPolyLineClickTraveled}
      />
      <Polyline
        onLoad={(polyline) => (pathNotTraveledRef.current = polyline)}
        path={pathNotTraveled}
        options={{
          strokeColor: '#0058A54D',
          strokeWeight: 3,
          strokeOpacity: 1,
          defaultVisible: true
        }}
        onClick={onPolyLineClickNotTraveled}
      />
    </>
  )
}
