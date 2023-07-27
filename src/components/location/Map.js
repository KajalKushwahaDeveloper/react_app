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
import { TRIP_STOPS_URL, TRIP_POINTS_URL, EMULATOR_URL, TRIP_URL } from "../../constants";
import CardComponent  from "./map-components/CardComponent";
import CreateTripButton from "./map-components/CreateTripButton.jsx";
import GpsOverlay from "./map-components/GpsOverlay";
import CreateTripOverlay from "./map-components/CreateTripOverlay";
import GoogleMapContainer from "./map-components/GoogleMapContainer";
import ApiService from "../../ApiService";

const Map = ({ showToast }) => {
  const [selectedEmId, setSelectedEmId] = useState(1);
  const [createTrip, setCreateTrip] = useState(false);

  const [pathsRoute, setPathsRoute] = useState(null);

  const [isTableVisible, setIsTableVisible] = useState(false);
  const [startEmulation, setStartEmulation] = useState(null);
  const [createTripInfo, setCreateTripInfo] = useState();

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
  const { data: emulators, setData: setEmulators  } = useFetch(EMULATOR_URL);
  const { data: emulator, setData: setEmulator  } = useFetch(EMULATOR_URL + `/${selectedEmId}`);
  const [selectedStop, setSelectedStop] = useState(null);

  const velocity = 27; // 100km per hour
  let initialDate;

  const emulatorIntervalRef = useRef(null);

  const calculatePath = () => {
    if (mapRef.current === null || paths === null || paths?.length === 0) {
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

  useEffect(() => {
    if (paths === null) {
      return;
    }
    console.log("GOT PATH, CALCULATING ROUTE! paths : ", paths);
    const center = parseInt(paths?.length / 2);
    setCenter({ lat: paths[center].lat, lng: paths[center + 5].lng });
    calculatePath();
    return () => {
      clearInterval(intervalRef.current);
    };
  }, [paths]);

  useEffect(() => {
    let emulatorInterval;
  
    const checkCurrentLocation = (newEmulatorData) => {
      console.log('checkCurrentLocation');
      if (newEmulatorData === null) {
        return;
      }
      const { status, latitude, longitude } = newEmulatorData;
      const { tripStatus } = newEmulatorData;
      const isLocationChanged =
        emulator && emulator.latitude !== latitude || emulator.longitude !== longitude;
      
        const isEmulatorChanged =
        emulator && emulator.tripStatus !== tripStatus || emulator.status !== status;
      
      
        if (isLocationChanged || isEmulatorChanged) {
        const updatedEmulators = emulators.map((emulator) => {
          if (emulator.id === newEmulatorData.id) {
            return { ...emulator, status, latitude, longitude };
          }
          console.log("Emulator || updatedEmulator : ", emulator);
          return emulator;
        });
        setEmulator(newEmulatorData);
        setEmulators(updatedEmulators);
      }
    };
    
    const startEmulatorInterval = () => {
      const token = localStorage.getItem("token");
      emulatorInterval = setInterval(async () => {
        // Manually trigger the fetch to get the latest emulator data
        const { success, data, error } = await ApiService.makeApiCall(
          EMULATOR_URL + `/${selectedEmId}`,
          "GET",
          null,
          token
        );
        if (success) {
          console.log("Emulator || Emulator old Emulator : ", emulator);
          console.log("Emulator || Emulator new Emulator : ", data);
          checkCurrentLocation(data);
        } else {
          console.log("old Emulator ERROR : ", error);
        }
      }, 5000);
    };
  
    const stopEmulatorInterval = () => {
      clearInterval(emulatorInterval);
    };
  
    emulatorIntervalRef.current = { start: startEmulatorInterval, stop: stopEmulatorInterval };
  
    // Start the emulator interval
    emulatorIntervalRef.current.start();
  
    return () => {
      stopEmulatorInterval();
    };
  }, [selectedEmId, emulator, emulators, setEmulator, setEmulators]);
  

  useEffect(() => {
    if (pathsRoute === null) {
      console.log("CHANGED pathsRoute : Null Route");
    }
    console.log("CHANGED pathsRoute : ", pathsRoute);
  }, [pathsRoute]);

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
  
    // Update the start latitude and longitude based on the selected emulation
    setPathsRoute((prevPaths) =>
      prevPaths.map((coord) =>
        coord.id === 0
          ? { ...coord, lat: emulator.latitude, lng: emulator.longitude }
          : coord
      )
    );
  };
  

  const handleEmulatorMarkerDragEnd = (emulator, event) => {
    if (emulator.startLat === null) {
      const { latLng } = event;
      const lat = latLng.lat();
      const lng = latLng.lng();
      console.log(`New Latitude: ${lat}, New Longitude: ${lng}`);
      //TODO: send lat long to backed/emulator... update the emulator on map...
    }
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
      <GpsOverlay showToast={showToast} setSelectedEmId={setSelectedEmId} 
        emulators={emulators} tripData={tripData}/>
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
      />
    </CardComponent>
  );
};

export default withScriptjs(withGoogleMap(Map));
