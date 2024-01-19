import React from "react";
import { Polyline } from "@react-google-maps/api";
import { useEmulatorStore } from "../../../../stores/emulator/store.tsx";
import ApiService from "../../../../ApiService.js";
import { TRIP_STOPS_URL } from "../../../../constants.js";
import EmulatorMarkerDirection from "../Markers/EmulatorMarkerDirection.jsx";
import EmulatorMarkerSelected from "../Markers/EmulatorMarkerSelected.jsx";
// import { useStates } from "../../../../StateProvider.js";

export function PathComponent() {
  // const { showToast } = useStates();
  const pathTraveled = useEmulatorStore((state) => state.pathTraveled);
  const pathNotTraveled = useEmulatorStore((state) => state.pathNotTraveled);

  const connectedEmulator = useEmulatorStore((state) => state.connectedEmulator);

  function onPolyLineClickTraveled(e) {
    const clickedLatLng = { lat: e.latLng.lat(), lng: e.latLng.lng() };

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

    const closestIndexPath = findClosestPointIndex(pathTraveled);
    if (closestIndexPath && closestIndexPath !== -1) {
      requestNewStopCreation(pathTraveled[closestIndexPath]);
    }
  }

  function onPolyLineClickNotTraveled(e) {
    const clickedLatLng = { lat: e.latLng.lat(), lng: e.latLng.lng() };

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

    const closestIndexPath = findClosestPointIndex(pathNotTraveled);
    if (closestIndexPath && closestIndexPath !== -1) {
      requestNewStopCreation(pathNotTraveled[closestIndexPath]);
    }
  }

  async function requestNewStopCreation(tripPoint) {
    // confirm from window alert
    const confirm = window.confirm("Create a new Stop at this location?");
    if (!confirm) {
      return;
    }

    const token = localStorage.getItem("token");
    // showToast("Creating Stop...", "info");
    const { success, data, error } = await ApiService.makeApiCall(
      TRIP_STOPS_URL,
      "POST",
      tripPoint,
      token,
      connectedEmulator.id
    );
    if (success) {
      // showToast("Stop created!", "success");
      // setTripData(data); NOTE: THIS IS NOT NEEDED, THE SSE SHOULD BE ABLE TO RESPOND TO THIS CHANGE WITHIN 500 ms
    } else {
      // showToast("Error creating Stop!", "error");
      console.error("Error creating Stop: ", error);
    }
  }

  return (
    <>
      {connectedEmulator && (
        <>
          <EmulatorMarkerSelected />
          <EmulatorMarkerDirection />
        </>
      )}

      {pathTraveled != null && (
        <Polyline
          path={pathTraveled}
          options={{
            strokeColor: "#0058A5",
            strokeWeight: 3,
            strokeOpacity: 1,
            defaultVisible: true,
          }}
          onClick={onPolyLineClickTraveled}
        />
      )}
      {pathNotTraveled != null && (
        <Polyline
          path={pathNotTraveled}
          options={{
            strokeColor: "#0058A5",
            strokeWeight: 3,
            strokeOpacity: 0.3,
            defaultVisible: true,
          }}
          onClick={onPolyLineClickNotTraveled}
        />
      )}
    </>
  );
}
