import React, { useEffect, useState } from "react";
import {
  GoogleMap,
  Polyline,
  Marker,
  InfoWindow,
  Circle,
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
      if (pathsRoute !== null && pathsRoute !== undefined) {
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

            const isHovered = hoveredMarker === emulator;

            const emulatorIcon = {
              url: emulator
                ? `images/${emulator.tripStatus}_truck_icon_${
                    isActiveUser ? "blue" : "red"
                  }.png`
                : "images/blue_truck.png",
              // scaledSize: new window.google.maps.Size(24, 24),
              scaledSize: new window.google.maps.Size(
                isHovered ? 16 : 20, // Adjust the size for hover
                isHovered ? 16 : 20
              ),
              anchor: new window.google.maps.Point(isHovered ? 8 : 10, isHovered ? 8 : 10),
              // scale: isHovered ? 2 : 1,
              strokeWeight: 10,
              labelStyle: {
                borderRadius: "50%",
                border: "3px solid #c2c7ce !important",
                transition: "all 3s ease",
              },
            };

            const circleIcon = {
              path: window.google.maps.SymbolPath.CIRCLE,
              fillColor: "transparent", // Set the color you want for the circle
              fillOpacity: 0.5, // Adjust the opacity as needed
              scale: 3, // Adjust the scale to make it larger or smaller
              // strokeColor: isActiveUser? "#c2c7ce" : "black", // Set the border color
              strokeColor: !isActiveUser ? (borderState === true ? "transparent": "black") : "#c2c7ce", // Set the border color
              strokeWeight: 3, // Adjust the border thickness
            };
          

            if (isHovered) {
              circleIcon.scale = 10;
            }

            // console.log(emulator);

            return (
              <React.Fragment key={emulator.id}>
                {isHovered && (
                  <Marker
                    position={{
                      lat: emulator.latitude,
                      lng: emulator.longitude,
                    }}
                    icon={circleIcon}
                    clickable={false}
                    animation={0}
                    labelAnchor={{ x: "auto", y: "auto" }}
                    labelStyle={{
                      transition: "all 3s ease",
                    }}
                  />
                )}
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
                    handleEmulatorMarkerDragEnd(emulator, event)
                    setBorderState(false)
                  }
                }
                  // onDragEnd={(event) =>
                  //   handleEmulatorMarkerDragEnd(emulator, event)
                  // }
                >
                </Marker>
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
