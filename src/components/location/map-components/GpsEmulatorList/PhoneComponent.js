import CallRoundedIcon from '@mui/icons-material/CallRounded'
import { CircularProgress, IconButton } from '@mui/material'
import React from 'react'
import { useEmulatorStore } from '../../../../stores/emulator/store.tsx'
import states from '../Phone/twilio/states'

export default function PhoneComponent(
  devices,
  emulator,
  handleCallIconClicked
) {
  const updateDeviceState = useEmulatorStore.getState().updateDeviceState
  const device = devices.find((device) => device.emulatorId === emulator.id)
  const deviceState = device?.state
  const deviceStatus = device?.device?._status

  if (deviceState === states.CONNECTING && deviceStatus === states.READY) {
    // FIXME: for now, taking care of bad state due to race condition happening at updateDeviceState()
    const deviceDataModelReady = {
      emulatorId: emulator.id,
      token: device.token,
      state: states.READY,
      conn: device.conn,
      device: device.device,
      number: emulator.telephone
    }
    updateDeviceState(deviceDataModelReady)
  }

  return (
    <div>
      {deviceState === states.CONNECTING ? (
        <span>
          <CircularProgress color="primary" size="1.5rem" />
        </span>
      ) : deviceState === states.OFFLINE ? (
        <IconButton size="small" disabled={true}>
          <CallRoundedIcon fontSize="small" sx={{ color: 'red' }} />
        </IconButton>
      ) : deviceState === states.INCOMING || deviceState === states.ON_CALL ? (
        <IconButton size="small" disabled={true}>
          <CallRoundedIcon fontSize="small" />
        </IconButton>
      ) : (
        // undefined states or null telephone
        <IconButton
          size="small"
          disabled={!emulator?.telephone || deviceState === undefined}
          onClick={() => handleCallIconClicked(emulator)}
        >
          <CallRoundedIcon fontSize="small" />
        </IconButton>
      )}
    </div>
  )
}
