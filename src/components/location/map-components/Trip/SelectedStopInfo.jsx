import { InfoWindow } from '@react-google-maps/api'
import React, { useEffect, useRef } from 'react'
import { useEmulatorStore } from '../../../../stores/emulator/store.tsx'

import ApiService from '../../../../ApiService.js'
import { TRIP_STOPS_DELETE_URL } from '../../../../constants.js'
import EditableWaitingTimeComponent from './EditableWaitingTimeComponent.jsx'
import { toHumanReadableTime } from './utils.tsx'
// import { useStates } from "../../../../StateProvider.js";
import './selectedStopInfo.scss'

export function SelectedStopInfo(props) {
  // const { showToast } = useStates();

  const connectedEmulatorRef = useRef(
    useEmulatorStore.getState().connectedEmulator
  )
  const tripDataRef = useRef(useEmulatorStore.getState().tripData)

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
        (state) => state.tripData,
        (tripData) => {
          tripDataRef.current = tripData
        }
      ),
    []
  )

  const totalTime = useRef(null)

  const connectedEmulator = connectedEmulatorRef.current
  const tripData = tripDataRef.current
  const stop = props.selectedStop
  let timeToReachThisStop = null
  let distanceToThisStop = null
  if (connectedEmulator == null || stop == null || tripData == null) {
    timeToReachThisStop = 'N/A'
    distanceToThisStop = 'N/A'
  } else {
    // take the currentTripPointIndex from connectedEmulator, and add all distances till stop's currentTripPointIndex
    let distance = 0
    for (
      let i = connectedEmulator.currentTripPointIndex;
      i < stop.tripPointIndex;
      i++
    ) {
      if (i < 0) continue // skip -1 index
      distance += tripData.tripPoints[i].distance
    }
    const velocity = connectedEmulator.velocity
    const time = distance / velocity + Date.now() // in milliseconds
    // meters to miles round to 2 decimal places
    distanceToThisStop = (distance * 0.000621371).toFixed(2) + ' miles'
    timeToReachThisStop = toHumanReadableTime(time)
  }

  const handleDeleteStop = async () => {
    // request on window for confirmation
    // if yes, delete stop
    // if no, do nothing

    const shouldDelete = window.confirm(
      'Are you sure you want to delete this stop?'
    )
    if (!shouldDelete) {
      return
    }
    // showToast("Deleting stop...", "info");
    const token = localStorage.getItem('token')
    const { success, error } = await ApiService.makeApiCall(
      TRIP_STOPS_DELETE_URL,
      'GET',
      null,
      token,
      connectedEmulatorRef.current?.id,
      new URLSearchParams({
        stopTripPointIndex: props.selectedStop.tripPointIndex
      })
    )

    if (!success) {
      // showToast("Error deleting stop", "error");
      console.error('handleDeleteStop error : ', error)
    } else {
      // setTripData(data); NOTE: THIS IS NOT NEEDED, THE SSE SHOULD BE ABLE TO RESPOND TO THIS CHANGE WITHIN 500 ms
      // showToast("Stop deleted", "success");
      props.handleInfoWindowClose()
    }
  }

  return (
    <InfoWindow
      position={{
        lat: props.selectedStop.lat,
        lng: props.selectedStop.lng
      }}
      onCloseClick={props.handleInfoWindowClose}
    >
      <div className="selectedStopBox">
        <div className="selectedStopInfo">
          <div>
            <h6 className="selectedStopHeader">Stop Address:</h6>
            <p className="selectedStopPara">
              {props.selectedStop.address.map((addressItem, index) => (
                <React.Fragment key={index}>
                  {index > 0 && ', '}
                  {addressItem.long_name}
                </React.Fragment>
              ))}
            </p>
          </div>
          <div>
            <h6>Nearest Gas Station:</h6>
            <p>
              {props.selectedStop.gasStation.map(
                (gasStationAddressItem, index) => (
                  <React.Fragment key={index}>
                    {index > 0 && ', '}
                    {gasStationAddressItem.long_name}
                  </React.Fragment>
                )
              )}
            </p>
          </div>
        </div>
        <div className="selectedStopInfo">
          <div>
            <h6>Distance || Time for Arrival:</h6>
            <p>
              {distanceToThisStop || 'N/A'} || {timeToReachThisStop || 'N/A'}
            </p>
          </div>
          <div>
            <h6>Total Time: </h6>
            <p>{totalTime.current ? totalTime.current : 'N/A'}</p>
          </div>
        </div>
        <div className="selectedStopInfo">
          <div>
            <h6>Remaining Distance: </h6>
            <p>{timeToReachThisStop || 'N/A'}</p>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            {/* Edit Button */}
            <EditableWaitingTimeComponent
              tripPointIndex={props.selectedStop.tripPointIndex}
              waitTime={props.selectedStop.waitTime}
              connectedEmulatorId={connectedEmulatorRef.current?.id}
            />
            {/* Delete Button */}
            <button
              style={{
                backgroundColor: 'red',
                color: 'white',
                fontSize: '11px',
                padding: '5px',
                margin: '0px'
              }}
              onClick={() => handleDeleteStop()}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </InfoWindow>
  )
}
