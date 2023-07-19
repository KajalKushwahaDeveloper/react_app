// GoogleMapContainer.jsx
import React from "react";
import { GoogleMap, Polyline, Marker, InfoWindow } from "react-google-maps";
import "../../../scss/map.scss"
const GoogleMapContainer = ({
  mapRef,
  pathsRoute,
  center,
  stops,
  selectedStop,
  handleMarkerClick,
  handleInfoWindowClose,
  progress,
  icon,
  emulators,
  endLat,
  endLng,
  startLat,
  startLng,
  handleEmulatorMarkerClick,
  handleEmulatorMarkerDragEnd,
}) => {
  return (
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
            </div>
          </InfoWindow>
        )}

        {progress && (
          <>
            <Polyline path={progress} options={{ strokeColor: "orange" }} />
            <Marker icon={icon} position={progress[progress?.length - 1]} />
          </>
        )}

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
      </GoogleMap>
    </div>
  );
};

export default GoogleMapContainer;
