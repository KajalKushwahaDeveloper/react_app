import React, { useEffect, useState } from "react";
import { GoogleMap, Polyline, Marker, InfoWindow, Circle } from "react-google-maps";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";
import "../../../scss/map.scss";

const {
  MarkerWithLabel,
} = require("react-google-maps/lib/components/addons/MarkerWithLabel");

const GoogleMapContainer = ({
  mapRef,
  pathsRoute,
  center,
  stops,
  selectedStop,
  handleMarkerClick,
  hoveredMarker,
  handleMarkerMouseOver,
  handleMarkerMouseOut,
  handleInfoWindowClose,
  selectedEmulator,
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
  const [pathTraveled, setPathTraveled] = useState(null);
  const [pathNotTraveled, setPathNotTraveled] = useState(null);
  const [emulatorTimeLeftToReachNextStop, setEmulatorTimeLeftToReachNextStop] =
    useState("N/A");


  const circleIcon = {
    path: window.google.maps.SymbolPath.CIRCLE,
    fillColor: "transparent", // Set the color you want for the circle
    fillOpacity: 0.5, // Adjust the opacity as needed
    scale: 10, // Adjust the scale to make it larger or smaller
    strokeColor: "black", // Set the border color
    strokeWeight: 2, // Adjust the border thickness
  };

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
    if (selectedEmulator !== null) {
      if (pathsRoute !== null) {
        setPathTraveled(
          pathsRoute.filter(
            (item, index) => index <= selectedEmulator.currentTripPointIndex
          )
        );
        setPathNotTraveled(
          pathsRoute.filter(
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
  }, [selectedEmulator, pathsRoute]);

  return (
    <div className="gMapCont">
      <GoogleMap
        ref={mapRef}
        defaultZoom={7}
        center={center}
        gestureHandling="none"
        zoomControl={false}
        options={{ scrollwheel: true }}
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
              <p style={{ color: "black" }}>
                {emulatorTimeLeftToReachNextStop}
              </p>
            </div>
          </InfoWindow>
        )}

        {emulators !== null &&
          emulators
            .filter(
              (emulator) =>
                emulator.latitude !== null && emulator.longitude !== null
            )
            .map((emulator, index) => {
              const isActiveUser =
                emulator.status === "ACTIVE" && emulator.user !== null;

              var rotationAngle = 0;
              try {
                if (pathsRoute != null && emulator.currentTripPointIndex > -1) {
                  rotationAngle =
                    pathsRoute[emulator.currentTripPointIndex].bearing;
                }
              } catch (e) {
                console.log("rotationAngle Error : ", e);
              }

              const emulatorIcon = {
                url: emulator
                  ? `images/${emulator.tripStatus}_truck_icon_${
                      isActiveUser ? "green" : "red"
                    }.png`
                  : "images/blue_truck.png",
                scaledSize: new window.google.maps.Size(20, 20),
                anchor: new window.google.maps.Point(10, 10),
                scale: 0.7,
              };

              const isHovered = hoveredMarker === emulator;

              if(isHovered) {
                // create a slightly larger circle icon and show behind the emulatorIcon.
              }

              return (
                <React.Fragment key={index}>
                  {isHovered && (
                    <Marker
                      position={{
                        lat: emulator.latitude,
                        lng: emulator.longitude,
                      }}
                      icon={circleIcon}
                      clickable={false}
                    />
                  )}
                  <MarkerWithLabel
                    icon={emulatorIcon}
                    position={{
                      lat: emulator.latitude,
                      lng: emulator.longitude,
                    }}
                    animation={2}
                    title={
                      emulator?.id === selectedEmulator?.id
                        ? "selectedMarker"
                        : `${emulator.telephone} ${emulator.tripStatus}(${emulator.status})`
                         
                    }
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
                    draggable = {true}
                    onDragEnd={(event) =>
                      handleEmulatorMarkerDragEnd(emulator, event)
                    }
                  >
                    <span>{`Em.${emulator.id}`}</span>
                  </MarkerWithLabel>
                </React.Fragment>
              );
            })}

        {endLat !== null && endLng !== null && (
          <Marker
            position={{ lat: startLat, lng: startLng }}
            icon={{
              url: "images/start_location.png",
              scaledSize: new window.google.maps.Size(10, 10),
              anchor: new window.google.maps.Point(15, 15),
              scale: 0.3,
            }}
          />
        )}

        {endLat !== null && endLng !== null && (
          <Marker
            position={{ lat: endLat, lng: endLng }}
            icon={{
              url: "images/start_location.png",
              scaledSize: new window.google.maps.Size(10, 10),
              anchor: new window.google.maps.Point(15, 15),
              scale: 0.3,
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
    </div>
  );
};

export default GoogleMapContainer;
