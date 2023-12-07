import React, { useEffect, useState, useCallback, useRef } from "react";

import {
  EMULATOR_DRAG_URL,
} from "../../constants";

import GoogleMapContainer from "./map-components/GoogleMapContainer";
import ApiService from "../../ApiService";

import "../../css/mapbottomsheet.css";
import { useStates } from "../../StateProvider.js";

const Map = ({ showToast }) => {
  const {
    selectedEmId,
    paths,
    stops,
    tripData,
    emulators,
    setEmulators,
    emulator,
    setEmulator,
    setSelectedEmId,
    selectedEmulator,
    setSelectedEmulator,
    AssignedTelephoneNumber,
    setAssignedTelephoneNumber,
    isTableVisible, 
    setIsTableVisible,
    validateEmulatorsData,
    hoveredMarker,
    setHoveredMarker
  } = useStates();

  const [openDialog, setOpenDialog] = useState(false);
  const [DialogText, setDialogText] = useState("");
  const [dragId, setDragId] = useState();
  const [nearestTripPoint, setNearestTripPoint] = useState();
  const [draggOutRange, setDragOutRange] = useState();
  const [draggWithoutTrip, setDragWithoutTrip] = useState();

  const defaultLat = 37.7749; // Default latitude
  const defaultLng = -122.4194; // Default longitude

  const [center, setCenter] = useState({
    lat: defaultLat,
    lng: defaultLng,
  });

  const [selectedStop, setSelectedStop] = useState(null);



  useEffect(() => {
    if (selectedEmId != null && emulators != null) {
      const findEmulator = emulators.filter((e) => e.id === selectedEmId);
      if (findEmulator.length > 0 && findEmulator[0].startlat == null) {
        setCenter({
          lat: findEmulator[0].latitude,
          lng: findEmulator[0].longitude,
        });
      }
    }
  }, [selectedEmId]);

  const handleMarkerClick = (stop) => {
    setSelectedStop(stop);
  };
  
  const handleMarkerMouseOver = (emulator) => {
    setHoveredMarker(emulator);
  };

  const handleMarkerMouseOut = () => {
    setHoveredMarker(null);
  };

  const handleInfoWindowClose = () => {
    setSelectedStop(null);
  };

  const handleEmulatorMarkerClick = (emulator) => {
    setAssignedTelephoneNumber(emulator.telephone);
    if (selectedEmulator?.id !== emulator.id) {
      setSelectedEmulator(emulator);
      setSelectedEmId(emulator.id);
    } else {
      // Otherwise, un-select the selected emulator
    }
    // clearInterval(intervalRef.current); // Clear any existing interval
    // setStartEmulation(emulator); // Set the selected emulation as the start emulation
  };

  const handleDialog = (text) => {
    setOpenDialog(true);
    setDialogText(text);
  };

  const closeDialog = () => {
    setOpenDialog(false);
    setDialogText("");
  };

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

  function findNearestMarker(path, targetLat, targetLng) {
    let nearestDistance = Infinity;
    let nearestTripPoint = null;

    for (const point of path) {
      const { lat, lng } = point;
      const distance = haversine(lat, lng, targetLat, targetLng);
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestTripPoint = point;
      }
    }

    return {
      nearestDistance: nearestDistance,
      nearestTripPoint: nearestTripPoint,
    };
  }

  function calculateNextStopPointIndex(currentIndex) {
    let nextStopPoint = stops.find(
      (stop) => currentIndex < stop.tripPointIndex
    );
    return nextStopPoint;
  }

  function calculateTimeFromTripPointIndexToStopPoint(
    startIndex,
    stop,
    velocity
  ) {
    if (
      startIndex == null ||
      stop == null ||
      velocity == null ||
      paths == null
    ) {
      return `N/A`;
    }
    let distance = 0;
    paths.forEach((path) => {
      if (
        path.tripPointIndex >= startIndex &&
        path.tripPointIndex <= stop.tripPointIndex
      ) {
        distance += path.distance;
      }
    });
    const timeInHours = distance / velocity;
    if (timeInHours === Infinity) {
      return `Refreshing...`;
    }
    const hours = Math.floor(timeInHours);
    const minutes = Math.round((timeInHours - hours) * 60);
    return `~${hours} hours and ${minutes} minutes`;
  }

  const handleEmulatorMarkerDragEnd = (emulator, event) => {
    const { id } = emulator;
    const { latLng } = event;
    const lat = latLng.lat();
    const lng = latLng.lng();
    setDragId(id);
    // if emulator has no Trip
    if (emulator.startLat === null && emulator.tripStatus === "STOP") {
      setDragOutRange(null);
      setNearestTripPoint(null);
      setDragWithoutTrip({ lat, lng });
      return
    }

    if (emulator.id !== selectedEmId) {
      showToast("Please select this emulator first as a trip already exists.", "error")
      return
    }

    const { nearestDistance, nearestTripPoint } = findNearestMarker(
      paths,
      lat,
      lng
    );
    if (nearestDistance <= 10) {
      setDragOutRange();
      setNearestTripPoint(nearestTripPoint);
      const emulatorCurrentTripPointStopPoint = calculateNextStopPointIndex(
        emulator.currentTripPointIndex
      );
      const nearestTripPointStopPoint = calculateNextStopPointIndex(
        nearestTripPoint.tripPointIndex
      );
      const previousTimeToReachStop =
        calculateTimeFromTripPointIndexToStopPoint(
          emulator.currentTripPointIndex,
          emulatorCurrentTripPointStopPoint,
          emulator.speed
        );
      const newTimeToReachStop = calculateTimeFromTripPointIndexToStopPoint(
        nearestTripPoint.tripPointIndex,
        nearestTripPointStopPoint,
        emulator.speed
      );
      handleDialog(
        `${
          "The emulator will be snapped to nearest route under 10 miles range. The Previous time to reach next Stop Point was " +
          previousTimeToReachStop +
          ". The new location will take " +
          newTimeToReachStop +
          " to reach the same next station. Do you want to set new Location of this emulator?"
        }`
      );
    } else {
      setNearestTripPoint();
      setDragOutRange({ lat, lng });
      handleDialog(
        "This is too far from its current route, setting this as emulators new location will cancel the trip."
      );
    }
  };

  useEffect(() => {
    if(draggWithoutTrip !== null && draggWithoutTrip !== undefined)
    confirmNewLocation();
  }, [draggWithoutTrip]);

  const confirmNewLocation = async () => {
    if (!dragId) {
      console.log("No dragged Id present...");
      return;
    }

    let payload = {
      emulatorId: dragId,
      cancelTrip: false,
      newTripIndex: null,
    };

    if (nearestTripPoint) {
      const { lat, lng, tripPointIndex } = nearestTripPoint;
      payload.latitude = lat;
      payload.longitude = lng;
      payload.newTripIndex = tripPointIndex;
    } else if (draggOutRange) {
      const { lat, lng } = draggOutRange;
      payload.latitude = lat;
      payload.longitude = lng;
      payload.cancelTrip = true;
    } else if (draggWithoutTrip) {
      const { lat, lng } = draggWithoutTrip;
      payload.latitude = lat;
      payload.longitude = lng;
    }

    const token = localStorage.getItem("token");
    const { success, data, error } = await ApiService.makeApiCall(
      EMULATOR_DRAG_URL,
      "POST",
      payload,
      token,
      null
    );
    console.log("LOG 1 - updated Emulator: ", data);
    if (success) {
      validateEmulatorsData(null, data);
      setOpenDialog(false);
    } else if (error) {
      // setOpenDialog(false);
    }
    setDragId(null);
    setDragWithoutTrip(null);
    setDragOutRange(null);
    setNearestTripPoint(null);
  };

  const startLat = paths ? paths[0].lat : null;
  const startLng = paths ? paths[0].lng : null;
  const endLat = paths ? paths[paths?.length - 1].lat : null;
  const endLng = paths ? paths[paths?.length - 1].lng : null;

  return (
    <GoogleMapContainer
      paths={paths}
      center={center}
      stops={stops}
      selectedStop={selectedStop}
      handleMarkerClick={handleMarkerClick}
      hoveredMarker={hoveredMarker}
      handleMarkerMouseOver={handleMarkerMouseOver}
      handleMarkerMouseOut={handleMarkerMouseOut}
      handleInfoWindowClose={handleInfoWindowClose}
      selectedEmulator={selectedEmulator}
      emulator={emulator}
      emulators={emulators}
      endLat={endLat}
      endLng={endLng}
      startLat={startLat}
      startLng={startLng}
      handleEmulatorMarkerClick={handleEmulatorMarkerClick}
      handleEmulatorMarkerDragEnd={handleEmulatorMarkerDragEnd}
      openDialog={openDialog}
      onClose={closeDialog}
      DialogText={DialogText}
      confirmNewLocation={confirmNewLocation}
      calculateTimeFromTripPointIndexToStopPoint={
        calculateTimeFromTripPointIndexToStopPoint
      }
    />
  );
};

export default Map;
