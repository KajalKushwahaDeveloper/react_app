import { Polyline } from '@react-google-maps/api'
import React, { useEffect, useRef } from 'react'
import ApiService from '../../../../ApiService.js'
import { useStates } from '../../../../StateProvider.js'
import { TRIP_STOPS_URL } from '../../../../constants.js'
import { useEmulatorStore } from '../../../../stores/emulator/store.tsx'

export function PathComponent() {
  const { showToast } = useStates()
  const pathTraveledRef = useRef(useEmulatorStore.getState().pathTraveled)
  const pathNotTraveledRef = useRef(useEmulatorStore.getState().pathNotTraveled)

  const pathTraveledPolylineRef = useRef(null)
  const pathNotTraveledPolylineRef = useRef(null)

  const connectedEmulatorRef = useRef(
    useEmulatorStore.getState().connectedEmulator
  )

  useEffect(
    () =>
      useEmulatorStore.subscribe(
        (state) => state.connectedEmulator,
        (connectedEmulator) => {
          connectedEmulatorRef.current = connectedEmulator
        }
      ),
    []
  )

  useEffect(
    () =>
      useEmulatorStore.subscribe(
        (state) => state.pathTraveled,
        (pathTraveled) => {
          pathTraveledRef.current = pathTraveled
          if (pathTraveled === null || pathTraveled === undefined) {
            console.log('pathTraveled is null or undefined')
            // reset the path
            pathTraveledPolylineRef.current.setPath([])
            // update the path
            pathTraveledRef.current = []
            return
          }
          if (pathTraveledPolylineRef.current) {
            pathTraveledPolylineRef.current.setPath(pathTraveled)
          }
        }
      ),
    []
  )

  useEffect(
    () =>
      useEmulatorStore.subscribe(
        (state) => state.pathNotTraveled,
        (pathNotTraveled) => {
          pathNotTraveledRef.current = pathNotTraveled
          if (pathNotTraveled === null || pathNotTraveled === undefined) {
            console.log('pathNotTraveled is null or undefined')
            // reset the path
            pathNotTraveledPolylineRef.current.setPath([])
            // update the path
            pathNotTraveledRef.current = []
            return
          }
          if (pathNotTraveledPolylineRef.current) {
            pathNotTraveledPolylineRef.current.setPath(pathNotTraveled)
          }
        }
      ),
    []
  )

  function onPolyLineClickTraveled(e) {
    if (
      connectedEmulatorRef.current === null ||
      connectedEmulatorRef.current === undefined ||
      pathTraveledRef.current === null ||
      pathTraveledRef.current === undefined
    ) {
      showToast(
        'Something went wrong! Please refresh if this keeps happening',
        'error'
      )
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

    const closestIndexPath = findClosestPointIndex(pathTraveledRef.current)
    if (closestIndexPath && closestIndexPath !== -1) {
      requestNewStopCreation(
        pathTraveledRef.current[closestIndexPath],
        emulatorId
      )
    }
  }

  function onPolyLineClickNotTraveled(e) {
    if (
      connectedEmulatorRef.current === null ||
      connectedEmulatorRef.current === undefined ||
      pathNotTraveledRef.current === null ||
      pathNotTraveledRef.current === undefined
    ) {
      showToast(
        'Something went wrong! Please refresh if this keeps happening',
        'error'
      )
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

    const closestIndexPath = findClosestPointIndex(pathNotTraveledRef.current)
    if (closestIndexPath && closestIndexPath !== -1) {
      requestNewStopCreation(
        pathNotTraveledRef.current[closestIndexPath],
        emulatorId
      )
    }
  }

  async function requestNewStopCreation(tripPoint, emulatorId) {
    // confirm from window alert
    const confirm = window.confirm('Create a new Stop at this location?')
    if (!confirm) {
      return
    }

    const token = localStorage.getItem('token')
    showToast('Creating Stop...', 'info')
    const { success, error } = await ApiService.makeApiCall(
      TRIP_STOPS_URL,
      'POST',
      tripPoint,
      token,
      emulatorId
    )
    if (success) {
      showToast('Stop created!', 'success')
      // setTripData(data); NOTE: THIS IS NOT NEEDED, THE SSE SHOULD BE ABLE TO RESPOND TO THIS CHANGE WITHIN 500 ms
    } else {
      showToast(error, 'error')
      console.error('Error creating Stop: ', error)
    }
  }

  return (
    <>
      <Polyline
        onLoad={(polyline) => (pathTraveledPolylineRef.current = polyline)}
        path={pathTraveledRef.current}
        options={{
          strokeColor: '#0058A5',
          strokeWeight: 3,
          strokeOpacity: 1,
          defaultVisible: true
        }}
        onClick={onPolyLineClickTraveled}
      />
      <Polyline
        onLoad={(polyline) => (pathNotTraveledPolylineRef.current = polyline)}
        path={pathNotTraveledRef.current}
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
