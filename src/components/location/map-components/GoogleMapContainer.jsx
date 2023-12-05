import React, { useEffect, useState } from "react";
import {
  GoogleMap,
  Polyline,
  Marker,
  InfoWindow,
} from "react-google-maps";
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
  const [pathTraveled, setPathTraveled] = useState(null);
  const [pathNotTraveled, setPathNotTraveled] = useState(null);
  const [emulatorTimeLeftToReachNextStop, setEmulatorTimeLeftToReachNextStop] =
    useState("N/A");

 
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
      if (pathsRoute !== null && pathsRoute !== undefined) {
        setPathTraveled(
          pathsRoute?.filter(
            (item, index) => index <= selectedEmulator.currentTripPointIndex
          )
        );
        setPathNotTraveled(
          pathsRoute?.filter(
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
          ?.filter(
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

            const isHovered = hoveredMarker === emulator;
            const isSelected = selectedEmulator === emulator;
            //PAUSED RESTING RUNNING STOP
            var icon_url = `images/${emulator.tripStatus}_`;
            //ONLINE OFFLINE
            if (isActiveUser) {
              icon_url = icon_url + "ONLINE_";
            } else {
              icon_url = icon_url + "OFFLINE_";
            }
            if (isHovered) {
              icon_url = icon_url + "HOVER.svg";
            } else if (isSelected) {
              icon_url = icon_url + "SELECT.svg";
            } else {
              icon_url = icon_url + ".svg";
            } 
            console.log("icon_url", icon_url);

            const emulatorIcon = {
              url: icon_url,
              scaledSize: new window.google.maps.Size(isSelected ? 40 : 20, isSelected ? 40 : 20),
              anchor: new window.google.maps.Point(isSelected ? 20 :10, isSelected ? 20 :10),
              labelStyle: {
                borderRadius: "50%",
                border: "3px solid #c2c7ce !important",
                transition: "all 3s ease",
              },
            };

            return (
              <React.Fragment key={index}>
                <MarkerWithLabel
                  icon={emulatorIcon}
                  position={{
                    lat: emulator.latitude,
                    lng: emulator.longitude,
                  }}
                  animation={2}
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
  );
};

export default GoogleMapContainer;
