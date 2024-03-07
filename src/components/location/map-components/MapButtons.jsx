import SyncIcon from '@mui/icons-material/Sync'
import Button from '@mui/material/Button'
import React, { useEffect, useState } from 'react'
import ApiService from '../../../ApiService.js'
import { useStates } from '../../../StateProvider.js'
import { useViewPort } from '../../../ViewportProvider.js'
import { EMULATOR_DRAG_URL } from '../../../constants.js'
import { useEmulatorStore } from '../../../stores/emulator/store.tsx'
import Speedometer from './Address/Speedometer.jsx'

const MapButtons = () => {
  console.log('MapButtons Rendered!')
  const {
    showToast,
    setIsTableVisible,
    isTableVisible,
    isMoveDialogVisible,
    setIsMoveDialogVisible
  } = useStates()

  // Initiate fetchEmulators from store
  const tripData = useEmulatorStore((state) => state.tripData)
  const connectedEmulator = useEmulatorStore((state) => state.connectedEmulator)
  const movedEmulator = useEmulatorStore((state) => state.movedEmulator)
  const moveEmulator = useEmulatorStore((state) => state.moveEmulator)

  const { width } = useViewPort()
  const breakpoint = 620
  const isMobile = width < breakpoint

  const [isSpinning, setSpinning] = useState()
  const [showCancel, setShowCancel] = useState(false)

  const [count, setCount] = useState(15)

  const handleSetPositionClick = () => {
    if (connectedEmulator === null) {
      showToast('Emulator is not selected', 'error') // Emulator is not selected error
    } else {
      setIsMoveDialogVisible(!isMoveDialogVisible)
    }
  }

  const handleSetPositionCancelClick = () => {
    moveEmulator({
      emulator: connectedEmulator,
      latitude: connectedEmulator.latitude,
      longitude: connectedEmulator.longitude,
      moveMarker: false
    })
  }

  const handleCreateTripButton = () => {
    if (connectedEmulator === null) {
      showToast('Emulator is not selected', 'error') // Emulator is not selected error
    } else if (connectedEmulator.AssignedTelephoneNumber === null) {
      showToast('Telephone Number is not Assigned', 'error') // Telephone Number is not Assigned
    } else {
      setIsTableVisible(!isTableVisible)
    }
  }

  const handleButtonClick = () => {
    setSpinning(true)
    setTimeout(() => {
      window.location.reload()
    }, 1000)
  }

  const handleCancelTripClick = async () => {
    const confirmed = window.confirm(
      `Are you want to cancel ${tripData?.fromAddress[0]?.long_name} to ${tripData?.toAddress[0].long_name} trip?`
    )
    if (confirmed) {
      const token = localStorage.getItem('token')

      const payload = {
        emulatorId: connectedEmulator?.id,
        cancelTrip: true,
        latitude: connectedEmulator?.latitude,
        longitude: connectedEmulator?.longitude,
        newTripIndex: null
      }

      const { success, error } = await ApiService.makeApiCall(
        EMULATOR_DRAG_URL,
        'POST',
        payload,
        token,
        null
      )

      if (success) {
        showToast('Trip has been cancelled', 'success')
        // fetchEmulators();
        // NOTE: Don't need to refresh.. gets refreshed by SSE
      } else {
        console.error('Error cancelling trip', error)
        showToast('Trip Not cancelled', 'error')
      }
    }
  }

  useEffect(() => {
    if (tripData !== null && connectedEmulator !== null) {
      // leave earlier same, set show cancel true
      setShowCancel(true)
    } else {
      setShowCancel(false)
    }
  }, [tripData, connectedEmulator])

  useEffect(() => {
    if (movedEmulator && movedEmulator.moveMarker === true) {
      const timer = setInterval(() => {
        setCount(prevCount => prevCount - 1)
      }, 1000)
      return () => clearInterval(timer)
    }
    setCount(15)
  }, [movedEmulator])

  if (count === 0) {
    setCount()
  }

  return (
    <>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-around',
          flexShrink: '1',
          padding: '0'
        }}
      >
        {connectedEmulator && (
          <>
            {connectedEmulator.startLat !== null &&
              connectedEmulator.startLat !== undefined &&
              connectedEmulator.startLat !== 0 && <Speedometer />}

            {movedEmulator && movedEmulator.moveMarker === true ? (
              <Button
                variant="contained"
                style={{
                  height: '40px',
                  zIndex: 2,
                  position: 'absolute',
                  top: isMobile ? '100px' : '135px',
                  right: showCancel ? 310 : 200,
                  justifyContent: 'center',
                  backgroundColor: '#f44336'
                }}
                onClick={handleSetPositionCancelClick}
              >
                Cancel Set Position
                {count}
              </Button>
            ) : (
              <Button
                variant="contained"
                style={{
                  height: '40px',
                  zIndex: 2,
                  position: 'absolute',
                  top: isMobile ? '100px' : '135px',
                  right: showCancel ? 310 : 190,
                  justifyContent: 'center'
                }}
                onClick={handleSetPositionClick}
              >
                Set position
              </Button>
            )}

            <Button
              variant="contained"
              style={{
                height: '40px',
                zIndex: 2,
                position: 'absolute',
                top: isMobile ? '100px' : '135px',
                right: showCancel ? 191 : 70,
                justifyContent: 'center'
              }}
              onClick={handleCreateTripButton}
            >
              Create Trip
            </Button>

            {showCancel ? (
              <Button
                variant="contained"
                style={{
                  height: '40px',
                  zIndex: 2,
                  position: 'absolute',
                  top: isMobile ? '100px' : '135px',
                  right: 70,
                  justifyContent: 'center',
                  backgroundColor: '#f44336'
                }}
                onClick={handleCancelTripClick}
              >
                Cancel Trip
              </Button>
            ) : null}
          </>
        )}
        <Button
          variant="contained"
          style={{
            width: '30px',
            height: '40px',
            margin: '0 0.2rem',
            zIndex: 2,
            position: 'absolute',
            top: isMobile ? '100px' : '135px',
            right: 0,
            justifyContent: 'center'
          }}
          onClick={handleButtonClick}
        >
          <SyncIcon
            sx={{
              width: '30px',
              height: '30px',
              transition: 'transform 1s ease-in-out', // CSS transition for smooth animation
              transform: isSpinning ? 'rotate(360deg)' : '' // Apply rotation based on state
            }}
          />
        </Button>
      </div>
    </>
  )
}

export default MapButtons
