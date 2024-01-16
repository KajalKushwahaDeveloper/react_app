import React, { useCallback, useRef } from "react";
import { InfoWindow } from "@react-google-maps/api";
import { useEmulatorStore } from "../../../../stores/emulator/store.tsx";
import {
  compareSelectedEmulator,
  compareTripData,
} from "../../../../stores/emulator/types_maps.tsx";
import ApiService from "../../../../ApiService.js";
import { TRIP_STOPS_DELETE_URL } from "../../../../constants.js";
import { useStates } from "../../../../StateProvider.js";

export function SelectedStopInfo(props) {
  const { showToast } = useStates();
  const selectedEmulator = useEmulatorStore(
    (state) => state.selectedEmulator,
    (oldSelectedEmulator, newSelectedEmulator) => {
      compareSelectedEmulator(oldSelectedEmulator, newSelectedEmulator);
    }
  );

  const tripData = useEmulatorStore(
    (state) => state.tripData,
    (oldTripData, newTripData) => compareTripData(oldTripData, newTripData)
  );


  const totalTime = useRef(null);

  const getTimeToReachStopPoint = useCallback(
    (startIndex, stop, velocity) => {
      if (
        startIndex == null ||
        stop == null ||
        velocity == null ||
        tripData?.tripPoints == null
      ) {
        return `N/A`;
      }
      let distance = 0;
      tripData?.tripPoints.forEach((path) => {
        if (
          path.tripPointIndex >= startIndex &&
          path.tripPointIndex <= stop.tripPointIndex
        ) {
          distance += path.distance;
        }
      });
      // Assuming you calculate time by dividing distance by velocity
      return distance / velocity;
    },
    [tripData]
  );

  const timeToReachNextStop = useRef(
    () =>
      getTimeToReachStopPoint(
        selectedEmulator.currentTripPointIndex,
        props.selectedStop,
        selectedEmulator.speed
      ),
    [
      getTimeToReachStopPoint,
      selectedEmulator.currentTripPointIndex,
      selectedEmulator.speed,
      props.selectedStop,
    ]
  );

  const handleDeleteStop = async () => {
    // request on window for confirmation
    // if yes, delete stop
    // if no, do nothing

    const shouldDelete = window.confirm(
      "Are you sure you want to delete this stop?"
    );
    if (!shouldDelete) {
      return;
    }
    showToast("Deleting stop...", "info");
    const token = localStorage.getItem("token");
    const { success, data, error } = await ApiService.makeApiCall(
      TRIP_STOPS_DELETE_URL,
      "GET",
      null,
      token,
      selectedEmulator.id,
      new URLSearchParams({
        stopTripPointIndex: props.selectedStop.tripPointIndex,
      })
    );

    if (!success) {
      showToast("Error deleting stop", "error");
      console.error("handleDeleteStop error : ", error);
    } else {
      // setTripData(data); NOTE: THIS IS NOT NEEDED, THE SSE SHOULD BE ABLE TO RESPOND TO THIS CHANGE WITHIN 500 ms
      showToast("Stop deleted", "success");
      props.handleInfoWindowClose();
    }
  };

  return (
    <InfoWindow
      position={{
        lat: props.selectedStop.lat,
        lng: props.selectedStop.lng,
      }}
      onCloseClick={props.handleInfoWindowClose}
    >
      <div
        style={{
          width: "auto",
        }}
      >
        <h6
          style={{
            color: "black",
          }}
        >
          Stop Address:
        </h6>
        <p
          style={{
            color: "black",
            fontSize: "11px",
          }}
        >
          {props.selectedStop.address.map((addressItem, index) => (
            <React.Fragment key={index}>
              {index > 0 && ", "}
              {addressItem.long_name}
            </React.Fragment>
          ))}
        </p>
        <h6
          style={{
            color: "black",
          }}
        >
          Nearest Gas Station:
        </h6>
        <p
          style={{
            color: "black",
            fontSize: "11px",
          }}
        >
          {props.selectedStop.gasStation.map((gasStationAddressItem, index) => (
            <React.Fragment key={index}>
              {index > 0 && ", "}
              {gasStationAddressItem.long_name}
            </React.Fragment>
          ))}
        </p>

        <h6
          style={{
            color: "black",
          }}
        >
          Arrival Time:{" "}
        </h6>
        <p
          style={{
            color: "black",
            fontSize: "11px",
          }}
        >
          {timeToReachNextStop.current ? timeToReachNextStop.current : "N/A"}
        </p>

        <h6
          style={{
            color: "black",
          }}
        >
          Total Time:{" "}
        </h6>
        <p
          style={{
            color: "black",
            fontSize: "11px",
          }}
        >
          {totalTime.current ? totalTime.current : "N/A"}
        </p>

        <h6
          style={{
            color: "black",
          }}
        >
          Remaining Distance:{" "}
        </h6>
        <p
          style={{
            color: "black",
            fontSize: "11px",
          }}
        >
          {timeToReachNextStop.current ? timeToReachNextStop.current : "N/A"}
        </p>
        {/* Delete Button */}
        <button
          style={{
            backgroundColor: "red",
            color: "white",
            fontSize: "11px",
            padding: "10px",
            margin: "0px",
          }}
          onClick={() => handleDeleteStop()}
        >
          Delete
        </button>
      </div>
    </InfoWindow>
  );
}
