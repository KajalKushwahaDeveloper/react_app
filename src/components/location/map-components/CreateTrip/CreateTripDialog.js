import CloseIcon from '@mui/icons-material/Close'
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  IconButton,
  Modal,
  Typography
} from '@mui/material'
import CircularProgress from '@mui/material/CircularProgress'
import React, { useEffect, useRef, useState } from 'react'
import ApiService from '../../../../ApiService.js'
import { CREATE_TRIP_URL } from '../../../../constants.js'
import SearchBar from './SearchBar.js'

import { useViewPort } from '../../../.././ViewportProvider.js'
import { useStates } from '../../../../StateProvider.js'
import { useEmulatorStore } from '../../../../stores/emulator/store.tsx'

import dayjs from 'dayjs'
import DateTimePickerValue from './DateTimeFieldValue.tsx'

const CreateTripDialog = () => {
  const { width } = useViewPort()
  const breakpoint = 620
  const isMobile = width < breakpoint

  const { isTableVisible } = useStates()

  const selectedEmulator = useEmulatorStore((state) => state.selectedEmulator)

  const draggedEmulatorsRef = useRef(
    useEmulatorStore.getState().draggedEmulators
  )

  useEffect(() => {
    useEmulatorStore.subscribe(
      (state) => state.draggedEmulators,
      (draggedEmulators) => {
        draggedEmulatorsRef.current = draggedEmulators
      }
    )
  }, [])

  const [fromLat, setFromLat] = useState()
  const [fromLong, setFromLong] = useState()
  const [toLat, setToLat] = useState()
  const [toLong, setToLong] = useState()
  const [fromAddress, setFromAddress] = useState()
  const [toAddress, setToAddress] = useState()
  const [inputValue, setInputValue] = useState('')

  const [departTime, setDepartTime] = React.useState(dayjs())
  const [departNow, setDepartNow] = React.useState(true)
  const [arrivalTime, setArrivalTime] = React.useState(dayjs().add(4, 'day'))
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const { setIsTableVisible, showToast } = useStates()

  const handleClose = () => {
    setIsTableVisible(false)
  }

  const handleInputChange = (event) => {
    setInputValue(event.target.value)
  }

  const handleDraggedEmulatorsIfAny = () => {
    if (selectedEmulator !== null) {
      // if draggedEmulators is not null, then find from draggedEmulators where id is equal to selectedEmulator.id
      const draggedEmulatorsList = draggedEmulatorsRef.current
      let didRemove = false
      draggedEmulatorsList.forEach((draggedEmulator, index) => {
        if (draggedEmulator.emulator.id === selectedEmulator.id) {
          draggedEmulatorsList.splice(index, 1)
          didRemove = true
        }
      })
      if (didRemove) {
        useEmulatorStore.setState({ draggedEmulators: [...draggedEmulatorsList] })
      }
    }
  }

  const handleCreateTripClick = async () => {
    console.log('fromAddress', fromAddress)
    console.log('toAddress', toAddress)
    if ((!fromLat && !fromLong) || (!toLat && !toLong)) {
      showToast('Please fill both locations!', 'error')
      return
    }

    setError('')

    let confirmed = false
    if (
      selectedEmulator.startLat !== null &&
      selectedEmulator.tripStatus !== 'STOP'
    ) {
      confirmed = window.confirm(
        'Creating new Trip will remove running trip for this emulator!! Continue?'
      )
    } else {
      confirmed = true
    }
    if (confirmed) {
      setIsLoading(true)
      const payload = {
        startLat: fromLat,
        startLong: fromLong,
        endLat: toLat,
        endLong: toLong,
        fromAddress,
        toAddress,
        emulatorDetailsId: selectedEmulator.id,
        departTime: departNow
          ? dayjs().unix() * 1000
          : departTime.unix() * 1000,
        arrivalTime: arrivalTime.unix() * 1000,
        departNow
      }
      const token = localStorage.getItem('token')
      const { success, error } = await ApiService.makeApiCall(
        CREATE_TRIP_URL,
        'POST',
        payload,
        token
      )
      if (success) {
        showToast('Trip Added successfully', 'success')
        // fetchEmulators()
        handleDraggedEmulatorsIfAny()
        handleClose()
      } else {
        showToast(error, 'error')
      }
      setIsLoading(false)
    }
  }

  return (
    <>
      <div className="gps_createTrip_overlay">
        <Modal
          open={isTableVisible}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: isMobile ? '90vw' : '50vw',
              bgcolor: 'background.paper',
              boxShadow: 24,
              p: 4,
              paddingTop: '0px',
              paddingLeft: '0px',
              paddingRight: '0px',
              paddingBottom: '1rem',
              zIndex: '0px !important',
              borderRadius: '1rem'
            }}
          >
            <IconButton
              edge="end"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
              sx={{
                position: 'absolute',
                top: 10,
                right: 10,
                color: 'white'
              }}
            >
              <CloseIcon />
            </IconButton>
            <Typography
              variant="h6"
              component="h2"
              style={{
                padding: '10px',
                backgroundColor: '#007dc6',
                color: 'white',
                lineHeight: 2.6,
                borderTopLeftRadius: '1rem',
                borderTopRightRadius: '1rem'
              }}
            >
              Create Trip
            </Typography>
            <div style={{ margin: '1rem 0' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  flexDirection: 'column',
                  alignItems: 'center'
                }}
              >
                <div style={{ flex: 1 }}>
                  <SearchBar
                    setLat={setFromLat}
                    setLong={setFromLong}
                    setAddress={setFromAddress}
                    inputValue={inputValue}
                    setInputValue={setInputValue}
                    handleInputChange={handleInputChange}
                    label="From Address"
                    style={{
                      width: '80vw !important',
                      background: 'white !important'
                    }}
                  />
                </div>
                <div
                  style={{
                    margin: '1rem 0',
                    width: '80vw !important',
                    background: 'white !important'
                  }}
                >
                  <SearchBar
                    setLat={setToLat}
                    setLong={setToLong}
                    setAddress={setToAddress}
                    inputValue={inputValue}
                    setInputValue={setInputValue}
                    handleInputChange={handleInputChange}
                    label="To Address"
                    style={{
                      width: '80vw !important',
                      background: 'white !important'
                    }}
                  />
                  {error && <p className="error">{error}</p>}
                </div>
                <div
                  style={{
                    margin: '1rem 0',
                    width: isMobile ? '85vw' : '48vw'
                  }}
                >
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={departNow}
                        onChange={() => {
                          setDepartNow(!departNow)
                        }}
                      />
                    }
                    label="Depart Now"
                  />
                </div>
                {!departNow && (
                  <div
                    style={{
                      margin: '1rem 0',
                      width: isMobile ? '85vw' : '48vw'
                    }}
                  >
                    <DateTimePickerValue
                      value={departTime}
                      title={'Depart Time'}
                      setValue={setDepartTime}
                    />
                    {error && <p className="error">{error}</p>}
                  </div>
                )}

                <div
                  style={{
                    margin: '1rem 0',
                    width: isMobile ? '85vw' : '48vw'
                  }}
                >
                  <DateTimePickerValue
                    value={arrivalTime}
                    title={'Arrival Time'}
                    setValue={setArrivalTime}
                  />
                  {error && <p className="error">{error}</p>}
                </div>

                <div style={{ margin: '1rem 0' }}>
                  <Button
                    onClick={handleCreateTripClick}
                    style={{
                      cursor: 'pointer',
                      width: 'auto',
                      textAlign: 'center',
                      float: 'right',
                      backgroundColor: '#1976d2',
                      color: 'white',
                      marginRight: '0.7rem'
                    }}
                    disabled={!!isLoading}
                  >
                    Add
                  </Button>
                  {error && <p className="error">{error}</p>}
                </div>

                <div style={{ margin: '0' }}>
                  {isLoading ? <CircularProgress color="primary" /> : ''}
                </div>
              </div>
            </div>
          </Box>
        </Modal>
      </div>
    </>
  )
}

export default CreateTripDialog
