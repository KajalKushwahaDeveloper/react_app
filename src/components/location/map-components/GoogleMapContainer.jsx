import React, { useEffect, useState } from "react";
import { GoogleMap, Polyline, Marker, InfoWindow } from "react-google-maps";
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';

const GoogleMapContainer = ({
  mapRef,
  pathsRoute,
  center,
  stops,
  selectedStop,
  handleMarkerClick,
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
  tripData
}) => {
  const [pathTraveled, setPathTraveled] = useState(null);
  const [pathNotTraveled, setPathNotTraveled] = useState(null);

  
  const convertTimeToReadableFormat = (timeInHours) => {
    const hours = Math.floor(timeInHours);
    const remainingMinutes = (timeInHours - hours) * 60;
    const minutes = Math.floor(remainingMinutes);
    const remainingSeconds = (remainingMinutes - minutes) * 60;
    const seconds = Math.floor(remainingSeconds);

    return `${hours} hours, ${minutes} minutes, ${seconds} seconds`;
  };

  useEffect(() => {
    if (selectedEmulator !== null) {
      if (pathsRoute !== null) {
        setPathTraveled(pathsRoute.filter((item, index) => index <= selectedEmulator.currentTripPointIndex));
        setPathNotTraveled(pathsRoute.filter((item, index) => index >= selectedEmulator.currentTripPointIndex));
      } else {
        setPathTraveled();
        setPathNotTraveled();
      }
    }
  }, [selectedEmulator, pathsRoute]);

  return (
    <div className="gMapCont">
      <GoogleMap ref={mapRef} defaultZoom={7} center={center}>
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

              <h3 style={{ color: "black" }}>Time: </h3>
              <p style={{ color: "black" }}>
              {convertTimeToReadableFormat(selectedStop.distance / tripData?.velocity)}
              </p>

              <h3 style={{ color: "black" }}>Time: </h3>
              <p style={{ color: "black" }}>
              {convertTimeToReadableFormat(selectedStop.distance / tripData?.velocity)}
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

              const isInActiveUserNull =
                emulator.status === "INACTIVE" && emulator.user === null;

              var rotationAngle = 0;
              try {
                if (pathsRoute != null && emulator.currentTripPointIndex > -1) {
                  rotationAngle = pathsRoute[emulator.currentTripPointIndex].bearing
                }
              } catch (e) {
                console.log("rotationAngle Error : ", e);
              }

              console.log("rotationAngle  : ", rotationAngle);
              const emulatorIcon = {
                url: isActiveUser
                  ? "images/green_truck.png"
                  : isInActiveUserNull
                    ? "images/truck.png"
                    : "images/blue_truck.png",
                scaledSize: new window.google.maps.Size(40, 40),
                anchor: new window.google.maps.Point(20, 20),
                scale: 0.7,
                //TODO rotation now working...
              };

              return (
                <React.Fragment key={index}>
                  <Marker
                    icon={emulatorIcon}
                    position={{
                      lat: emulator.latitude,
                      lng: emulator.longitude,
                    }}
                    animation={2}
                    title={
                      emulator?.id === selectedEmulator?.id
                        ? "selectedMarker"
                        : `S${emulator?.id}`
                    }
                    label={`Emulator ${emulator.id}`}
                    onClick={() => handleEmulatorMarkerClick(emulator)}
                    draggable={emulator?.id === selectedEmulator?.id ? true : false}
                    onDragEnd={(event) =>
                      handleEmulatorMarkerDragEnd(emulator, event)
                    }
                  />
                </React.Fragment>
              );
            })}

        {endLat !== null && endLng !== null && (
          <Marker
            position={{ lat: startLat, lng: startLng }}
            icon={{
              url: "images/start_location.png",
              scaledSize: new window.google.maps.Size(15, 15),
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
              scaledSize: new window.google.maps.Size(15, 15),
              anchor: new window.google.maps.Point(15, 15),
              scale: 0.3,
            }}
          />
        )}
        <Dialog
          open={openDialog}
          onClose={onClose}
        >
          <DialogTitle id="alert-dialog-title">
            {"logbook gps"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {DialogText}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={confirmNewLocation} autoFocus>Confim</Button>
            <Button onClick={onClose} autoFocus>Cancel</Button>
          </DialogActions>
        </Dialog>
      </GoogleMap>
    </div>
  );
};

export default GoogleMapContainer;
