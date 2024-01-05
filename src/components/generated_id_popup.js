import React, { useEffect, useState } from 'react'
import { styled } from '@mui/material/styles'
import OutlinedInput from '@mui/material/OutlinedInput'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'
import PropTypes from 'prop-types'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import {
  USER_URL,
  EMULATOR_URL,
  EMULATOR_CHANGE_SSID_URL
} from '../constants'
import Radio from '@mui/material/Radio'
import FormControlLabel from '@mui/material/FormControlLabel'
import { Checkbox } from '@mui/material'
import ApiService from '../ApiService'

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2)
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1)
  }
}))

function BootstrapDialogTitle (props) {
  const { children, onClose, ...other } = props

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose
        ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 0,
            top: 0,
            color: (theme) => theme.palette.blue
          }}
        >
          <CloseIcon />
        </IconButton>
          )
        : null}
    </DialogTitle>
  )
}

BootstrapDialogTitle.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func
}
const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250
    }
  }
}

const ChangeEmulatorSsidPopup = (props) => {
  const {
    showToast,
    open,
    handleClose,
    emulatorToChangeSsid,
    handleAssignedUserToEmulator,
    setUpdateSerial
  } = props

  const [emulators, setEmulators] = useState()
  const [selectedUserId, setSelectedUserId] = useState()
  const [generateIdChecked, setGenerateIdChecked] = React.useState(false)

  const handleChangeRadio = (event) => {
    setSelectedUserId(event.target.value)
  }

  const handleGenerateIdChange = (event) => {
    setGenerateIdChecked(event.target.checked)
  }

  const handleSubmitChangeSsid = async () => {
    try {
      const emulatorId = emulatorToChangeSsid.id
      const emulatorSsid = selectedUserId
      const generateRandomNewUuid = generateIdChecked

      const token = localStorage.getItem('token')
      const payload = {
        emulatorId,
        emulatorSsid,
        generateRandomNewUuid
      }
      const { success, data } = await ApiService.makeApiCall(
        EMULATOR_CHANGE_SSID_URL,
        'POST',
        payload,
        token
      )
      if (success) {
        showToast('Emulator Updated ', 'success')
        handleClose(data.id, null)
        handleAssignedUserToEmulator(true, null, data)
      } else {
        showToast('Emulator Not Updated', 'error')
        handleAssignedUserToEmulator(false, 'error occurred', null)
      }
    } catch (error) {
      console.error('Error occurred while adding user:', error)
    }
    setUpdateSerial(true)
  }

  const handleChange = (event) => {
    const {
      target: { value }
    } = event

    setSelectedUserId(value)
  }

  useEffect(() => {
    // Fetch data from API
    const fetchUsers = async () => {
      const token = localStorage.getItem('token')
      try {
        const response = await fetch(USER_URL, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        })
        if (!response.ok || response.status !== 200) {
          return { success: false, error: 'Invalid credentials' }
        } else {
          const responseData = await response.text()

          const deserializedData = JSON.parse(responseData)

          setEmulators(deserializedData)
          return { success: true, error: null }
        }
      } catch (error) {
        console.error('User Data Error: ' + error)
      }

      const { success, data } = await ApiService.makeApiCall(
        EMULATOR_URL,
        'GET',
        null,
        token
      )
      if (success) {
        setEmulators(data)
        return { success: true, error: null }
      } else {
        showToast('Error Fetching Emulators', 'error')
        return { success: false, error: 'Error Fetching Emulators' }
      }
    }
    fetchUsers()
  }, [open, showToast])

  return (
    <div>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <BootstrapDialogTitle
          style={{
            marginTop: '1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontWeight: '75px'
          }}
          id="customized-dialog-title"
          onClose={handleClose}
        >
          Generate UUID Or Swap/Take from other emulators
        </BootstrapDialogTitle>
        <div>
          <DialogContent
            dividers
            sx={{ display: 'flex', flexDirection: 'column' }}
          >
            <FormControl sx={{ marginTop: '2rem' }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={generateIdChecked}
                    onChange={handleGenerateIdChange}
                  />
                }
                label="Generate new UUID"
              />
            </FormControl>
            <FormControl sx={{ m: 1, margin: '2rem' }}>
              {!generateIdChecked && (
                <>
                  <InputLabel
                    id="demo-multiple-name-label"
                    style={{ borderRadius: '2rem' }}
                  >
                    Id
                  </InputLabel>
                  <Select
                    labelId="demo-multiple-name-label"
                    id="demo-multiple-name"
                    onChange={handleChange}
                    input={<OutlinedInput label="Name" />}
                    MenuProps={MenuProps}
                  >
                    {emulators?.map((emulator) => (
                      <MenuItem
                        key={emulator.emulatorSsid}
                        value={emulator.emulatorSsid}
                      >
                        <FormControlLabel
                          value={emulator.emulatorSsid}
                          control={<Radio />}
                          onChange={(e) => handleChangeRadio(e)}
                        />
                        {emulator.id + ' ,' + emulator.emulatorSsid}
                      </MenuItem>
                    ))}
                  </Select>
                </>
              )}
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  variant="contained"
                  style={{ width: '2rem', marginTop: '2em' }}
                  onClick={() => handleSubmitChangeSsid()}
                >
                  Submit
                </Button>
              </div>
            </FormControl>
          </DialogContent>
        </div>
      </BootstrapDialog>
    </div>
  )
}

ChangeEmulatorSsidPopup.propTypes = {
  showToast: PropTypes.func,
  open: PropTypes.bool,
  handleClose: PropTypes.func,
  emulatorToChangeSsid: PropTypes.object,
  handleAssignedUserToEmulator: PropTypes.func,
  setUpdateSerial: PropTypes.func
}

export default ChangeEmulatorSsidPopup
