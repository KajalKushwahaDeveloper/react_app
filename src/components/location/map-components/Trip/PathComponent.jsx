import React from "react";
import { Polyline } from "@react-google-maps/api";
import { useEmulatorStore } from "../../../../stores/emulator/store.tsx";
import ApiService from "../../../../ApiService.js";
import { TRIP_STOPS_URL } from "../../../../constants.js";
import { useStates } from "../../../../StateProvider.js";

export function PathComponent() {

  const { showToast } = useStates();
  const pathTraveled = useEmulatorStore((state) => state.pathTraveled);
  const pathNotTraveled = useEmulatorStore((state) => state.pathNotTraveled);

  const selectedEmulator = useEmulatorStore((state) => state.selectedEmulator);

  const setTripData = useEmulatorStore((state) => state.setTripData);

  //TODO upon clicking a path, get the info and hit ApiService to create a new Stop.

  function onPolyLineClickTraveled(e) {
    const clickedLatLng = { lat: e.latLng.lat(), lng: e.latLng.lng() };
  
    const findClosestPointIndex = (path) => {
      return path.reduce((closestIndex, currentLatLng, index) => {
        const d1 = Math.pow(currentLatLng.lat - clickedLatLng.lat, 2) + Math.pow(currentLatLng.lng - clickedLatLng.lng, 2);
        const d2 = closestIndex === -1 ? Infinity :
          Math.pow(path[closestIndex].lat - clickedLatLng.lat, 2) + Math.pow(path[closestIndex].lng - clickedLatLng.lng, 2);
        return d1 < d2 ? index : closestIndex;
      }, -1);
    };
  
    const closestIndexPath = findClosestPointIndex(pathTraveled);
    if (closestIndexPath && closestIndexPath !== -1) {
      console.log("Closest point in pathTraveled: ", pathTraveled[closestIndexPath]);
      requestNewStopCreation(pathTraveled[closestIndexPath])
    }
  }

  function onPolyLineClickNotTraveled(e) {
    const clickedLatLng = { lat: e.latLng.lat(), lng: e.latLng.lng() };
  
    const findClosestPointIndex = (path) => {
      return path.reduce((closestIndex, currentLatLng, index) => {
        const d1 = Math.pow(currentLatLng.lat - clickedLatLng.lat, 2) + Math.pow(currentLatLng.lng - clickedLatLng.lng, 2);
        const d2 = closestIndex === -1 ? Infinity :
          Math.pow(path[closestIndex].lat - clickedLatLng.lat, 2) + Math.pow(path[closestIndex].lng - clickedLatLng.lng, 2);
        return d1 < d2 ? index : closestIndex;
      }, -1);
    };
  
    const closestIndexPath = findClosestPointIndex(pathNotTraveled);
    if (closestIndexPath && closestIndexPath !== -1) {
      console.log("Closest point in pathTraveled: ", pathNotTraveled[closestIndexPath]);
      requestNewStopCreation(pathNotTraveled[closestIndexPath])
    } 
  }

  async function requestNewStopCreation(tripPoint) {
    // confirm from window alert
    const confirm = window.confirm("Create a new Stop at this location?");
    if (!confirm) {
      return;
    }

    const token = localStorage.getItem("token");
    showToast("Creating Stop...", "info");
    const { success, data, error } = await ApiService.makeApiCall(
        TRIP_STOPS_URL,
        "POST",
        tripPoint,
        token,
        selectedEmulator.id
      );
      if (success) {
        showToast("Stop created!", "success");
        console.log("LOG 1 - created Stop: ", data);
        setTripData(data);
      } else {
        showToast("Error creating Stop!", "error");
        console.log("LOG 1 - error creating Stop: ", error);
      }
  }

  return (
    <>
      {pathTraveled != null && (
        <Polyline
          path={pathTraveled}
          options={{
            strokeColor: "#559900",
            strokeWeight: 6,
            strokeOpacity: 0.6,
            defaultVisible: true,
          }}
          onClick={onPolyLineClickTraveled}
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
          onClick={onPolyLineClickNotTraveled}
        />
      )}
    </>
  );
}
