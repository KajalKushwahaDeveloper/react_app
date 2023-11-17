import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  GoogleMap,
  withScriptjs,
  withGoogleMap,
  Marker,
  Polyline,
  InfoWindow,
} from "react-google-maps";

import useFetch from "../hooks/useFetch";
import {
  TRIP_STOPS_URL,
  TRIP_POINTS_URL,
  EMULATOR_URL,
  TRIP_URL,
  EMULATOR_DRAG_URL,
  BASE_URL,
} from "../../constants";
import CardComponent from "./map-components/CardComponent";
import CreateTripButton from "./map-components/CreateTripButton.jsx";
import GpsOverlay from "./map-components/GpsOverlay";
import CreateTripOverlay from "./map-components/CreateTripOverlay";
import GoogleMapContainer from "./map-components/GoogleMapContainer";
import ApiService from "../../ApiService";

const Map = ({ showToast }) => {
  const [selectedEmId, setSelectedEmId] = useState(null);
  const [createTrip, setCreateTrip] = useState(false);
  const [showEmulatorNotSelectedToast, setShowEmulatorNotSelectedToast] =
    useState(false);
  const [pathsRoute, setPathsRoute] = useState(null);
  const [selectedEmulator, setSelectedEmulator] = useState(null);
  const [AssignedTelephoneNumber, setAssignedTelephoneNumber] = useState(0);
  const [isTableVisible, setIsTableVisible] = useState(false);
  const [startEmulation, setStartEmulation] = useState(null);
  const [createTripInfo, setCreateTripInfo] = useState();
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
  const mapRef = useRef(null);
  const intervalRef = useRef(null);

  const handleCreateTripButton = () => {
    if (selectedEmulator === null) {
      showToast("Emulator is not selected", "error"); //Emulator is not selected error
    } else if (AssignedTelephoneNumber === null) {
      console.log("Assigned number", AssignedTelephoneNumber);
      showToast("Telephone Number is not Assigned", "error"); //Telephone Number is not Assigned
    } else {
      setCreateTrip(true);
      setIsTableVisible(!isTableVisible);
    }
  };

  const { data: paths } = useFetch(TRIP_POINTS_URL + `/${selectedEmId}`);
  const { data: stops } = useFetch(TRIP_STOPS_URL + `/${selectedEmId}`);
  const { data: tripData } = useFetch(TRIP_URL + `/${selectedEmId}`);
  const { data: emulators, setData: setEmulators } = useFetch(EMULATOR_URL);
  const { data: emulator, setData: setEmulator } = useFetch(
    EMULATOR_URL + `/${selectedEmId}`
  );
  const [selectedStop, setSelectedStop] = useState(null);

  const [hoveredMarker, setHoveredMarker] = useState(null);

  const emulatorIntervalRef = useRef(null);

  useEffect(() => {
    const calculatePath = () => {
      if (mapRef.current === null) {
        return;
      }
      const bounds = new window.google.maps.LatLngBounds();
      setPathsRoute(
        paths.map((coordinates, i, array) => {
          bounds.extend(
            new window.google.maps.LatLng(coordinates.lat, coordinates.lng)
          );
          if (i === 0 && !startEmulation) {
            return { ...coordinates, distance: 0 }; // it begins here!
          }
          const { lat: lat1, lng: lng1 } = coordinates;
          const latLong1 = new window.google.maps.LatLng(lat1, lng1);

          const { lat: lat2, lng: lng2 } = array[startEmulation ? 1 : 0];
          const latLong2 = new window.google.maps.LatLng(lat2, lng2);
          console.log(mapRef.current);
          const distance =
            window.google.maps.geometry.spherical.computeDistanceBetween(
              latLong1,
              latLong2
            );

          return { ...coordinates, distance };
        })
      );

      mapRef.current.fitBounds(bounds);
    };

    if (paths === null) {
      setPathsRoute(null);
      return;
    }
    const center = parseInt(paths?.length / 2);
    setCenter({ lat: paths[center].lat, lng: paths[center + 5].lng });
    calculatePath();
    return () => {
      clearInterval(intervalRef.current);
    };
  }, [paths, startEmulation]);

  const validateEmulatorsData = (newEmulatorsData, newEmulatorData) => {
    var selectedEmulatorToValidate = null;
    if (newEmulatorData) {
      if (newEmulatorData.id === selectedEmId) {
        selectedEmulatorToValidate = newEmulatorData;
      }
      const updatedEmulators = emulators.map((oldEmulator) => {
        if (oldEmulator.id === newEmulatorData.id) {
          const isOldEmulatorChanged =
            oldEmulator.latitude !== newEmulatorData.latitude ||
            oldEmulator.longitude !== newEmulatorData.longitude ||
            oldEmulator.tripStatus !== newEmulatorData.tripStatus ||
            oldEmulator.address !== newEmulatorData.address ||
            oldEmulator.status !== newEmulatorData.status ||
            oldEmulator.currentTripPointIndex !==
              newEmulatorData.currentTripPointIndex;

          if (isOldEmulatorChanged) {
            return {
              ...oldEmulator,
              ...newEmulatorData,
            };
          }
        }
        return oldEmulator;
      });
      setEmulators(updatedEmulators);
    }

    if (newEmulatorsData) {
      selectedEmulatorToValidate = newEmulatorsData.find(
        (item) => item.id === selectedEmId
      );
      const updatedEmulators = emulators.map((oldEmulator) => {
        const newEmulatorData = newEmulatorsData.find(
          (item) => item.id === oldEmulator.id
        );
        if (newEmulatorData) {
          const isOldEmulatorChanged =
            oldEmulator.latitude !== newEmulatorData.latitude ||
            oldEmulator.longitude !== newEmulatorData.longitude ||
            oldEmulator.tripStatus !== newEmulatorData.tripStatus ||
            oldEmulator.address !== newEmulatorData.address ||
            oldEmulator.status !== newEmulatorData.status ||
            oldEmulator.currentTripPointIndex !==
              newEmulatorData.currentTripPointIndex;

          if (isOldEmulatorChanged) {
            return {
              ...oldEmulator,
              ...newEmulatorData,
            };
          }
        }
        return oldEmulator;
      });
      setEmulators(updatedEmulators);
    }

    if (selectedEmulatorToValidate) {
      console.log(
        `validating ID of newEmulatorData : ${selectedEmulatorToValidate}  `
      );
      validateEmulatorData(selectedEmulatorToValidate);
    }
  };

  const validateEmulatorData = (newEmulatorData) => {
    console.log(
      `validating ID : ${newEmulatorData.id} 
      currentTripPointIndex old : ${emulator.currentTripPointIndex} 
      currentTripPointIndex new : ${newEmulatorData.currentTripPointIndex} `
    );
    if (newEmulatorData === null) {
      return;
    }
    const {
      latitude,
      longitude,
      status,
      tripStatus,
      address,
      currentTripPointIndex,
    } = newEmulatorData;

    if (newEmulatorData.id === selectedEmId) {
      // Validate old selected emulator
      const isEmulatorChanged =
        emulator.latitude !== latitude ||
        emulator.longitude !== longitude ||
        emulator.tripStatus !== tripStatus ||
        emulator.address !== address ||
        emulator.status !== status ||
        emulator.currentTripPointIndex !== currentTripPointIndex;
      if (isEmulatorChanged) {
        setEmulator(newEmulatorData);
      }
    }
  };

  useEffect(() => {
    let emulatorInterval;
    const startEmulatorInterval = () => {
      const token = localStorage.getItem("token");
      emulatorInterval = setInterval(async () => {
        // Manually trigger the fetch to get the latest emulator data
        const { success, data, error } = await ApiService.makeApiCall(
          EMULATOR_URL,
          "GET",
          null,
          token
        );
        if (success) {
          validateEmulatorsData(data, null);
        } else {
          console.log("old Emulator ERROR : ", error);
        }
      }, 5000);
    };

    const stopEmulatorInterval = () => {
      clearInterval(emulatorInterval);
    };

    emulatorIntervalRef.current = {
      start: startEmulatorInterval,
      stop: stopEmulatorInterval,
    };

    // Start the emulator interval
    emulatorIntervalRef.current.start();

    return () => {
      stopEmulatorInterval();
    };
  }, [emulator, emulators, setEmulator, setEmulators]);

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
    console.log("Hovering : STARTED ", emulator.id);
    setHoveredMarker(emulator);
  };

  const handleMarkerMouseOut = () => {
    console.log("Hovering : ENDED");
    setHoveredMarker(null);
  };

  const handleInfoWindowClose = () => {
    setSelectedStop(null);
  };

  const handleEmulatorMarkerClick = (emulator) => {
    setSelectedEmId(emulator.id);
    clearInterval(intervalRef.current); // Clear any existing interval

    setStartEmulation(emulator); // Set the selected emulation as the start emulation
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

  function findNearestMarker(pathsRoute, targetLat, targetLng) {
    let nearestDistance = Infinity;
    let nearestTripPoint = null;

    for (const point of pathsRoute) {
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

    if (emulator.startLat !== null && emulator.tripStatus !== "STOP" && emulator.tripStatus !== "FINISHED") {
      const { nearestDistance, nearestTripPoint } = findNearestMarker(
        pathsRoute,
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
    } else {
      setDragOutRange();
      setNearestTripPoint();
      setDragWithoutTrip({ lat, lng });
    }
  };

  useEffect(() => {
    confirmNewLocation();
  }, [nearestTripPoint, draggOutRange, draggWithoutTrip]);

  const confirmNewLocation = async () => {
    if (!dragId) return;

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
      // setOpenDialog(false);
    } else if (error) {
      // setOpenDialog(false);
    }
    setDragId();
  };

  const startLat = pathsRoute ? pathsRoute[0].lat : null;
  const startLng = pathsRoute ? pathsRoute[0].lng : null;
  const endLat = pathsRoute ? pathsRoute[pathsRoute?.length - 1].lat : null;
  const endLng = pathsRoute ? pathsRoute[pathsRoute?.length - 1].lng : null;

  return (
    <CardComponent>
      <CreateTripButton onClick={handleCreateTripButton} />
      <CreateTripOverlay
        isTableVisible={isTableVisible}
        selectedEmId={selectedEmId}
        showToast={showToast}
        setIsTableVisible={setIsTableVisible}
        setSelectedEmId={setSelectedEmId}
        setCreateTripInfo={setCreateTripInfo}
      />
      <GpsOverlay
        showToast={showToast}
        setSelectedEmId={setSelectedEmId}
        setSelectedEmulator={setSelectedEmulator}
        selectedEmId={selectedEmId}
        emulators={emulators}
        tripData={tripData}
        selectedEmulator={selectedEmulator}
        emulator={emulator}
        AssignedTelephoneNumber={AssignedTelephoneNumber}
        setAssignedTelephoneNumber={setAssignedTelephoneNumber}
      />
      <GoogleMapContainer
        mapRef={mapRef}
        pathsRoute={pathsRoute}
        center={center}
        stops={stops}
        selectedStop={selectedStop}
        handleMarkerClick={handleMarkerClick}
        hoveredMarker={hoveredMarker}
        handleMarkerMouseOver ={handleMarkerMouseOver}
        handleMarkerMouseOut={handleMarkerMouseOut}
        handleInfoWindowClose={handleInfoWindowClose}
        selectedEmulator={emulator}
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
    </CardComponent>
  );
};

export default withScriptjs(withGoogleMap(Map));
