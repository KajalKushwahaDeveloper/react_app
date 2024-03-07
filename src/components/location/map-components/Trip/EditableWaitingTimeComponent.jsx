import { Edit } from '@mui/icons-material'
import { Button, IconButton, TextField } from '@mui/material'
import React, { useEffect, useState } from 'react'
import ApiService from '../../../../ApiService'
import { TRIP_STOPS_UPDATE_WAIT_TIME_URL } from '../../../../constants'

function EditableWaitingTimeComponent(props) {
  const waitTimeInMilliseconds = props.waitTime

  const [isEditing, setIsEditing] = useState(false)
  const [humanReadableTime, setHumanReadableTime] = useState(() => {
    const date = new Date(waitTimeInMilliseconds)
    const hours = date.getUTCHours()
    const minutes = date.getUTCMinutes()
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}`
  })

  const [time, setTime] = useState(props.waitTime)

  const handleEditClick = () => {
    setIsEditing(true)
  }

  const handleApplyClick = async () => {
    // TODO: Update the wait time in the database
    if (
      time === waitTimeInMilliseconds ||
      props.connectedEmulatorId === null ||
      props.tripPointIndex === null
    ) {
      console.log(
        'No change in wait time or connectedEmulatorId or tripPointIndex is null. Returning...'
      )
      return
    } else {
      // request on window for confirmation
      // if yes, update Stop Time
      // if no, do nothing

      const shouldUpdateTime = window.confirm(
        'Are you sure you want to update the stop wait time?'
      )
      if (!shouldUpdateTime) {
        return
      }
      // showToast("Deleting stop...", "info");
      const token = localStorage.getItem('token')
      const { success, error } = await ApiService.makeApiCall(
        TRIP_STOPS_UPDATE_WAIT_TIME_URL,
        'GET',
        null,
        token,
        props.connectedEmulatorId,
        new URLSearchParams({
          stopTripPointIndex: props.tripPointIndex,
          newWaitTime: time
        })
      )

      if (!success) {
        // showToast("Error updating stop wait time", "error");
        console.error('handleApplyClick error : ', error)
      } else {
        // setTripData(data); NOTE: THIS IS NOT NEEDED, THE SSE SHOULD BE ABLE TO RESPOND TO THIS CHANGE WITHIN 500 ms
        // showToast("Stop wait time Updated", "success");
        const date = new Date(time)
        const hours1 = date.getUTCHours()
        const minutes2 = date.getUTCMinutes()
        const humanReadableTime =
          hours1.toString().padStart(2, '0') +
          ':' +
          minutes2.toString().padStart(2, '0')
        setHumanReadableTime(humanReadableTime)
      }
    }
    setIsEditing(false)
  }

  const handleTimeChange = (event) => {
    console.log(event.target.value)
    // convert the time to milliseconds
    const timeArray = event.target.value.split(':')
    const hours = parseInt(timeArray[0])
    const minutes = parseInt(timeArray[1])
    const timeInMilliseconds = hours * 3600000 + minutes * 60000
    setTime(timeInMilliseconds)
  }

  const handleIncrement = () => {
    setTime((prevValue) => prevValue + 1800000) // 30min to ms
  }

  const handleDecrement = () => {
    setTime((prevValue) => prevValue - 1800000) // 30min to ms
  }

  useEffect(() => {
    const date = new Date(time)
    const hours1 = date.getUTCHours()
    const minutes2 = date.getUTCMinutes()
    const humanReadableTime =
      hours1.toString().padStart(2, '0') +
      ':' +
      minutes2.toString().padStart(2, '0')
    setHumanReadableTime(humanReadableTime)
  }, [time])

  return (
    <div>
      <h6
        style={{
          color: 'black',
          fontSize: '.9rem',
          fontWeight: 'bold',
          textAlign: 'left'
        }}
      >
        Stop wait Time{' '}
      </h6>
      {isEditing ? (
        <>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <button
              style={{
                width: '20px',
                height: '25px'
              }}
              onClick={handleDecrement}
            >
              -
            </button>
            <TextField
              id="time"
              // label="Stop Wait Time"
              type="time"
              value={humanReadableTime} // convert waitTime in milliseconds to format "12:00"
              onChange={handleTimeChange}
              InputLabelProps={{
                shrink: true
              }}
              inputProps={{
                step: 300 // 5 min
              }}
            />
            <button style={{ height: '25px' }} onClick={handleIncrement}>
              +
            </button>
          </div>
          <div
            style={{ display: 'flex', justifyContent: 'right', marginTop: 14 }}
          >
            <Button
              variant="contained"
              color="primary"
              onClick={handleApplyClick}
              // style={{ margin: '10px 0px 0px 10px' }}
            >
              Apply
            </Button>
          </div>
        </>
      ) : (
        <>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <p
              className="pt-2"
              style={{ color: 'gray', fontSize: '.8rem', textAlign: 'left' }}
            >
              {humanReadableTime} hours
            </p>
            <IconButton
              aria-label="edit"
              onClick={handleEditClick}
              size="small"
            >
              <Edit fontSize="small" style={{ marginBottom: '10px' }} />
            </IconButton>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'right',
              marginTop: '14px'
            }}
          >
            <Button
              variant="contained"
              sx={{ backgroundColor: 'red !important' }}
              size="small"
              onClick={() => props.handleDeleteStop()}
            >
              Delete
            </Button>
            <Button
              variant="contained"
              size="small"
              sx={{ marginLeft: '10px' }}
              onClick={() => props.handleClose()}
            >
              Close
            </Button>
          </div>
        </>
      )}
    </div>
  )
}

export default EditableWaitingTimeComponent
