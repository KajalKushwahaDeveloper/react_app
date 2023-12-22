import React, { useEffect, useState, useRef, useMemo } from "react";

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
} from "@mui/material";
import "../../../scss/map.scss";
import { useEmulatorStore } from "../../../stores/emulator/store.tsx";
import {
  compareSelectedEmulator,
  compareEmulators,
  compareTripData,
} from "../../../stores/emulator/types_maps.tsx";

const libraries = ["drawing", "places", "autocomplete"];

const GoogleMapContainer = ({
  center,
  selectedStop,
  handleMarkerClick,
  hoveredMarker,
  handleMarkerMouseOver,
  handleMarkerMouseOut,
  handleInfoWindowClose,
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
  setArrivalTime,
  totalTime,
  setRemainingDistance
}) => {
  
  const emulators = useEmulatorStore(
    (state) => state.emulators,
    (oldEmulators, newEmulators) => {
      const diff = compareEmulators(oldEmulators, newEmulators);
      if (diff === true) {
        console.log("emulators changed ");
      }
      compareEmulators(oldEmulators, newEmulators);
    }
  );

  const selectedEmulator = useEmulatorStore(
    (state) => state.selectedEmulator,
    (oldSelectedEmulator, newSelectedEmulator) => {
      // TODO  Check if compareSelectedEmulator is working as intented (Updating emulators only on shallow change)
      const diff = compareSelectedEmulator(
        oldSelectedEmulator,
        newSelectedEmulator
      );
      if (diff === true) {
        console.log("selectedEmulator changed (GoogleMapContainer)");
      }
      compareSelectedEmulator(oldSelectedEmulator, newSelectedEmulator);
    }
  );

  const tripData = useEmulatorStore(
    (state) => state.tripData,
    (oldTripData, newTripData) => compareTripData(oldTripData, newTripData)
  );

  console.log("TripData1:", tripData?.tripPoints);
  console.log("TripData2:", emulators);

  const pathTraveled = useEmulatorStore((state) => state.pathTraveled);
  const pathNotTraveled = useEmulatorStore((state) => state.pathNotTraveled);

  const mapRef = useRef(null);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyB1HsnCUe7p2CE8kgBjbnG-A8v8aLUFM1E",
    libraries: libraries,
  });

  const [emulatorTimeLeftToReachNextStop, setEmulatorTimeLeftToReachNextStop] =
    useState("N/A");

    useEffect(() => {
      if (selectedEmulator !== null && tripData !== null && tripData?.stops != null && selectedStop !== null) {
        const selectedEmulatorTimeToReachStop =
          calculateTimeFromTripPointIndexToStopPoint(
            selectedEmulator.currentTripPointIndex,
            selectedStop,
            selectedEmulator.speed
          );
        setEmulatorTimeLeftToReachNextStop(selectedEmulatorTimeToReachStop);
      }

      const startIndex = selectedEmulator?.currentTripPointIndex;
      const velocity = selectedEmulator?.speed;
      // Calculate remaining distance and time
      const tripDataArr = tripData?.tripPoints;
      const lastTripPointIndex = tripDataArr && tripDataArr[tripDataArr?.length - 1]?.tripPointIndex;
      let remainingDistance = 0;
      tripData?.tripPoints?.forEach((path) => {
        if (
          path.tripPointIndex >= startIndex &&
          path.tripPointIndex <= lastTripPointIndex
        ) {
          remainingDistance += path.distance;
        }
      });

      const remaingingTimeInHours = remainingDistance / velocity;

      const Remainginghours = Math.floor(remaingingTimeInHours);

      const remaingingTimeInMinutes = Math.round((remaingingTimeInHours - Remainginghours) * 60);

      const totalArrivalTime = `${Remainginghours} : ${remaingingTimeInMinutes} : 00 GMT`

      const remainingDistanceResp = Math.floor(remainingDistance);
      
      setRemainingDistance(remainingDistanceResp);
      setArrivalTime(totalArrivalTime);
      
    }, [
      selectedEmulator,
      calculateTimeFromTripPointIndexToStopPoint,
      tripData,
      selectedStop,
      setArrivalTime,
      setRemainingDistance
    ]);

  useMemo(() => {
    if (
      tripData === null ||
      mapRef.current === null ||
      mapRef.current === null ||
      mapRef.current === undefined
    ) {
      console.log(`fitBounds ERROR: ${tripData} mapRef: ${mapRef.current}`);
      return;
    }
    if (tripData.tripPoints === null || tripData.tripPoints.length <= 0) {
      console.log(
        `fitBounds ERROR tripData: ${tripData === null} mapRef: ${
          mapRef.current === null
        }`
      );
      return;
    }
    const bounds = new window.google.maps.LatLngBounds();
    tripData?.tripPoints?.forEach((element) => {
      bounds.extend(new window.google.maps.LatLng(element.lat, element.lng));
    });
    console.log("bounds", bounds);
    mapRef.current.fitBounds(bounds);
  }, [mapRef, tripData]);

  const containerStyle = {
    position: "unset !important",
    width: "100%",
    height: "100%",
  };

  const onLoad = React.useCallback(function callback(map) {
    mapRef.current = map;
  }, []);

  const onUnmount = React.useCallback(function callback(map) {
    mapRef.current = null;
  }, []);

  const darkMapStyle = [
    {
        featureType: "all",
        elementType: "labels.text.fill",
        stylers: [
            {
                "saturation": 36
            },
            {
                "color": "#000000"
            },
            {
                "lightness": 40
            }
        ]
    },
    {
        featureType: "all",
        elementType: "labels.text.stroke",
        stylers: [
            {
                "visibility": "on"
            },
            {
                "color": "#000000"
            },
            {
                "lightness": 16
            }
        ]
    },
    {
        featureType: "all",
        elementType: "labels.icon",
        stylers: [
            {
                "visibility": "off"
            }
        ]
    },
    {
        featureType: "administrative",
        elementType: "geometry.fill",
        stylers: [
            {
                "color": "#000000"
            },
            {
                "lightness": 20
            }
        ]
    },
    {
        featureType: "administrative",
        elementType: "geometry.stroke",
        stylers: [
            {
                "color": "#000000"
            },
            {
                "lightness": 17
            },
            {
                "weight": 1.2
            }
        ]
    },
    {
        featureType: "landscape",
        elementType: "geometry",
        stylers: [
            {
                "color": "#000000"
            },
            {
                "lightness": 20
            }
        ]
    },
    {
        featureType: "poi",
        elementType: "geometry",
        stylers: [
            {
                "color": "#000000"
            },
            {
                "lightness": 21
            }
        ]
    },
    {
        featureType: "road.highway",
        elementType: "geometry.fill",
        stylers: [
            {
                "color": "#000000"
            },
            {
                "lightness": 17
            }
        ]
    },
    {
        featureType: "road.highway",
        elementType: "geometry.stroke",
        stylers: [
            {
                "color": "#000000"
            },
            {
                "lightness": 29
            },
            {
                "weight": 0.2
            }
        ]
    },
    {
        featureType: "road.arterial",
        elementType: "geometry",
        stylers: [
            {
                "color": "#000000"
            },
            {
                "lightness": 18
            }
        ]
    },
    {
        featureType: "road.local",
        elementType: "geometry",
        stylers: [
            {
                "color": "#000000"
            },
            {
                "lightness": 16
            }
        ]
    },
    {
        featureType: "transit",
        elementType: "geometry",
        stylers: [
            {
                "color": "#000000"
            },
            {
                "lightness": 19
            }
        ]
    },
    {
        featureType: "water",
        elementType: "geometry",
        stylers: [
            {
                "color": "#000000"
            },
            {
                "lightness": 17
            }
        ]
    }
]

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      zoom={4}
      center={center}
      gestureHandling="none"
      zoomControl={false}
      options={{ scrollwheel: true, styles: darkMapStyle }}
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
      {tripData?.stops != null &&
        tripData?.stops.map((stop, index) => (
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
            <h6 style={{ color: "black" }}>Stop Address:</h6>
            <p style={{ color: "black", fontSize:"11px"}}>
              {selectedStop.address.map((addressItem, index) => (
                <React.Fragment key={index}>
                  {index > 0 && ", "}
                  {addressItem.long_name}
                </React.Fragment>
              ))}
            </p>
            <h6 style={{ color: "black" }}>Nearest Gas Station:</h6>
            <p style={{ color: "black", fontSize:"11px"}}>
              {selectedStop.gasStation.map((gasStationAddressItem, index) => (
                <React.Fragment key={index}>
                  {index > 0 && ", "}
                  {gasStationAddressItem.long_name}
                </React.Fragment>
              ))}
            </p>

            <h6 style={{ color: "black" }}>Arrival Time: </h6>
            <p style={{ color: "black", fontSize:"11px"}}>{emulatorTimeLeftToReachNextStop[0]}</p>

            <h6 style={{ color: "black" }}>Total Time: </h6>
            <p style={{ color: "black", fontSize:"11px"}}>{totalTime}</p>
            
            <h6 style={{ color: "black" }}>Remaining Distance: </h6>
            <p style={{ color: "black", fontSize:"11px"}}>{emulatorTimeLeftToReachNextStop[1]} miles</p>
          </div>
        </InfoWindow>
      )}

      {emulators !== null &&
        emulators
          ?.filter(
            (emulator) =>
              emulator.latitude !== null && emulator.longitude !== null
          )
        .map((emulator, _) => {
            console.log("emulatorComing:",emulator);
            const isHovered = hoveredMarker?.id === emulator?.id;
            const isSelected = selectedEmulator?.id === emulator?.id;

            //PAUSED RESTING RUNNING STOP //HOVER SELECT DEFAULT //ONLINE OFFLINE INACTIVE
            var arrowSymbol = null;
            var icon_url = `images/${emulator.tripStatus}/`;
            if (isHovered) {
              icon_url = icon_url + "HOVER";
            } else if (isSelected) {
              icon_url = icon_url + "SELECT";
            } else {
              icon_url = icon_url + "DEFAULT";
            }
            icon_url = `${icon_url}/${emulator.status}.svg`;

            if (isSelected) {
              var rotationAngle = null;
              try {
                if (
                  tripData?.tripPoints != null &&
                  tripData?.tripPoints.length > 0
                ) {
                  if (emulator.currentTripPointIndex < 0) {
                    rotationAngle = tripData?.tripPoints[0].bearing;
                  } else if (
                    emulator.currentTripPointIndex > tripData?.tripPoints.length
                  ) {
                    rotationAngle =
                      tripData?.tripPoints[tripData?.tripPoints.length - 1]
                        .bearing;
                  } else {
                    rotationAngle =
                      tripData?.tripPoints[emulator.currentTripPointIndex]
                        .bearing;
                  }
                  console.log("rotationAngle : ", rotationAngle);
                }
              } catch (e) {
                console.log("rotationAngle Error : ", e);
              }
              console.log("rotationAngle : ", rotationAngle);
              if (rotationAngle != null) {
                // PAUSED RESTING RUNNING STOP
                const arrowPath2 = `M50 10 L58 28 L42 28 Z`;
                arrowSymbol = {
                  path: arrowPath2,
                  fillColor: "#FFFFFF",
                  fillOpacity: 1,
                  strokeColor: "black",
                  strokeWeight: 2,
                  anchor: new window.google.maps.Point(50, 50),
                  rotation: rotationAngle,
                };
              }
            }

            const emulatorIcon = {
              url: icon_url,
              scaledSize: new window.google.maps.Size(20, 20),
              anchor: new window.google.maps.Point(10, 10),
            };
          
            return (
              <React.Fragment key={emulator.id}>
                <Marker
                  icon={emulatorIcon}
                  position={{
                    lat: emulator.latitude,
                    lng: emulator.longitude,
                  }}
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
                  onDragEnd={(event) => {
                    handleEmulatorMarkerDragEnd(emulator, event);
                  }}
                  zIndex={2}
                ></Marker>
                {isSelected && rotationAngle !== null && (
                  <Marker
                    icon={arrowSymbol}
                    position={{
                      lat: emulator.latitude,
                      lng: emulator.longitude,
                    }}
                    zIndex={1}
                  />
                )}
              </React.Fragment>
            );
          })}

      {endLat !== null && endLng !== null && (
        <Marker
          position={{ lat: startLat, lng: startLng }}
          icon={{
            url: "images/Origin.svg",
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
            url: "images/Destination.svg",
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
