import React from 'react'
import Box from '@mui/material/Box'
import Modal from '@mui/material/Modal'
import { useViewPort } from '../../../../src/ViewportProvider'
import PopupEmulatorHistoryTable from './popup_emulator_history_table'
import ClearIcon from '@mui/icons-material/Clear'
import PropTypes from 'prop-types'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: '-3px -3px 7px #97949473, 2px 2px 7px rgb(137, 138, 138)',
  pt: 2,
  px: 2,
  pb: 2
}

const PopUpEmulatorHistory = ({
  showToast,
  handleClose,
  open,
  emulatorHistory
}) => {
  const { width } = useViewPort()
  const breakpoint = 620
  const isMobile = width < breakpoint

  const mobileStyle = {
    width: isMobile ? '90%' : '50%',
    maxWidth: '90vw' // Adjust the maximum width for smaller screens
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    handleClose(0)
  }

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box
          sx={{
            ...style,
            width: 'auto',
            height: 'auto',
            ...mobileStyle // Apply mobile styles
          }}
        >
          <div
            style={{
              display: 'flex',
              alignContent: 'center',
              justifyContent: 'space-between',
              marginBottom: '1rem'
            }}
          >
            <h3>HISTORY</h3>
            <ClearIcon onClick={(e) => handleSubmit(e)} />
          </div>
          {/* Ensure that PopupEmulatorHistoryTable is properly set inside the Box */}
          <PopupEmulatorHistoryTable
            data={emulatorHistory}
            showToast={showToast}
          />
        </Box>
      </Modal>
    </div>
  )
}

PopUpEmulatorHistory.propTypes = {
  showToast: PropTypes.func,
  handleClose: PropTypes.func,
  open: PropTypes.bool,
  emulatorHistory: PropTypes.array
}
export default PopUpEmulatorHistory
