import React, { useCallback, useRef } from "react";
import { InfoWindow } from "@react-google-maps/api";
import { useEmulatorStore } from "../../../stores/emulator/store.tsx";
import {
  compareSelectedEmulator,
  compareTripData,
} from "../../../stores/emulator/types_maps.tsx";

export function SelectedStopInfo(props) {
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
      </div>
    </InfoWindow>
  );
}