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

  const [pathsRoute, setPathsRoute] = useState(null);

  const [isTableVisible, setIsTableVisible] = useState(false);
  const [startEmulation, setStartEmulation] = useState(null);
  const [createTripInfo, setCreateTripInfo] = useState();
  const [openDialog, setOpenDialog] = useState(false);
  const [DialogText, setDialogText] = useState('');
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
    setCreateTrip(true);
    setIsTableVisible(!isTableVisible);
  };

  console.log(selectedEmId);
  const { data: paths } = useFetch(TRIP_POINTS_URL + `/${selectedEmId}`);
  const { data: stops } = useFetch(TRIP_STOPS_URL + `/${selectedEmId}`);
  const { data: tripData } = useFetch(TRIP_URL + `/${selectedEmId}`);
  const { data: emulators, setData: setEmulators } = useFetch(EMULATOR_URL);
  const { data: emulator, setData: setEmulator } = useFetch(
    EMULATOR_URL + `/${selectedEmId}`
  );
  const [selectedStop, setSelectedStop] = useState(null);

  const emulatorIntervalRef = useRef(null);

  useEffect(() => {

    const calculatePath = () => {
      if (mapRef.current === null ) {
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

  const validateEmulatorData = (newEmulatorData) => {
    if (newEmulatorData === null) {
      return;
    }
    const { latitude, longitude, status, tripStatus, address } =
      newEmulatorData;
    const isEmulatorChanged =
      (emulator && emulator.latitude !== latitude) ||
      emulator.longitude !== longitude ||
      (emulator && emulator.tripStatus !== tripStatus) ||
      emulator.status !== status;

    if (isEmulatorChanged) {
      const updatedEmulators = emulators.map((emulator) => {
        if (emulator.id === newEmulatorData.id) {
          return {
            ...emulator, // Copy all properties from the current emulator
            ...newEmulatorData, // Copy all changed properties from newEmulatorData
          };
        }
        return emulator;
      });
      setEmulator(newEmulatorData);
      setEmulators(updatedEmulators);
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
          data.forEach((emulator) => {
            validateEmulatorData(emulator);
          });
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
    if (selectedEmId != null && emulators != null) {
      const findEmulator = emulators.filter(e => e.id === selectedEmId);
      if (findEmulator[0].startlat == null) {
        setCenter({ lat: findEmulator[0].latitude, lng: findEmulator[0].longitude });
      }
    }

    return () => {
      stopEmulatorInterval();
    };
  }, [selectedEmId, emulator, emulators, setEmulator, setEmulators]);


  const handleMarkerClick = (stop) => {
    setSelectedStop(stop);
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
    setDialogText('');
  };

  function haversine(lat1, lon1, lat2, lon2) {
    // Convert latitude and longitude from degrees to radians
    lat1 = lat1 * Math.PI / 180;
    lon1 = lon1 * Math.PI / 180;
    lat2 = lat2 * Math.PI / 180;
    lon2 = lon2 * Math.PI / 180;
  
    // Haversine formula
    const dlat = lat2 - lat1;
    const dlon = lon2 - lon1;
    const a = Math.sin(dlat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dlon / 2) ** 2;
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
      'nearestDistance': nearestDistance,
      'nearestTripPoint': nearestTripPoint
    };
  }

    function calculateNextStopPointIndex(currentIndex){
      let nextStopPoint = stops.find((stop) => currentIndex < stop.tripPointIndex);
      return nextStopPoint;
    }  

    function calculateTimeFromTripPointIndexToStopPoint(startIndex, stop, velocity){
      let distance = 0;
      paths.map((path) => {
        if (path.tripPointIndex >= startIndex && path.tripPointIndex <= stop.tripPointIndex) {
          distance += path.distance;
        }
      });
      const timeInHours = distance / velocity;
      const hours = Math.floor(timeInHours);
      const minutes = Math.round((timeInHours - hours) * 60);
      return `${hours} hours and ${minutes} minutes`;
    }  

  const handleEmulatorMarkerDragEnd = (emulator, event) => {
    const { id } = emulator;
    const { latLng } = event;
    const lat = latLng.lat();
    const lng = latLng.lng();
    setDragId(id);

    if (emulator.startLat !== null) {
      const { nearestDistance, nearestTripPoint} = findNearestMarker(pathsRoute, lat, lng);
      if(nearestDistance <= 10) {
        setDragOutRange();
        setNearestTripPoint(nearestTripPoint);
        const emulatorCurrentTripPointStopPoint = calculateNextStopPointIndex(emulator.currentTripPointIndex)
        const nearestTripPointStopPoint = calculateNextStopPointIndex(nearestTripPoint.tripPointIndex)
        const previousTimeToReachStop = calculateTimeFromTripPointIndexToStopPoint(emulator.currentTripPointIndex, emulatorCurrentTripPointStopPoint, emulator.speed)
        const newTimeToReachStop = calculateTimeFromTripPointIndexToStopPoint(nearestTripPoint.tripPointIndex, nearestTripPointStopPoint, emulator.speed)
        handleDialog(`${'The emulator will be snapped to nearest route under 10 miles range. The Previous time to reach next Stop Point was ' + previousTimeToReachStop + '. The new location will take ' + newTimeToReachStop + ' to reach the same next station. Do you want to set new Location of this emulator?'}`);
      } else {
        setNearestTripPoint();
        setDragOutRange({ lat, lng});
        handleDialog('This is too far from its current route, setting this as emulators new location will cancel the trip.');
      }
    } else {
      setDragOutRange();
      setNearestTripPoint();
      setDragWithoutTrip({lat, lng});
      handleDialog('Do you want to change the location of this emulator?');
    }
  };

  const confirmNewLocation = async () => {
    var payload 
    if(dragId && nearestTripPoint) {
      const { lat, lng } = nearestTripPoint;
      payload = { emulatorId : dragId, latitude : lat, longitude : lng, cancelTrip : false, newTripIndex: nearestTripPoint.tripPointIndex};
    }
    else if(dragId && draggOutRange) {
      const {lat, lng} = draggOutRange
      payload = { emulatorId : dragId, latitude : lat, longitude : lng, cancelTrip : true, newTripIndex: null };
    } else if (draggWithoutTrip) {
      const {lat, lng} = draggWithoutTrip;
      payload = { emulatorId : dragId, latitude : lat, longitude: lng, cancelTrip : false, newTripIndex: null };
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
        validateEmulatorData(data);
        setOpenDialog(false);
     } else if(error) {
        setOpenDialog(false);
     }
     setDragId();
  }

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
        selectedEmId={selectedEmId}
        emulators={emulators}
        tripData={tripData}
      />
      <GoogleMapContainer
        mapRef={mapRef}
        pathsRoute={pathsRoute}
        center={center}
        stops={stops}
        selectedStop={selectedStop}
        handleMarkerClick={handleMarkerClick}
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
      />
    </CardComponent>
  );
};

export default withScriptjs(withGoogleMap(Map));
