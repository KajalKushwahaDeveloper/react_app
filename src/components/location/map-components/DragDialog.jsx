import React, { useEffect } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";
import { useEmulatorStore } from "../../../stores/emulator/store.tsx";
import { useStates } from "../../../StateProvider.js";
import ApiService from "../../../ApiService.js";
import { EMULATOR_DRAG_URL, TRIP_URL } from "../../../constants.js";

const MAX_DISTANCE_SNAP = 10;

export function DragDialog() {
  const { showToast } = useStates();
  const draggedEmulator = useEmulatorStore(
    (state) => state.draggedEmulator
  );

  const showLoader = useEmulatorStore.getState().showLoader;
  const hideLoader = useEmulatorStore.getState().hideLoader;

  const dragEmulator = useEmulatorStore((state) => state.dragEmulator);
  const movedEmulator = useEmulatorStore((state) => state.movedEmulator);

  const selectedEmulator = useEmulatorStore((state) => state.selectedEmulator);

  const [openDialog, setOpenDialog] = React.useState(false);
  const [dialogText, setDialogText] = React.useState("");
  const [payload, setPayload] = React.useState(null);

  const closeDragDialog = React.useCallback(() => {
    setOpenDialog(false);
    if (draggedEmulator !== null) {
      dragEmulator(null);
    }
    if (movedEmulator !== null) {
      dragEmulator(null);
    }
    if (payload !== null) setPayload(null);
    if (dialogText !== "") setDialogText("");
    hideLoader();
  }, [draggedEmulator, movedEmulator, payload, dialogText, hideLoader, dragEmulator]);

  function handleDialog(payload, text) {
    setPayload(payload);
    setOpenDialog(true);
    setDialogText(text);
  }

  useEffect(() => {
    async function tryUpdatingTrip(dragEmulatorRequest) {
      showLoader();
      const token = localStorage.getItem("token");
      const { success, data, error } = await ApiService.makeApiCall(
        TRIP_URL,
        "POST",
        { distance: 0 },
        token,
        dragEmulatorRequest.emulator.id
      );
      if (error) {
        // if error contains text 'Emulator Does not have a trip route!!' then set new location
        if (error.includes("Emulator Does not have a trip route!!")) {
          const payload = {
            emulatorId: dragEmulatorRequest.emulator.id,
            cancelTrip: false,
            newTripIndex: null,
            latitude: dragEmulatorRequest.latitude,
            longitude: dragEmulatorRequest.longitude,
          };
          handleDialog(
            payload,
            "Do you want to set new Location of this emulator?"
          );
        }
        return;
      }
      // got Trip Point, now check if it is selected emulator's trip else show toast to select emulator first!
      if (
        dragEmulatorRequest.emulator.id !== selectedEmulator?.id &&
        data !== null &&
        data !== undefined &&
        data.data.tripPoints !== null &&
        data.data.tripPoints !== undefined &&
        data.data.tripPoints.length > 0
      ) {
        showToast(
          "Please select this emulator first as a trip already exists.",
          "error"
        );
        closeDragDialog();
        return;
      }
      // else find nearest point or cancelation point
      const { nearestTripPoint, nearestDistance } = findNearestTripPoint(
        data.data.tripPoints,
        dragEmulatorRequest.latitude,
        dragEmulatorRequest.longitude
      );

      if (nearestDistance <= MAX_DISTANCE_SNAP) {
        const emulatorCurrentTripPointStopPoint = calculateNextStopPointIndex(
          dragEmulatorRequest.emulator.currentTripPointIndex,
          data.data.tripPoints
        );

        const nearestTripPointStopPoint = calculateNextStopPointIndex(
          nearestTripPoint.tripPointIndex,
          data.data.tripPoints
        );

        const previousTimeToReachStop =
          calculateTimeFromTripPointIndexToStopPoint(
            dragEmulatorRequest.emulator.currentTripPointIndex,
            emulatorCurrentTripPointStopPoint,
            dragEmulatorRequest.emulator.speed,
            data.data.tripPoints
          );

        const newTimeToReachStop = calculateTimeFromTripPointIndexToStopPoint(
          nearestTripPoint.tripPointIndex,
          nearestTripPointStopPoint,
          dragEmulatorRequest.emulator.speed,
          data.data.tripPoints
        );

        const { lat, lng, tripPointIndex } = nearestTripPoint;

        let payload = {
          emulatorId: dragEmulatorRequest.emulator.id,
          cancelTrip: false,
          newTripIndex: tripPointIndex,
          latitude: lat,
          longitude: lng,
        };

        handleDialog(
          payload,
          `${
            "The emulator will be snapped to nearest route under 10 miles range. The Previous time to reach next Stop Point was " +
            previousTimeToReachStop +
            ". The new location will take " +
            newTimeToReachStop +
            " to reach the same next station. Do you want to set new Location of this emulator?"
          }`
        );
      } else {
        let payload = {
          emulatorId: dragEmulatorRequest.emulator.id,
          cancelTrip: true,
          newTripIndex: -1,
          latitude: dragEmulatorRequest.latitude,
          longitude: dragEmulatorRequest.longitude,
        };

        handleDialog(
          payload,
          "This is too far from its current route, setting this as emulators new location will cancel the trip."
        );
      }
    }

    function calculateTimeFromTripPointIndexToStopPoint(
      startIndex,
      stop,
      velocity,
      tripPoints
    ) {
      if (
        startIndex == null ||
        stop == null ||
        velocity == null ||
        tripPoints == null
      ) {
        return `N/A`;
      }
      let distance = 0;
      tripPoints.forEach((path) => {
        if (
          path.tripPointIndex >= startIndex &&
          path.tripPointIndex <= stop.tripPointIndex
        ) {
          distance += path.distance;
        }
      });

      const remainingStopDistance = Math.floor(distance);
      const timeInHours = distance / velocity;
      if (timeInHours === Infinity) {
        return `Refreshing...`;
      }

      const hours = Math.floor(timeInHours);
      const minutes = Math.round((timeInHours - hours) * 60);

      return [`${hours} : ${minutes} : 00 GMT`, remainingStopDistance];
    }

    function calculateNextStopPointIndex(currentIndex, tripData) {
      let nextStopPoint = tripData?.stops?.find(
        (stop) => currentIndex < stop.tripPointIndex
      );
      return nextStopPoint;
    }

    function findNearestTripPoint(tripPoints, targetLat, targetLng) {
      return tripPoints.reduce((nearest, point) => {
        const { lat, lng } = point;
        const distance = haversine(lat, lng, targetLat, targetLng);
        if (distance < nearest.nearestDistance) {
          return { nearestDistance: distance, nearestTripPoint: point };
        }
        return nearest;
      }, { nearestDistance: Infinity, nearestTripPoint: null });
    }

    // 1. check if draggedEmulator is null or not, if null then close dialog
    if (draggedEmulator === null) {
      return;
    }
    // 2. if not yet dropped then close dialog
    if (draggedEmulator.isDragMarkerDropped === false) {
      return;
    }
    // 3. if isDragMarkerDropped is true then check if emulator, lat and long is present or not
    if (
      draggedEmulator.isDragMarkerDropped === true && (
      draggedEmulator.emulator === null ||
      draggedEmulator.latitude === null ||
      draggedEmulator.longitude === null)
    ) {
      return;
    }

    // 4. if emulator, lat and long is present and isDragMarkerDropped is true then try to update trip
    if(draggedEmulator.emulator && draggedEmulator.latitude && draggedEmulator.longitude && draggedEmulator.isDragMarkerDropped === true) {
      // send copy of draggedEmulator to tryUpdatingTrip function
      tryUpdatingTrip({ ...draggedEmulator });
      dragEmulator(null);
    }   
  }, [draggedEmulator, closeDragDialog, showToast, selectedEmulator?.id, dragEmulator]);

  function haversine(lat1, lon1, lat2, lon2) {
    // Convert latitude and longitude from degrees to radians
    lat1 = (lat1 * Math.PI) / 180;
    lon1 = (lon1 * Math.PI) / 180;
    lat2 = (lat2 * Math.PI) / 180;
    lon2 = (lon2 * Math.PI) / 180;

    // Haversine formula
    const dlat = lat2 - lat1;
    const dlon = lon2 - lon1;
    const a =
      Math.sin(dlat / 2) ** 2 +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(dlon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = 3959 * c; // Earth's radius in kilometers
    return distance;
  }

  const confirmNewLocation = async () => {
    if (payload === null) {
      showToast("Error: payload is null", "error");
      return;
    }
    const token = localStorage.getItem("token");
    const { success, data, error } = await ApiService.makeApiCall(
      EMULATOR_DRAG_URL,
      "POST",
      payload,
      token,
      null
    );
    if (success) {
      closeDragDialog();
    }
  };

  return (
    <Dialog open={openDialog} onClose={closeDragDialog}>
      <DialogTitle id="alert-dialog-title">{"logbook gps"}</DialogTitle>
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
  );
}

export default DragDialog;
