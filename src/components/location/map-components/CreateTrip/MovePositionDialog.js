import CloseIcon from '@mui/icons-material/Close'
import { Box, Button, IconButton, Modal, Typography } from '@mui/material'
import React, { useState } from 'react'
import SearchBar from './SearchBar.js'

import { useViewPort } from '../../../.././ViewportProvider.js'
import { useStates } from '../../../../StateProvider.js'
import { useEmulatorStore } from '../../../../stores/emulator/store.tsx'

const MovePositionDialog = () => {
  const selectedEmulator = useEmulatorStore((state) => state.selectedEmulator)
  const moveEmulator = useEmulatorStore((state) => state.moveEmulator)

  const [fromLat, setFromLat] = useState()
  const [fromLong, setFromLong] = useState()
  const [inputValue, setInputValue] = useState('')

  const [error, setError] = useState('')

  const { isMoveDialogVisible, setIsMoveDialogVisible, showToast } = useStates()

  const { width } = useViewPort()
  const breakpoint = 620
  const isMobile = width < breakpoint

  const handleClose = () => {
    setIsMoveDialogVisible(false)
  }

  const handleInputChange = (event) => {
    setInputValue(event.target.value)
  }

  const handleAddClick = () => {
    if (!fromLat && !fromLong) {
      showToast('Please fill Location you want to move to!', 'error')
      return
    }

    setError('')

    console.log('SelectedEmulatorshubham:', selectedEmulator, fromLat, fromLong)

    moveEmulator({
      emulator: selectedEmulator,
      latitude: fromLat,
      longitude: fromLong,
      moveMarker: true
    })

    handleClose()
  }

  return (
    <>
      <div className="gps_createTrip_overlay">
        <Modal
          open={isMoveDialogVisible}
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
                padding: '1rem',
                backgroundColor: '#007dc6',
                color: 'white',
                borderTopRightRadius: '1rem',
                borderTopLeftRadius: '1rem'
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
                    inputValue={inputValue}
                    setInputValue={setInputValue}
                    handleInputChange={handleInputChange}
                    label="Address to move to"
                  />
                </div>
                <div style={{ margin: '1rem 0' }}>
                  <Button
                    onClick={handleAddClick}
                    style={{
                      cursor: 'pointer',
                      width: 'auto',
                      textAlign: 'center',
                      float: 'right',
                      backgroundColor: '#1976d2',
                      color: 'white',
                      marginRight: '0.7rem'
                    }}
                  >
                    Show on Map
                  </Button>
                  {error && <p className="error">{error}</p>}
                </div>
              </div>
            </div>
          </Box>
        </Modal>
      </div>
    </>
  )
}

export default MovePositionDialog
