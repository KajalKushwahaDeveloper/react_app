import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import OutlinedInput from '@mui/material/OutlinedInput'
import Select from '@mui/material/Select'
import { styled } from '@mui/material/styles'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'

import CloseIcon from '@mui/icons-material/Close'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import IconButton from '@mui/material/IconButton'
import { USER_ASSIGN_EMULATOR_URL, USER_URL } from '../constants'

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2)
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1)
  }
}))

function BootstrapDialogTitle(props) {
  const { children, onClose, ...other } = props

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
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
      ) : null}
    </DialogTitle>
  )
}

BootstrapDialogTitle.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired
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

const UserAssignDropDown = (props) => {
  const {
    showToast,
    open,
    close,
    emulatorToAssignUser,
    handleAssignedUserToEmulator
  } = props

  const [userName, setuserName] = React.useState([])
  const [users, setUsers] = useState([])
  const [selectedUserId, SetSelectedUserId] = useState()

  const handleUserSelect = async (userId) => {
    try {
      const { success, error, data } = await setUserToEmulator(
        emulatorToAssignUser.id,
        selectedUserId
      )

      if (success) {
        if (emulatorToAssignUser != null) {
          handleAssignedUserToEmulator(success, error, data)
        } else {
          handleAssignedUserToEmulator(success, error, null)
        }
        showToast('User Added', 'success')
      } else {
        showToast(error || 'Failed to add user', 'error')
      }
    } catch (error) {
      console.error('Error occurred while adding user:', error)
    }
  }

  const handleChange = (event) => {
    const {
      target: { value }
    } = event

    SetSelectedUserId(value)
    setuserName(value)
  }

  const setUserToEmulator = async (emulatorId, UserId) => {
    const toAssign = {
      user: { id: UserId },
      emulatorDetails: { id: emulatorId }
    }

    const token = localStorage.getItem('token')
    const response = await fetch(USER_ASSIGN_EMULATOR_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(toAssign)
    })
    if (!response.ok || response.status !== 200) {
      return { success: false, error: 'Failed to assign user', data: null }
    }
    const result = await response.json()
    return { success: true, error: null, data: result }
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

          setUsers(deserializedData)
          return { success: true, error: null }
        }
      } catch (error) {
        console.error('User Data Error: ' + error)
      }
    }

    fetchUsers()
  }, [open])

  return (
    <div>
      <BootstrapDialog
        onClose={close}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <BootstrapDialogTitle
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontWeight: '100px'
          }}
          id="customized-dialog-title"
          onClose={close}
        >
          Select User:
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <FormControl sx={{ m: 1, width: 300, margin: '2rem' }}>
            <InputLabel
              id="demo-multiple-name-label"
              style={{ borderRadius: '2rem' }}
            >
              Users
            </InputLabel>
            <Select
              labelId="demo-multiple-name-label"
              id="demo-multiple-name"
              value={userName}
              onChange={handleChange}
              input={<OutlinedInput label="Name" />}
              MenuProps={MenuProps}
            >
              {users
                ?.filter((userData) => userData.status === 'ENABLED')
                .map((user) => (
                  <MenuItem key={user.id} value={user.id}>
                    {user.firstName} {user.lastName}
                  </MenuItem>
                ))}
            </Select>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                style={{ width: '2rem', marginTop: '2em' }}
                onClick={() => handleUserSelect()}
              >
                Add
              </Button>
            </div>
          </FormControl>
        </DialogContent>
      </BootstrapDialog>
    </div>
  )
}
export default UserAssignDropDown
