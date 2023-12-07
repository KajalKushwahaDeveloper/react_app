import React, { useEffect, useState, useRef } from "react";

import {
  GoogleMap,
  Polyline,
  Marker,
  InfoWindow,
  useJsApiLoader,
} from "@react-google-maps/api";

import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  setRef,
} from "@mui/material";
import "../../../scss/map.scss";

const GoogleMapContainer = ({
  paths,
  center,
  stops,
  selectedStop,
  handleMarkerClick,
  hoveredMarker,
  handleMarkerMouseOver,
  handleMarkerMouseOut,
  handleInfoWindowClose,
  selectedEmulator,
  emulator,
  emulators,
  endLat,
  endLng,
  startLat,
  startLng,
  handleEmulatorMarkerClick,
  handleEmulatorMarkerDragEnd,
  openDialog,
  onClose,
  DialogText,
  confirmNewLocation,
  calculateTimeFromTripPointIndexToStopPoint,
}) => {
  const mapRef = useRef(null);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyB1HsnCUe7p2CE8kgBjbnG-A8v8aLUFM1E",
    libraries: ["drawing", "places", "autocomplete"]
  });

  const [pathTraveled, setPathTraveled] = useState(null);
  const [pathNotTraveled, setPathNotTraveled] = useState(null);
  const [emulatorTimeLeftToReachNextStop, setEmulatorTimeLeftToReachNextStop] =
    useState("N/A");
  const [borderState, setBorderState] = useState(false);

  useEffect(() => {
    if (selectedEmulator != null && stops != null) {
      let selectedEmulatorNearestStopPoint = stops.find(
        (stop) => selectedEmulator.currentTripPointIndex < stop.tripPointIndex
      );
      const selectedEmulatorTimeToReachStop =
        calculateTimeFromTripPointIndexToStopPoint(
          selectedEmulator.currentTripPointIndex,
          selectedEmulatorNearestStopPoint,
          selectedEmulator.speed
        );
      setEmulatorTimeLeftToReachNextStop(selectedEmulatorTimeToReachStop);
    }
  }, [selectedEmulator, stops, calculateTimeFromTripPointIndexToStopPoint]);

  useEffect(() => {
    if (selectedEmulator !== null && selectedEmulator !== undefined) {
      if (paths !== null && paths !== undefined) {
        setPathTraveled(
          paths?.filter(
            (item, index) => index <= selectedEmulator.currentTripPointIndex
          )
        );
        setPathNotTraveled(
          paths?.filter(
            (item, index) => index >= selectedEmulator.currentTripPointIndex
          )
        );
        return;
      }
    }
    setPathTraveled();
    setPathNotTraveled();
    console.log(
      "selectedEmId changed at Map.js so pathTraveled also nulled",
      pathTraveled
    );
    console.log(
      "selectedEmId changed at Map.js so pathNotTraveled also nulled",
      pathNotTraveled
    );
  }, [selectedEmulator, paths]);

  const intervalRef = useRef(null);

  useEffect(() => {
    const calculatePath = () => {
      console.log("calculatePath");
      if (mapRef.current === null) {
        console.log("calculatePath ERROR mapRef null");
        return;
      }
      const bounds = new window.google.maps.LatLngBounds();
      paths.forEach(element => {
        bounds.extend(
          new window.google.maps.LatLng(element.lat, element.lng)
        );
      });
      console.log("bounds", bounds);
      mapRef.current.fitBounds(bounds);
    };

    if (paths === null) {
      clearInterval(intervalRef.current);
      return;
    }

    calculatePath();

    return () => {
      clearInterval(intervalRef.current);
    };
  }, [mapRef, paths]);

  const containerStyle = {
   position: "unset !important",
    width: "100%",
    height: "100%",
  };

  const onLoad = React.useCallback(function callback(map) {
    mapRef.current = map
  }, [])

  const onUnmount = React.useCallback(function callback(map) {
    mapRef.current = null
  }, [])

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      zoom={7}
      center={center}
      gestureHandling="none"
      zoomControl={false}
      options={{ scrollwheel: true }}
      onLoad={onLoad}
      onUnmount={onUnmount}
    >
      {pathTraveled != null && (
        <Polyline
          path={pathTraveled}
          options={{
            strokeColor: "#559900",
            strokeWeight: 6,
            strokeOpacity: 0.6,
            defaultVisible: true,
          }}
        />
      )}
      {pathNotTraveled != null && (
        <Polyline
          path={pathNotTraveled}
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
              {selectedStop.gasStation.map((gasStationAddressItem, index) => (
                <React.Fragment key={index}>
                  {index > 0 && ", "}
                  {gasStationAddressItem.long_name}
                </React.Fragment>
              ))}
            </p>

            <h3 style={{ color: "black" }}>Time To Reach: </h3>
            <p style={{ color: "black" }}>{emulatorTimeLeftToReachNextStop}</p>
          </div>
        </InfoWindow>
      )}

      {emulators !== null &&
        emulators
          ?.filter(
            (emulator) =>
              emulator.latitude !== null && emulator.longitude !== null
          )
          .map((emulator, index) => {
            const isActiveUser =
              emulator.status === "ACTIVE" && emulator.user !== null;

            var rotationAngle = 0;
            try {
              if (paths != null && emulator.currentTripPointIndex > -1) {
                rotationAngle =
                  paths[emulator.currentTripPointIndex].bearing;
              }
            } catch (e) {
              console.log("rotationAngle Error : ", e);
            }

            const isHovered = hoveredMarker?.id === emulator?.id;
            const isSelected = selectedEmulator?.id === emulator?.id;

            //PAUSED RESTING RUNNING STOP //HOVER SELECT DEFAULT //ONLINE OFFLINE INACTIVE 
            var icon_url = `images/${emulator.tripStatus}/`;
            if (isHovered) {
              icon_url = icon_url + "HOVER";
            } else if (isSelected) {
              icon_url = icon_url + "SELECT";
            } else {
              icon_url = icon_url + "DEFAULT";
            }
            icon_url = `${icon_url}/${emulator.status}.svg`;
            console.log("icon_url : ", icon_url);
            const emulatorIcon = {
              url: icon_url,
              scaledSize: new window.google.maps.Size(20, 20),
              anchor: new window.google.maps.Point(10, 10),
              labelStyle: {
                borderRadius: "50%",
                border: "3px solid #c2c7ce !important",
                transition: "all 3s ease",
              },
            };

            return (
              <React.Fragment key={index}>
                <Marker
                  icon={emulatorIcon}
                  position={{
                    lat: emulator.latitude,
                    lng: emulator.longitude,
                  }}
                  animation={0}
                  title={`${emulator.telephone} ${emulator.tripStatus}(${emulator.status})`}
                  labelStyle={{
                    textAlign: "center",
                    width: "auto",
                    color: "#000000",
                    fontSize: "12px",
                    padding: "1px",
                  }}
                  labelAnchor={{ x: "auto", y: "auto" }}
                  onClick={() => handleEmulatorMarkerClick(emulator)}
                  onMouseOver={() => handleMarkerMouseOver(emulator)}
                  onMouseOut={handleMarkerMouseOut}
                  draggable={true}
                  onDragStart={() => setBorderState(true)}
                  onDragEnd={(event) => {
                    handleEmulatorMarkerDragEnd(emulator, event);
                    setBorderState(false);
                  }}
                  // onDragEnd={(event) =>
                  //   handleEmulatorMarkerDragEnd(emulator, event)
                  // }
                ></Marker>
              </React.Fragment>
            );
          })}

      {endLat !== null && endLng !== null && (
        <Marker
          position={{ lat: startLat, lng: startLng }}
          icon={{
            url: "images/start_location.png",
            scaledSize: new window.google.maps.Size(30, 30),
            anchor: new window.google.maps.Point(15, 15),
            scale: 1,
          }}
        />
      )}

      {endLat !== null && endLng !== null && (
        <Marker
          position={{ lat: endLat, lng: endLng }}
          icon={{
            url: "images/stop_location.png",
            scaledSize: new window.google.maps.Size(30, 30),
            anchor: new window.google.maps.Point(15, 15),
            scale: 1,
          }}
        />
      )}
      <Dialog open={openDialog} onClose={onClose}>
        <DialogTitle id="alert-dialog-title">{"logbook gps"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {DialogText}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={confirmNewLocation} autoFocus>
            Confim
          </Button>
          <Button onClick={onClose} autoFocus>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </GoogleMap>
  ) : (
    <>Loading...</>
  );
};

export default React.memo(GoogleMapContainer);
