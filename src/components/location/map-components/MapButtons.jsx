import SyncIcon from '@mui/icons-material/Sync'
import Button from '@mui/material/Button'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import ApiService from '../../../ApiService.js'
import { useStates } from '../../../StateProvider.js'
import { useViewPort } from '../../../ViewportProvider.js'
import { EMULATOR_DRAG_URL } from '../../../constants.js'
import { useEmulatorStore } from '../../../stores/emulator/store.tsx'
import Speedometer from './Address/Speedometer.jsx'

const MapButtons = () => {
  const { width } = useViewPort()
  const breakpoint = 620
  const isMobile = width < breakpoint

  const [isSpinning, setSpinning] = useState()

  console.log('TEST@ MapButtons Rendered!')
  const {
    showToast,
    setIsTableVisible,
    isTableVisible,
    isMoveDialogVisible,
    setIsMoveDialogVisible
  } = useStates()

  const cancelSetPositionButtonRef = React.createRef()
  const setPositionButtonRef = React.createRef()
  const createTripButtonRef = React.createRef()
  const cancelTripButtonRef = React.createRef()

  // SELECTED EMULATOR
  const selectEmulator = useEmulatorStore((state) => state.selectEmulator)

  // TRIP DATA
  const tripDataRef = useRef(useEmulatorStore.getState().tripData)

  // CONNECTED EMULATOR
  const connectedEmulatorRef = useRef(
    useEmulatorStore.getState().connectedEmulator
  )

  // MOVED EMULATOR
  const movedEmulatorRef = useRef(useEmulatorStore.getState().movedEmulator)
  const moveEmulator = useEmulatorStore((state) => state.moveEmulator)

  // DRAGGED EMULATORS
  const draggedEmulatorsRef = useRef(
    useEmulatorStore.getState().draggedEmulators
  )

  const handleSetPositionClick = () => {
    if (connectedEmulatorRef.current === null) {
      showToast('Emulator is not selected', 'error') // Emulator is not selected error
    } else {
      setIsMoveDialogVisible(!isMoveDialogVisible)
    }
  }

  const handleSetPositionCancelClick = () => {
    console.log('TEST@ handleSetPositionCancelClick')
    if (movedEmulatorRef.current !== null) {
      moveEmulator(null)
    }
    // if draggedEmulatorRef.current includes a dragEmulator of same dragEmulator.emulator.id
    // remove draggedEmulator from draggedEmulatorsRef.current
    const draggedEmulatorsList = draggedEmulatorsRef.current
    let didRemove = false
    draggedEmulatorsList.forEach((draggedEmulator, index) => {
      if (draggedEmulator.emulator.id === connectedEmulatorRef.current?.id) {
        draggedEmulatorsList.splice(index, 1)
        didRemove = true
      }
    })
    if (didRemove) {
      useEmulatorStore.setState({ draggedEmulators: [...draggedEmulatorsList] })
    }
    setupButtons()
  }

  const handleCreateTripButton = () => {
    if (connectedEmulatorRef.current === null) {
      showToast('Emulator is not selected', 'error') // Emulator is not selected error
    } else if (connectedEmulatorRef.current.AssignedTelephoneNumber === null) {
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
      `Are you want to cancel ${tripDataRef.current?.fromAddress[0]?.long_name} to ${tripDataRef.current?.toAddress[0].long_name} trip?`
    )
    if (confirmed) {
      const token = localStorage.getItem('token')

      const payload = {
        emulatorId: connectedEmulatorRef.current?.id,
        cancelTrip: true,
        latitude: connectedEmulatorRef.current?.latitude,
        longitude: connectedEmulatorRef.current?.longitude,
        newTripIndex: null
      }

      const { success, data, error } = await ApiService.makeApiCall(
        EMULATOR_DRAG_URL,
        'POST',
        payload,
        token,
        null
      )

      if (success) {
        selectEmulator(data)
        showToast('Trip has been cancelled', 'success')
        // fetchEmulators();
        // NOTE: Don't need to refresh.. gets refreshed by SSE
      } else {
        console.error('Error cancelling trip', error)
        showToast('Trip Not cancelled', 'error')
      }
    }
  }

  // function to set Button to be visible or not after checking it's existing visibility

  const setupButtons = useCallback(() => {
    const shouldShowCancelSetPosition = () => {
      // true if movedEmulator.moveMarker or if draggedEmulatorsRef.current includes a dragEmulator of same dragEmulator.emulator.id
      let shouldShow = false
      if (movedEmulatorRef.current?.moveMarker) {
        shouldShow = true
      }
      if (draggedEmulatorsRef.current.length > 0) {
        draggedEmulatorsRef.current.forEach((draggedEmulator) => {
          console.log(
            'TEST@ draggedEmulator',
            draggedEmulator.emulator.id,
            connectedEmulatorRef.current?.id
          )
          if (
            draggedEmulator.emulator.id === connectedEmulatorRef.current?.id
          ) {
            shouldShow = true
          }
        })
      }
      console.log('TEST@ shouldShow', shouldShow)
      return shouldShow
    }

    const setButtonVisibility = (buttonRef, isVisible) => {
      let display = 'none'
      if (isVisible) {
        display = 'block'
      }
      buttonRef.current.style.display = display
    }

    const alignButtons = () => {
      // showCancel ? 310 : 190
      // showCancel ? 191 : 70
      if (tripDataRef.current !== null) {
        setPositionButtonRef.current.style.right = '310px'
        cancelSetPositionButtonRef.current.style.right = '310px'
        cancelTripButtonRef.current.style.right = '189px'
      } else {
        setPositionButtonRef.current.style.right = '190px'
        cancelSetPositionButtonRef.current.style.right = '190px'
        cancelTripButtonRef.current.style.right = '70px'
      }
    }

    const showPositionButtons = connectedEmulatorRef.current !== null
    let showCancelSetPositionButton = false
    if (showPositionButtons) {
      showCancelSetPositionButton = shouldShowCancelSetPosition()
    }

    if (showCancelSetPositionButton) {
      cancelSetPositionButtonRef.current.innerText = 'Cancel Set Position'
    }

    setButtonVisibility(
      cancelSetPositionButtonRef,
      showPositionButtons && showCancelSetPositionButton
    )

    setButtonVisibility(
      setPositionButtonRef,
      showPositionButtons && !showCancelSetPositionButton
    )

    setButtonVisibility(
      createTripButtonRef,
      connectedEmulatorRef.current !== null
    )

    setButtonVisibility(cancelTripButtonRef, tripDataRef.current !== null)
    alignButtons()
  }, [
    cancelSetPositionButtonRef,
    setPositionButtonRef,
    createTripButtonRef,
    cancelTripButtonRef,
    connectedEmulatorRef,
    tripDataRef
  ])

  // subscribe to connectedEmulator
  useEffect(() => {
    return useEmulatorStore.subscribe(
      (state) => state.connectedEmulator,
      (connectedEmulator) => {
        connectedEmulatorRef.current = connectedEmulator
        setupButtons()
      }
    )
  }, [setupButtons])

  // subscribe to movedEmulator
  useEffect(() => {
    return useEmulatorStore.subscribe(
      (state) => state.movedEmulator,
      (movedEmulator) => {
        movedEmulatorRef.current = movedEmulator
        setupButtons()
      }
    )
  }, [setupButtons])

  // subscribe to Trip Data
  useEffect(() => {
    return useEmulatorStore.subscribe(
      (state) => state.tripData,
      (tripData) => {
        tripDataRef.current = tripData
        setupButtons()
      }
    )
  }, [setupButtons])

  // subscribe to draggedEmulators
  useEffect(() => {
    return useEmulatorStore.subscribe(
      (state) => state.draggedEmulators,
      (draggedEmulators) => {
        draggedEmulatorsRef.current = draggedEmulators
        setupButtons()
      }
    )
  }, [setupButtons])

  // timer for draggedEmulatorsOnCountdown
  useEffect(() => {
    const interval = setInterval(() => {
      const draggedEmulatorsList = draggedEmulatorsRef.current
      // loop index and reduce 1 from each draggedEmulator's timeout in draggedEmulatorsList
      draggedEmulatorsList.forEach(async (draggedEmulator, index) => {
        if (draggedEmulator.timeout > 0) {
          draggedEmulatorsList[index].timeout = draggedEmulator.timeout - 1
        }
        // if connectedEmulator was the one being dragged, set setShowCancelSetPosition to true

        if (draggedEmulator.emulator.id === connectedEmulatorRef.current?.id) {
          // change CANCEL SET POSITION text to CANCEL SET POSITION (timeout seconds left)
          if (cancelSetPositionButtonRef.current) {
            cancelSetPositionButtonRef.current.innerText = `Cancel Set Position (${draggedEmulator.timeout}s)`
          }
        }

        // if timeout reaches 0, remove the emulator from draggedEmulatorsList and set movedEmulator to null
        if (draggedEmulator.timeout === 0) {
          try {
            const token = localStorage.getItem('token')
            const payload = {
              emulatorId: draggedEmulator.emulator.id,
              cancelTrip: false,
              latitude: draggedEmulator.latitude,
              longitude: draggedEmulator.longitude,
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
              showToast(
                `Location Updated for emulator with number ${
                  draggedEmulator.emulator.telephone
                    ? draggedEmulator.emulator.telephone
                    : 'N/A'
                }.`,
                'success'
              )
              // remove from draggedEmulatorsList
              draggedEmulatorsList.splice(index, 1)
              // fetchEmulators();
              // NOTE: Don't need to refresh.. gets refreshed by SSE
              // But since we are not updating the state, and subscribe only responds to added draggedEmulators.
              // we need to update the buttons right now from here
              setupButtons()
              cancelSetPositionButtonRef.current.innerText = 'Cancel Set Position'
              moveEmulator(null)
            } else {
              throw new Error(error)
            }
          } catch (error) {
            if (draggedEmulator.retries > 5) {
              showToast(
                `Error updating location for emulator ID ${draggedEmulator.emulator.id}. Retries exceeded. Resetting to Original Location!.` +
                  error,
                'error'
              )
              console.error(
                'Error updating location for emulator ID',
                draggedEmulator.emulator.id,
                '. Retries exceeded. Removing from list.',
                error
              )
              draggedEmulatorsList.splice(index, 1)
              // since we are not updating the state, and subscribe only responds to added draggedEmulators.
              // we need to update the buttons right now from here
              setupButtons()
            } else {
              showToast(
                `Error updating location for emulator ID ${draggedEmulator.emulator.id}. Retrying in 5 seconds.` +
                  error,
                'error'
              )
              console.error(
                'Error updating location for emulator ID',
                draggedEmulator.emulator.id,
                '. Retrying in 5 seconds.',
                error
              )
              draggedEmulatorsList[index].timeout = 5
              draggedEmulatorsList[index].retries =
                draggedEmulatorsList[index].retries + 1
            }
          }
        }
      })
      useEmulatorStore.setState({ draggedEmulators: draggedEmulatorsList }) // Shallow update. State change won't be detected.
    }, 1000)
    return () => clearInterval(interval)
  }, [cancelSetPositionButtonRef, showToast])

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
        <Speedometer />
        {/* show cancel if movedEmulator.moveMarker or if draggedEmulatorRef.current includes a dragEmulator of same dragEmulator.emulator.id */}
        <Button
          ref={cancelSetPositionButtonRef}
          variant="contained"
          style={{
            display: 'none',
            height: '40px',
            zIndex: 2,
            position: 'absolute',
            top: isMobile ? '100px' : '135px',
            right: 190,
            justifyContent: 'center',
            backgroundColor: '#f44336'
          }}
          onClick={handleSetPositionCancelClick}
        >
          Cancel Set Position
        </Button>

        <Button
          ref={setPositionButtonRef}
          variant="contained"
          style={{
            display: 'none',
            height: '40px',
            zIndex: 2,
            position: 'absolute',
            top: isMobile ? '100px' : '135px',
            right: 190,
            justifyContent: 'center'
          }}
          onClick={handleSetPositionClick}
        >
          Set position
        </Button>

        <Button
          ref={createTripButtonRef}
          variant="contained"
          style={{
            display: 'none',
            height: '40px',
            zIndex: 2,
            position: 'absolute',
            top: isMobile ? '100px' : '135px',
            right: 70,
            justifyContent: 'center'
          }}
          onClick={handleCreateTripButton}
        >
          Create Trip
        </Button>

        <Button
          ref={cancelTripButtonRef}
          variant="contained"
          style={{
            display: 'none',
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
