import React from "react";
import { Polyline, Marker } from "@react-google-maps/api";
import { useEmulatorStore } from "../../../../stores/emulator/store.tsx";
import { compareTripDataChangedNullOrId } from "./utils.tsx";
import { useStates } from "../../../../StateProvider.js";
import ApiService from "../../../../ApiService.js";
import { TRIP_STOPS_URL } from "../../../../constants.js";

export function StopComponents(props) {
  const { showToast } = useStates();
  const tripData = useEmulatorStore(
    (state) => state.tripData,
    (oldTripData, newTripData) => {
      compareTripDataChangedNullOrId(oldTripData, newTripData);
    }
  );

  const selectedEmulator = useEmulatorStore((state) => state.selectedEmulator);
  const setTripData = useEmulatorStore((state) => state.setTripData);

  const startLat = tripData?.tripPoints ? tripData?.tripPoints[0].lat : null;
  const startLng = tripData?.tripPoints ? tripData?.tripPoints[0].lng : null;
  const endLat = tripData?.tripPoints
    ? tripData?.tripPoints[tripData?.tripPoints?.length - 1].lat
    : null;
  const endLng = tripData?.tripPoints
    ? tripData?.tripPoints[tripData?.tripPoints?.length - 1].lng
    : null;

  const pathTraveled = useEmulatorStore((state) => state.pathTraveled);
  const pathNotTraveled = useEmulatorStore((state) => state.pathNotTraveled);

  const totalPath = pathTraveled?.concat(pathNotTraveled);

  const stopRefs = React.useRef({});

  let stopNewLatLng = null;

  const handleStopDragEnd = (index) => {
    const marker = stopRefs.current[index];
    if (stopNewLatLng !== null) {
      marker.setPosition({ lat: stopNewLatLng.lat, lng: stopNewLatLng.lng });
    }
    requestNewStopCreation(marker, stopNewLatLng, index);
  };

  const handleStopDragged = (e, index, stop) => {
    // get new lat lng of the marker
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    //snap to closest path lat lng
    const clickedLatLng = { lat: lat, lng: lng };
    const findClosestPointIndex = (path) => {
      return path.reduce((closestIndex, currentLatLng, index) => {
        const d1 =
          Math.pow(currentLatLng.lat - clickedLatLng.lat, 2) +
          Math.pow(currentLatLng.lng - clickedLatLng.lng, 2);
        const d2 =
          closestIndex === -1
            ? Infinity
            : Math.pow(path[closestIndex].lat - clickedLatLng.lat, 2) +
              Math.pow(path[closestIndex].lng - clickedLatLng.lng, 2);
        return d1 < d2 ? index : closestIndex;
      }, -1);
    };

    const closestIndexPath = findClosestPointIndex(totalPath);
    if (
      closestIndexPath === null ||
      closestIndexPath < 0 ||
      closestIndexPath > totalPath.length
    ) {
      console.error("Could not find closest point in pathTraveled");
      return;
    }

    // snap the marker from markerRef to the closest point in pathTraveled
    const marker = stopRefs.current[index];
    marker.setPosition({
      lat: totalPath[closestIndexPath].lat,
      lng: totalPath[closestIndexPath].lng,
    });
    stopNewLatLng = {
      oldTripPointIndex: stop.tripPointIndex,
      newTripPointIndex: closestIndexPath,
      lat: totalPath[closestIndexPath].lat,
      lng: totalPath[closestIndexPath].lng,
    };
  };

  async function requestNewStopCreation(marker, newLatLng, index) {
    // confirm from window alert
    const confirm = window.confirm(
      `Change stop S${index + 1} location to this?}`
    );
    if (!confirm) {
      stopNewLatLng = null;
      //reset marker position to original
      if (
        tripData?.stops !== null &&
        tripData?.stops !== undefined &&
        tripData?.stops.length > 0
      ) {
        marker.setPosition({
          lat: tripData.stops[index].lat,
          lng: tripData.stops[index].lng,
        });
      }
      return;
    }

    const token = localStorage.getItem("token");
    showToast("Updating Stop...", "info");
    const { success, data, error } = await ApiService.makeApiCall(
      TRIP_STOPS_URL,
      "PUT",
      newLatLng,
      token,
      selectedEmulator.id
    );
    if (success) {
      showToast("Stop updated!", "success");
      setTripData(data);
      stopNewLatLng = null;
    } else {
      showToast("Error updating Stop!", "error");
      console.error("LOG 1 - error creating Stop: ", error);
      stopNewLatLng = null;
    }
  }

  return (
    <React.Fragment>
      {tripData?.stops != null &&
        tripData?.stops.map((stop, index) => (
          <React.Fragment key={stop.currentTripPointIndex}>
            <Marker
              onLoad={(marker) => {
                stopRefs.current[index] = marker;
              }}
              id={stop.tripPointIndex}
              key={stop.tripPointIndex}
              position={{
                lat: stop.lat,
                lng: stop.lng,
              }}
              label={`S${index + 1}`}
              draggable={true}
              onClick={() => props.handleMarkerClick(stop)}
              onDragEnd={(event) => handleStopDragEnd(index)}
              onDrag={(event) => handleStopDragged(event, index, stop)}
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
