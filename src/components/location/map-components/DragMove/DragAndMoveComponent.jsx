import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material'
import React, { useEffect } from 'react'
import ApiService from '../../../../ApiService.js'
import { useStates } from '../../../../StateProvider.js'
import { EMULATOR_DRAG_URL } from '../../../../constants.js'
import { useEmulatorStore } from '../../../../stores/emulator/store.tsx'

const MAX_DISTANCE_SNAP = 10

export function DragAndMoveComponent() {
  const { showToast } = useStates()
  const draggedEmulatorOnTrip = useEmulatorStore(
    (state) => state.draggedEmulatorOnTrip
  )
  const dragEmulatorOnTrip = useEmulatorStore.getState().dragEmulatorOnTrip

  const showLoader = useEmulatorStore.getState().showLoader
  const hideLoader = useEmulatorStore.getState().hideLoader

  const movedEmulator = useEmulatorStore((state) => state.movedEmulator)

  const selectedEmulator = useEmulatorStore((state) => state.selectedEmulator)

  const [openDialog, setOpenDialog] = React.useState(false)
  const [dialogText, setDialogText] = React.useState('')
  const [payload, setPayload] = React.useState(null)

  const closeDragDialog = React.useCallback(() => {
    setOpenDialog(false)
    if (draggedEmulatorOnTrip !== null) {
      dragEmulatorOnTrip(null)
    }
    if (movedEmulator !== null) {
      dragEmulatorOnTrip(null)
    }
    if (payload !== null) setPayload(null)
    if (dialogText !== '') setDialogText('')
    hideLoader()
    dragEmulatorOnTrip(null)
  }, [
    dialogText,
    dragEmulatorOnTrip,
    draggedEmulatorOnTrip,
    hideLoader,
    movedEmulator,
    payload
  ])

  function handleDialog(payload, text) {
    setPayload(payload)
    setOpenDialog(true)
    setDialogText(text)
  }

  useEffect(() => {
    async function tryUpdatingTrip(dragEmulatorRequest) {
      showLoader()
      const tripPoints = useEmulatorStore.getState().tripData?.tripPoints
      if (tripPoints === null || tripPoints === undefined) {
        showToast(
          'Error: Failed to recognize trip route. Resetting changes!',
          'error'
        )
        dragEmulatorOnTrip(null)
        return
      }
      // find nearest point or cancelation point
      const { nearestTripPoint, nearestDistance } = findNearestTripPoint(
        tripPoints,
        dragEmulatorRequest.latitude,
        dragEmulatorRequest.longitude
      )

      if (nearestDistance <= MAX_DISTANCE_SNAP) {
        const { lat, lng, tripPointIndex } = nearestTripPoint

        const payload = {
          emulatorId: dragEmulatorRequest.emulator.id,
          cancelTrip: false,
          newTripIndex: tripPointIndex,
          latitude: lat,
          longitude: lng
        }
        handleDialog(
          payload,
          'The emulator will be snapped to nearest trip Point, Continue?'
        )
      } else {
        const payload = {
          emulatorId: dragEmulatorRequest.emulator.id,
          cancelTrip: true,
          newTripIndex: -1,
          latitude: dragEmulatorRequest.latitude,
          longitude: dragEmulatorRequest.longitude
        }

        handleDialog(
          payload,
          'The new position is too far from the trip route. Do you want cancel the trip and set this as new location?'
        )
      }
    }

    function findNearestTripPoint(tripPoints, targetLat, targetLng) {
      return tripPoints.reduce(
        (nearest, point) => {
          const { lat, lng } = point
          const distance = haversine(lat, lng, targetLat, targetLng)
          if (distance < nearest.nearestDistance) {
            return { nearestDistance: distance, nearestTripPoint: point }
          }
          return nearest
        },
        { nearestDistance: Infinity, nearestTripPoint: null }
      )
    }

    // 1. check if draggedEmulator is null or not, if null then close dialog
    if (draggedEmulatorOnTrip === null) {
      return
    }

    // 2. if not yet dropped then close dialog
    if (draggedEmulatorOnTrip.isDragMarkerDropped === false) {
      return
    }
    // 3. if isDragMarkerDropped is true then check if emulator, lat and long is present or not
    if (
      draggedEmulatorOnTrip.isDragMarkerDropped === true &&
      (draggedEmulatorOnTrip.emulator === null ||
        draggedEmulatorOnTrip.latitude === null ||
        draggedEmulatorOnTrip.longitude === null)
    ) {
      showToast(
        'Error: Failed to recognize new Position. Resetting Changes!',
        'error'
      )
      dragEmulatorOnTrip(null)
      return
    }

    // 4. if emulator, lat and long is present and isDragMarkerDropped is true then try to update trip
    if (
      draggedEmulatorOnTrip.emulator &&
      draggedEmulatorOnTrip.latitude &&
      draggedEmulatorOnTrip.longitude &&
      draggedEmulatorOnTrip.isDragMarkerDropped === true
    ) {
      // send copy of draggedEmulator to tryUpdatingTrip function
      tryUpdatingTrip({ ...draggedEmulatorOnTrip })
    }
  }, [
    draggedEmulatorOnTrip,
    closeDragDialog,
    showToast,
    selectedEmulator?.id,
    dragEmulatorOnTrip,
    showLoader
  ])

  function haversine(lat1, lon1, lat2, lon2) {
    // Convert latitude and longitude from degrees to radians
    lat1 = (lat1 * Math.PI) / 180
    lon1 = (lon1 * Math.PI) / 180
    lat2 = (lat2 * Math.PI) / 180
    lon2 = (lon2 * Math.PI) / 180

    // Haversine formula
    const dlat = lat2 - lat1
    const dlon = lon2 - lon1
    const a =
      Math.sin(dlat / 2) ** 2 +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(dlon / 2) ** 2
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    const distance = 3959 * c // Earth's radius in kilometers
    return distance
  }

  const confirmNewLocation = async () => {
    if (payload === null) {
      showToast(
        'Error: Failed to recognize new position. Resetting changes!',
        'error'
      )
      closeDragDialog()
      dragEmulatorOnTrip(null)
      return
    }
    const token = localStorage.getItem('token')
    const { success, error } = await ApiService.makeApiCall(
      EMULATOR_DRAG_URL,
      'POST',
      payload,
      token,
      null
    )
    if (success) {
      showToast('Emulator Location Updated', 'success')
      closeDragDialog()
      dragEmulatorOnTrip(null)
    } else {
      showToast(error, 'error')
      showToast('You can try again or close dialog to reset changes!', 'info')
    }
    hideLoader()
  }

  return (
    <Dialog open={openDialog} onClose={closeDragDialog}>
      <DialogTitle id="alert-dialog-title">{'logbook gps'}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {dialogText}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={confirmNewLocation} autoFocus>
          Confirm
        </Button>
        <Button onClick={closeDragDialog} autoFocus>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DragAndMoveComponent
