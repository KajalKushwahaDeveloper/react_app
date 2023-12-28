import React from "react";
import { Polyline, Marker } from "@react-google-maps/api";
import { useEmulatorStore } from "../../../../stores/emulator/store.tsx";
import { compareTripDataChangedNullOrId } from "./utils.tsx";

export function StopComponents(props) {
  console.log("StopComponents refreshed");

  const tripData = useEmulatorStore(
    (state) => state.tripData,
    (oldTripData, newTripData) => compareTripDataChangedNullOrId(oldTripData, newTripData)
  );

  const startLat = tripData?.tripPoints ? tripData?.tripPoints[0].lat : null;
  const startLng = tripData?.tripPoints ? tripData?.tripPoints[0].lng : null;
  const endLat = tripData?.tripPoints ? tripData?.tripPoints[tripData?.tripPoints?.length - 1].lat : null;
  const endLng = tripData?.tripPoints ? tripData?.tripPoints[tripData?.tripPoints?.length - 1].lng : null;

  return (
    <React.Fragment>
      {tripData?.stops != null &&
        tripData?.stops.map((stop, index) => (
          <React.Fragment key = {index}>
            <Marker
              position={{
                lat: stop.lat,
                lng: stop.lng,
              }}
              title={"Stop" + stop.id}
              label={`S${index + 1}`}
              onClick={() => props.handleMarkerClick(stop)}
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

      {endLat !== null && endLng !== null && (
        <Marker
          position={{ lat: startLat, lng: startLng }}
          icon={{
            url: "images/Origin.svg",
            scaledSize: new window.google.maps.Size(30, 30),
            anchor: new window.google.maps.Point(12, 30),
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
            anchor: new window.google.maps.Point(12, 30),
            scale: 1,
          }}
        />
      )}
   
    </React.Fragment>
  );
}
