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
import { TRIP_STOPS_URL, TRIP_URL, EMULATOR_URL } from "../../constants";

const Map = ({ showToast }) => {
  const [progress, setProgress] = useState(null);
  const [selectedEmId, setSelectedEmId] = useState(1);
  const [createTrip, setCreateTrip] = useState(false);

  const [pathsRoute, setPathsRoute] = useState(null);

  const defaultLat = 37.7749; // Default latitude
  const defaultLng = -122.4194; // Default longitude

  const [center, setCenter] = useState({
    lat: defaultLat,
    lng: defaultLng,
  });

  const mapRef = useRef(null);

  const handleCreateTripButton = () => {
    setCreateTrip(true);
  };

  const { data: paths } = useFetch(TRIP_URL + `/${selectedEmId}`);
  const { data: stops } = useFetch(TRIP_STOPS_URL + `/${selectedEmId}`);
  const { data: emulators } = useFetch(EMULATOR_URL);
  const [selectedStop, setSelectedStop] = useState(null);

  const velocity = 27; // 100km per hour
  let initialDate;
  let interval = null;
  const icon1 = {
    url: "https://images.vexels.com/media/users/3/154573/isolated/preview/bd08e000a449288c914d851cb9dae110-hatchback-car-top-view-silhouette-by-vexels.png",
    scaledSize: new window.google.maps.Size(40, 40),
    anchor: new window.google.maps.Point(20, 20),
    scale: 0.7,
  };

  useEffect(() => {
    if (paths === null) {
      return;
    }
    console.log("GOT PATH, CALCULATING ROUTE! paths : ", paths);
    const center = parseInt(paths.length / 2);
    setCenter({ lat: paths[center].lat, lng: paths[center + 5].lng });
    calculatePath();
    return () => {
      interval && window.clearInterval(interval);
    };
  }, [paths]);

  const getDistance = () => {
    // seconds between when the component loaded and now
    const differentInTime = (new Date() - initialDate) / 1000; // pass to seconds
    return differentInTime * velocity; // d = v*t -- thanks Newton!
  };

  useEffect(() => {
    if (pathsRoute === null) {
      console.log("CHANGED pathsRoute : Null Route");
    }
    console.log("CHANGED pathsRoute : ", pathsRoute);
  }, [pathsRoute]);

  useEffect(() => {
    if (emulators === null) {
      console.log("CHANGED emulators : Null emulators");
    }
    console.log("CHANGED emulators : ", emulators);
  }, [emulators]);

  const moveObject = (pathsRoute) => {
    const distance = getDistance();
    console.log("Move Path distance : ", distance);
    console.log("Move Path pathsRoute1212 : ", pathsRoute);
    if (!distance) {
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
      window.clearInterval(interval);
      console.log("MapTrip Completed!! Thank You !!");
      return; // it's the end!
    }
    const lastLine = progress[progress.length - 1];

    const lastLineLatLng = new window.google.maps.LatLng(
      lastLine.lat,
      lastLine.lng
    );

    const nextLineLatLng = new window.google.maps.LatLng(
      nextLine.lat,
      nextLine.lng
    );

    // distance of this line
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

  const calculatePath = () => {
    if (mapRef.current === null || paths === null || paths.length === 0) {
      return;
    }
    const bounds = new window.google.maps.LatLngBounds();
    setPathsRoute(
      paths.map((coordinates, i, array) => {
        bounds.extend(
          new window.google.maps.LatLng(coordinates.lat, coordinates.lng)
        );
        if (i === 0) {
          return { ...coordinates, distance: 0 }; // it begins here!
        }
        const { lat: lat1, lng: lng1 } = coordinates;
        const latLong1 = new window.google.maps.LatLng(lat1, lng1);

        const { lat: lat2, lng: lng2 } = array[0];
        const latLong2 = new window.google.maps.LatLng(lat2, lng2);

        // in meters:
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

  const startSimulation = useCallback(
    (pathsRoute) => {
      console.log("HELLO !!! PATHS : ", paths);
      console.log("HELLO !!! pathsRoute : ", pathsRoute);
      initialDate = new Date();
      setProgress(null);
      initialDate = new Date();
      interval = window.setInterval(moveObject(pathsRoute), 1000);
    },
    [interval, initialDate]
  );

  const mapUpdate = () => {
    const distance = getDistance();
    if (!distance) {
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
      point1 = progress[progress.length - 1];
      point2 = nextLine;
    } else {
      // it's the end, so use the latest 2
      point1 = progress[progress.length - 2];
      point2 = progress[progress.length - 1];
    }

    const point1LatLng = new window.google.maps.LatLng(point1.lat, point1.lng);
    const point2LatLng = new window.google.maps.LatLng(point2.lat, point2.lng);

    const angle = window.google.maps.geometry.spherical.computeHeading(
      point1LatLng,
      point2LatLng
    );
    const actualAngle = angle - 90;

    const marker = document.querySelector(`[src="${icon1.url}"]`);

    if (marker) {
      // when it hasn't loaded, it's null
      marker.style.transform = `rotate(${actualAngle}deg)`;
    }
  };

  const handleMarkerClick = (stop) => {
    setSelectedStop(stop);
  };

  const handleInfoWindowClose = () => {
    setSelectedStop(null);
  };

  const handleEmulatorMarkerClick = (emulator) => {
    setSelectedEmId(emulator.id);
  };

  const handleEmulatorMarkerDragEnd = (emulator, event) => {
    if (emulator.startLat === null) {
      const { latLng } = event;
      const lat = latLng.lat();
      const lng = latLng.lng();
      console.log(`New Latitude: ${lat}, New Longitude: ${lng}`);
    }
  };

  const handleEmulatorMarkerDragStart = (emulator) => {
    if (emulator.startLat) {
      showToast("Emulator has a Trip, Can't drag", "error"); // Replace with your own showToast method
    }
  };
  

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
            zIndex: 3,
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
        {createTrip && (
          <CreateTripTable selectedEmId={selectedEmId} showToast={showToast} />
        )}
      </div>
      {/* table */}

      <div className="gMapCont">
        {console.log("center changed : ", center)}
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
          {console.log("stops : ", stops)}
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
                {stop.tripPoints && stop.tripPoints.length > 0 && (
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
          {console.log("selectedStop : ", selectedStop)}
          {selectedStop && (
            <InfoWindow
              position={{ lat: selectedStop.lat, lng: selectedStop.lng }}
              onCloseClick={handleInfoWindowClose}
            >
              <div style={{ width : "auto" }}>
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
                  {selectedStop.gasStation.map((gasStationAddressItem, index) => (
                    <React.Fragment key={index}>
                      {index > 0 && ", "}
                      {gasStationAddressItem.long_name}
                    </React.Fragment>
                  ))}
                </p>
              </div>
            </InfoWindow>
          )}

          {progress && (
            <>
              <Polyline path={progress} options={{ strokeColor: "orange" }} />

              <Marker icon={icon1} position={progress[progress.length - 1]} />
            </>
          )}

          {emulators &&
            emulators.map((emulator, index) => (
              <React.Fragment key={index}>
                <Marker
                  position={{
                    lat: emulator.latitude,
                    lng: emulator.longitude,
                  }}
                  title={`Emulator ${emulator.id}`}
                  label={`S${emulator.id}`}
                  onClick={() => handleEmulatorMarkerClick(emulator)}
                  draggable={!emulator.startLat}
                  onDragStart={() => handleEmulatorMarkerDragStart(emulator)}
                  onDragEnd={(event) => handleEmulatorMarkerDragEnd(emulator, event)}
                />
              </React.Fragment>
            ))}
        </GoogleMap>
      </div>
    </Card>
  );
};

export default withScriptjs(withGoogleMap(Map));
