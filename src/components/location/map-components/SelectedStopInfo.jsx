import React, { useCallback, useEffect, useMemo, useState } from "react";
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

  const calculateTimeFromTripPointIndexToStopPoint = useCallback(
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

  const emulatorTimeLeftToReachNextStop = useMemo(
    () =>
      calculateTimeFromTripPointIndexToStopPoint(
        selectedEmulator.currentTripPointIndex,
        props.selectedStop,
        selectedEmulator.speed
      ),
    [
      calculateTimeFromTripPointIndexToStopPoint,
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
          {emulatorTimeLeftToReachNextStop}
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
          {props.totalTime}
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
          {emulatorTimeLeftToReachNextStop}
        </p>
      </div>
    </InfoWindow>
  );
}
