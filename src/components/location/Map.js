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
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import GpsTable from "../gps_page_table";
import CurrentLocation from "../current_location";
import CreateTripTable from "../create_trip_table";
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import { AccessAlarm, ThreeDRotation } from '@mui/icons-material';
import { TRIP_STOPS_URL, TRIP_URL, EMULATOR_URL } from "../../constants";

const Map = ({ showToast }) => {
  const [progress, setProgress] = useState(null);
  const [selectedEmId, setSelectedEmId] = useState(1);
  const [createTrip, setCreateTrip] = useState(false);

  const [pathsRoute, setPathsRoute] = useState(null);

  const [isTableVisible, setIsTableVisible] = useState(false);
  const [startEmulation, setStartEmulation] = useState(null);

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

  const { data: paths } = useFetch(TRIP_URL + `/${selectedEmId}`);
  const { data: stops } = useFetch(TRIP_STOPS_URL + `/${selectedEmId}`);
  const { data: emulators } = useFetch(EMULATOR_URL);
  const [selectedStop, setSelectedStop] = useState(null);

  const velocity = 27; // 100km per hour
  let initialDate;

  const icon = {
    url: "images/truck.png",
    scaledSize: new window.google.maps.Size(40, 40),
    anchor: new window.google.maps.Point(20, 20),
    scale: 0.7,
  };

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

  const getDistance = () => {
    const differentInTime = (new Date() - initialDate) / 1000; // pass to seconds
    return differentInTime * velocity; // d = v*t -- thanks Newton!
  };

  useEffect(() => {
    if (pathsRoute === null) {
      console.log("CHANGED pathsRoute : Null Route");
    }
    console.log("CHANGED pathsRoute : ", pathsRoute);
  }, [pathsRoute]);

  const moveObject = (pathsRoute) => {
    const distance = getDistance();
    console.log("Move Path distance : ", distance);
    console.log("Move Path pathsRoute1212 : ", pathsRoute);
    if (!distance || !pathsRoute) {
      return;
    }

    console.log("FILTERING : ", pathsRoute);
    let progress = pathsRoute?.filter(
      (coordinates) => coordinates.distance < distance
    );

    const nextLine = pathsRoute?.find(
      (coordinates) => coordinates.distance > distance
    );

    if (!nextLine) {
      setProgress(progress);
      clearInterval(intervalRef.current);
      console.log("MapTrip Completed!! Thank You !!");
      return; // it's the end!
    }
    const lastLine = progress[progress?.length - 1];

    const lastLineLatLng = new window.google.maps.LatLng(
      lastLine.lat,
      lastLine.lng
    );

    const nextLineLatLng = new window.google.maps.LatLng(
      nextLine.lat,
      nextLine.lng
    );

    const totalDistance = nextLine.distance - lastLine.distance;
    const percentage = (distance - lastLine.distance) / totalDistance;

    const position = window.google.maps.geometry.spherical.interpolate(
      lastLineLatLng,
      nextLineLatLng,
      percentage
    );

    mapUpdate();
    setProgress(progress.concat(position));
  };

  const mapUpdate = () => {
    const distance = getDistance();
    if (!distance || !pathsRoute) {
      return;
    }

    let progress = pathsRoute?.filter(
      (coordinates) => coordinates.distance < distance
    );

    const nextLine = pathsRoute?.find(
      (coordinates) => coordinates.distance > distance
    );

    let point1, point2;

    if (nextLine) {
      point1 = progress[progress?.length - 1];
      point2 = nextLine;
    } else {
      point1 = progress[progress?.length - 2];
      point2 = progress[progress?.length - 1];
    }

    const point1LatLng = new window.google.maps.LatLng(point1.lat, point1.lng);
    const point2LatLng = new window.google.maps.LatLng(point2.lat, point2.lng);

    const angle = window.google.maps.geometry.spherical.computeHeading(
      point1LatLng,
      point2LatLng
    );
    const actualAngle = angle - 90;

    const rotation = getMarkerRotation(progress); // Get the rotation angle for the truck

    const marker = document.querySelector(`[src="${icon.url}"]`);

    if (marker) {
      marker.style.transform = `rotate(${rotation}deg)`;
    }
  };

  const getMarkerRotation = (progress) => {
    if (!progress || progress.length < 2) {
      return 0; // Default rotation angle
    }

    const lastIndex = progress.length - 1;
    const secondLastIndex = lastIndex - 1;

    const lastLat = progress[lastIndex].lat;
    const lastLng = progress[lastIndex].lng;

    const secondLastLat = progress[secondLastIndex].lat;
    const secondLastLng = progress[secondLastIndex].lng;

    const angle = Math.atan2(
      lastLng - secondLastLng,
      lastLat - secondLastLat
    ) * (180 / Math.PI);

    return angle;
  };

  const handleMarkerClick = (stop) => {
    setSelectedStop(stop);
  };

  const handleInfoWindowClose = () => {
    setSelectedStop(null);
  };


  const startSimulation = useCallback(() => {
    console.log("HELLO !!! PATHS : ", paths);
    console.log("HELLO !!! pathsRoute : ", pathsRoute);
    initialDate = new Date();
    setProgress(null);
    initialDate = new Date();
    intervalRef.current = setInterval(() => {
      moveObject(pathsRoute);
    }, 1000);
  }, [intervalRef, initialDate, pathsRoute]);
  
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
  
    // Start the simulation
    intervalRef.current = setInterval(() => {
      moveObject(pathsRoute);
    }, 1000);
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
    <Card variant="outlined">
      <div className="btnCont">
        <Button variant="contained" onClick={() => startSimulation(pathsRoute)}>
          Start Simulation
        </Button>
      </div>
      <div>
        <button
          style={{
            zIndex: 2,
            position: "absolute",
            top: 10,
            left: 170,
            padding: ".65rem",
          }}
          onClick={handleCreateTripButton}
        >
          Create Trip
        </button>
      </div>
      {/* tables */}
      <div className="gps_overlay">
        <GpsTable showToast={showToast} setSelectedEmId={setSelectedEmId} />
        <CurrentLocation />
       
      </div>
      <div className="gps_createTrip_overlay">
        {isTableVisible && (
          <CreateTripTable
            selectedEmId={selectedEmId}
            showToast={showToast}
            setIsTableVisible={setIsTableVisible}
          />
          )}
       
      </div>
      {/* table */}

      <div className="gMapCont">
        <GoogleMap ref={mapRef} defaultZoom={7} center={center}>
          {pathsRoute != null && (
            <Polyline
              path={pathsRoute}
              options={{
                strokeColor: "#0088FF",
                strokeWeight: 6,
                strokeOpacity: 0.6,
                defaultVisible: true,
              }}
            />
          )}
          {stops != null &&
            stops.map((stop, index) => (
              <React.Fragment key={index}>
                <Marker
                  position={{
                    lat: stop.lat,
                    lng: stop.lng,
                  }}
                  title={"Stop" + stop.id}
                  label={`S${index + 1}`}
                  onClick={() => handleMarkerClick(stop)}
                />
                 {console.log("stop.tripPoints:", stop.tripPoints)}
                {stop.tripPoints && stop.tripPoints?.length > 0 && (
                
                  <Polyline
                    path={stop.tripPoints}
                    options={{
                      strokeColor: "#FF2200",
                      strokeWeight: 6,
                      strokeOpacity: 0.6,
                      defaultVisible: true,
                    }}
                  />
                )}
              </React.Fragment>
            ))}
          {selectedStop && (
            <InfoWindow
              position={{ lat: selectedStop.lat, lng: selectedStop.lng }}
              onCloseClick={handleInfoWindowClose}
            >
              <div style={{ width: "auto" }}>
                <h3 style={{ color: "black" }}>Stop Address:</h3>
                <p style={{ color: "black" }}>
                  {selectedStop.address.map((addressItem, index) => (
                    <React.Fragment key={index}>
                      {index > 0 && ", "}
                      {addressItem.long_name}
                    </React.Fragment>
                  ))}
                </p>
                <h3 style={{ color: "black" }}>Nearest Gas Station:</h3>
                <p style={{ color: "black" }}>
                  {selectedStop.gasStation.map(
                    (gasStationAddressItem, index) => (
                      <React.Fragment key={index}>
                        {index > 0 && ", "}
                        {gasStationAddressItem.long_name}
                      </React.Fragment>
                    )
                  )}
                </p>
              </div>
            </InfoWindow>
          )}

          {progress && (
            <>
              <Polyline path={progress} options={{ strokeColor: "orange" }} />

              <Marker icon={icon} position={progress[progress?.length - 1]} />
            </>
          )}
          {console.log("emulators : ", emulators)}
          {emulators != null &&
            emulators
              .filter(
                (emulator) =>
                  emulator.latitude !== null && emulator.longitude !== null
              )
              .map((emulator, index) => {
                const isActiveUser =
                  emulator.status === "ACTIVE" && emulator.user !== null;

                const isInActiveUserNull =
                  emulator.status === "INACTIVE" && emulator.user === null;

                const icon = {
                  url: isActiveUser
                    ? "images/green_truck.png"
                    : isInActiveUserNull
                    ? "images/truck.png"
                    : "images/blue_truck.png",
                  scaledSize: new window.google.maps.Size(40, 40),
                  anchor: new window.google.maps.Point(20, 20),
                  scale: 0.7,
                };

                return (
                  <React.Fragment key={index}>
                    <Marker
                      icon={icon}
                      position={{
                        lat: emulator.latitude,
                        lng: emulator.longitude,
                      }}
                      title={`Emulator ${emulator.id}`}
                      label={`S${emulator.id}`}
                      onClick={() => handleEmulatorMarkerClick(emulator)}
                      draggable={!emulator.startLat}
                      onDragEnd={(event) =>
                        handleEmulatorMarkerDragEnd(emulator, event)
                      }
                    />
                  </React.Fragment>
                );
              })}
{/* marker at the start of lat long */}
{/* {endLat !== null && endLng !== null && (
            <Marker
              position={{ lat: startLat, lng: startLng }}
              icon={{
                url: "images/start_location.png",
                scaledSize: new window.google.maps.Size(15, 15),
                anchor: new window.google.maps.Point(15, 15),
                scale: 0.3,
              }}
            />
          )} */}
          {/* marker at the end of lat long */}
          {endLat !== null && endLng !== null && (
            <Marker
              position={{ lat: endLat, lng: endLng }}
              icon={{
                url: "images/location_icon.png",
                scaledSize: new window.google.maps.Size(40, 40),
                anchor: new window.google.maps.Point(20, 20),
                scale: 0.7,
              }}
            />
          )}
          <AccessAlarm/>
        </GoogleMap>
      </div>
    </Card>
  );
};

export default withScriptjs(withGoogleMap(Map));
