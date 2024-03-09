import { Edit } from '@mui/icons-material'
import { Button, IconButton } from '@mui/material'
import { LocalizationProvider, MobileTimePicker } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs'
import 'dayjs/locale/de'
import utc from 'dayjs/plugin/utc'
import React, { useState } from 'react'
import ApiService from '../../../../ApiService'
import { useStates } from '../../../../StateProvider'
import { TRIP_STOPS_UPDATE_WAIT_TIME_URL } from '../../../../constants'
import './timePicker.css'

// FIXME: The waitTime is in milliseconds from UTC 00:00:00, so it has to be converted to the local time when viewing Time Picker/ Edit Mode!.
function EditableWaitingTimeComponent(props) {
  const { showToast } = useStates()
  dayjs.extend(utc)

  const waitTimeInMilliseconds = props.waitTime
  console.log(
    'EditableWaitingTimeComponent waitTimeInMilliseconds : ',
    waitTimeInMilliseconds
  )

  const [timeValue, setTimeValue] = useState({
    timeInMilliseconds: waitTimeInMilliseconds,
    timeInDayJs: dayjs(new Date(waitTimeInMilliseconds).toISOString())
  })

  const [isEditing, setIsEditing] = useState(false)

  const [humanReadableTime, setHumanReadableTime] = useState(() => {
    const date = new Date(waitTimeInMilliseconds).toISOString()
    return dayjs(date).utc().format('HH:mm')
  })

  const handleCancelClick = () => {
    setIsEditing(false)
  }

  const handleApplyClick = async () => {
    // request on window for confirmation
    // if yes, update Stop Time
    // if no, do nothing and close the edit mode
    if (
      timeValue.timeInMilliseconds === waitTimeInMilliseconds ||
      props.connectedEmulatorId === null ||
      props.tripPointIndex === null
    ) {
      console.log(
        'No change in wait time or connectedEmulatorId or tripPointIndex is null. Returning...'
      )
      setIsEditing(false)
      return
    }

    const shouldUpdateTime = window.confirm(
      'Are you sure you want to update the stop wait time to ' +
        timeValue.timeInDayJs.utc().format('HH') +
        ' hours and ' +
        timeValue.timeInDayJs.utc().format('mm') +
        ' minutes?'
    )
    if (!shouldUpdateTime) {
      return
    }
    showToast('Updating Wait Time...', 'info')
    const token = localStorage.getItem('token')
    const { success, error } = await ApiService.makeApiCall(
      TRIP_STOPS_UPDATE_WAIT_TIME_URL,
      'GET',
      null,
      token,
      props.connectedEmulatorId,
      new URLSearchParams({
        stopTripPointIndex: props.tripPointIndex,
        newWaitTime: timeValue.timeInMilliseconds
      })
    )

    if (!success) {
      showToast(error, 'error')
      console.error('handleApplyClick error : ', error)
    } else {
      showToast('Stop Wait Time Updated!', 'success')
      const date = new Date(timeValue.timeInMilliseconds)
      const hours1 = date.getUTCHours()
      const minutes2 = date.getUTCMinutes()
      const humanReadableTime =
        hours1.toString().padStart(2, '0') +
        ':' +
        minutes2.toString().padStart(2, '0')
      setHumanReadableTime(humanReadableTime)
    }
    setIsEditing(false)
  }

  const handleTimeChange = (value) => {
    console.log('handleTimeChange value : ', value.unix() * 1000)
    const utcMilliseconds = dayjs(value).utc().valueOf()
    setTimeValue({
      timeInMilliseconds: value.unix() * 1000,
      timeInDayJs: dayjs.utc(utcMilliseconds)
    })
  }

  const handleIncrement = () => {
    // if value greater than 24 hours, return
    if (timeValue.timeInMilliseconds + 1800000 > 86400000) {
      return
    }
    const newTimeInMilliseconds = timeValue.timeInMilliseconds + 1800000

    setTimeValue({
      timeInMilliseconds: newTimeInMilliseconds,
      timeInDayJs: dayjs(new Date(newTimeInMilliseconds).toISOString())
    })
  }

  const handleDecrement = () => {
    // if value less than 0, return
    if (timeValue.timeInMilliseconds - 1800000 < 0) {
      return
    }
    const newTimeInMilliseconds = timeValue.timeInMilliseconds - 1800000
    setTimeValue({
      timeInMilliseconds: newTimeInMilliseconds,
      timeInDayJs: dayjs(new Date(newTimeInMilliseconds).toISOString())
    })
  }

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
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en">
              <MobileTimePicker
                label="wait time"
                ampm={false}
                timezone="UTC"
                value={timeValue.timeInDayJs}
                onChange={handleTimeChange}
                ToolbarComponent={() => <></>}
              />
            </LocalizationProvider>
            <button style={{ height: '25px' }} onClick={handleIncrement}>
              +
            </button>
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
              size="small"
              sx={{ backgroundColor: 'red !important' }}
              onClick={handleCancelClick}
            >
              Cancel
            </Button>

            <Button
              variant="contained"
              size="small"
              sx={{ marginLeft: '10px' }}
              onClick={handleApplyClick}
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
              onClick={() => setIsEditing(true)}
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
              size="small"
              sx={{ backgroundColor: 'red !important' }}
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
