import React, { useEffect, useState } from "react";

import {
  EMULATOR_DRAG_URL, EMULATOR_URL,
} from "../../constants";

import GoogleMapContainer from "./map-components/GoogleMapContainer";
import ApiService from "../../ApiService";

import "../../css/mapbottomsheet.css";
import { useStates } from "../../StateProvider.js";
import { useEmulatorStore } from "../../stores/emulator/store.tsx";
import { compareTripData } from "../../stores/emulator/types_maps.tsx";
import useFetch from "../../hooks/useFetch.js";
import { compareSelectedEmulatorChangedNullOrId } from "./utils.tsx";

const Map = () => {
  console.log("Map refreshed");
  
  const fetchEmulators = useEmulatorStore((state) => state.fetchEmulators);
  console.log("fetchEmulators: ", fetchEmulators);

  const selectedEmulator = useEmulatorStore(
    (state) => state.selectedEmulator,
    (oldSelectedEmulator, newSelectedEmulator) => {
      // Check if compareSelectedEmulator is working as intented (Updating emulators only on shallow change)
      const diff = compareSelectedEmulatorChangedNullOrId(oldSelectedEmulator, newSelectedEmulator);
      if(diff === true) {
        console.warn("selectedEmulator Changed (Map)");
      }
      compareSelectedEmulatorChangedNullOrId(oldSelectedEmulator, newSelectedEmulator)
    }
  );

  const tripData = useEmulatorStore(
    (state) => state.tripData,
    (oldTripData, newTripData) => {
      const diff = compareTripData(oldTripData, newTripData);
      if(diff === true) {
        console.warn("tripData changed (Map)");
      }
      compareTripData(oldTripData, newTripData)
    }
  );

  const center = useEmulatorStore((state) => state.center);
  
  const createDevices = useEmulatorStore((state) => state.createDevices);

  const { data } = useFetch(EMULATOR_URL)
  
  useEffect(() => {
    console.log("Map.js - useEffect - data: ", data);
    if(data !== null) {
      createDevices(data);
    }
  }, [createDevices, data]);

  const {
    hoveredMarker,
    setHoveredMarker,
    showToast,
  } = useStates();

  const [openDialog, setOpenDialog] = useState(false);
  const [DialogText, setDialogText] = useState("");
  const [dragId, setDragId] = useState();
  const [nearestTripPoint, setNearestTripPoint] = useState();
  const [dragOutRange, setDragOutRange] = useState();
  const [dragWithoutTrip, setDragWithoutTrip] = useState();

  const [selectedStop, setSelectedStop] = useState(null);


  const handleMarkerClick = (stop) => {
    setSelectedStop(stop);
  };


  const handleInfoWindowClose = () => {
    setSelectedStop(null);
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
    let nextStopPoint = tripData?.stops?.find(
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
      tripData?.tripPoints == null
    ) {
      return `N/A`;
    }
    let distance = 0;
    tripData?.tripPoints.forEach((path) => {
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
  
  const handleMarkerMouseOver = (emulatorId) => {
    //find from store
    const emulator = data.find((emulator) => emulator.id === emulatorId);
    setHoveredMarker(emulator);
  };

  const handleMarkerMouseOut = () => {
    setHoveredMarker(null);
  };

  const handleEmulatorMarkerDragEnd = (emulatorId, event) => {
    const emulator = data.find((emulator) => emulator.id === emulatorId);
    if(emulator === undefined) {
      console.log("Emulator not found in data");
      return;
    }
    const { latLng } = event;
    const lat = latLng.lat();
    const lng = latLng.lng();
    setDragId(emulatorId);
    // if emulator has no Trip
    if (emulator.startLat === null && emulator.tripStatus === "STOP") {
      setDragOutRange(null);
      setNearestTripPoint(null);
      setDragWithoutTrip({ lat, lng });
      return
    }

    if (emulator.id !== selectedEmulator?.id) {
      showToast("Please select this emulator first as a trip already exists.", "error")
      return
    }

    const { nearestDistance, nearestTripPoint } = findNearestMarker(
      tripData?.tripPoints,
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
    if(dragWithoutTrip !== null && dragWithoutTrip !== undefined)
    confirmNewLocation();
  }, [dragWithoutTrip]);

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
    } else if (dragOutRange) {
      const { lat, lng } = dragOutRange;
      payload.latitude = lat;
      payload.longitude = lng;
      payload.cancelTrip = true;
    } else if (dragWithoutTrip) {
      const { lat, lng } = dragWithoutTrip;
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
      fetchEmulators();
      setOpenDialog(false);
    } else if (error) {
      // setOpenDialog(false);
    }
    setDragId(null);
    setDragWithoutTrip(null);
    setDragOutRange(null);
    setNearestTripPoint(null);
  };


  return (
    <GoogleMapContainer
      center={center}
      selectedStop={selectedStop}
      handleMarkerClick={handleMarkerClick}
      hoveredMarker={hoveredMarker}
      handleMarkerMouseOver={handleMarkerMouseOver}
      handleMarkerMouseOut={handleMarkerMouseOut}
      handleInfoWindowClose={handleInfoWindowClose}
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
