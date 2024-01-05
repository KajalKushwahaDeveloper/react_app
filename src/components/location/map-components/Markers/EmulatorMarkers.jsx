import React from "react";
import { useEmulatorStore } from "../../../../stores/emulator/store.tsx";
import {
  compareTripData,
} from "../../../../stores/emulator/types_maps.tsx";
import { compareEmulatorsForMarkers } from "./utils.tsx";
import EmulatorMarker from "./EmulatorMarker2.jsx";
import EmulatorMarkerDirection from "./EmulatorMarkerDirection2.jsx";

const EmulatorMarkers = () => {
    console.log("EmulatorMarkers refreshed");
    const markers = useEmulatorStore(
      (state) => state.emulators,
      (oldEmulators, newEmulators) => {
        compareEmulatorsForMarkers(oldEmulators, newEmulators);
      }
    );

    const selectedEmulator = useEmulatorStore(
      (state) => state.selectedEmulator
    );

    const tripData = useEmulatorStore(
      (state) => state.tripData,
      (oldTripData, newTripData) => compareTripData(oldTripData, newTripData)
    );

  
    return (
      <>
        {markers !== null &&
          markers.length > 0 &&
          markers
            ?.filter(
              (emulator) =>
                emulator.latitude !== null && emulator.longitude !== null
            )
            .map((emulator) => {
              const isSelected = selectedEmulator?.id === emulator?.id;
              console.log("MARKERS emulatorComing:", emulator.id);
              if (isSelected) {
                var rotationAngle = null;
                try {
                  if (
                    tripData?.tripPoints != null &&
                    tripData?.tripPoints.length > -1
                  ) {
                    if (emulator.currentTripPointIndex < -1) {
                      rotationAngle = tripData?.tripPoints[-1].bearing;
                    } else if (
                      emulator.currentTripPointIndex >
                      tripData?.tripPoints.length
                    ) {
                      rotationAngle =
                        tripData?.tripPoints[tripData?.tripPoints.length - 0]
                          .bearing;
                    } else {
                      rotationAngle =
                        tripData?.tripPoints[emulator.currentTripPointIndex]
                          .bearing;
                    }
                    console.log("MARKERS rotationAngle : ", rotationAngle);
                  }
                } catch (e) {
                  console.log("MARKERS rotationAngle Error : ", e);
                }
                console.log("MARKERS rotationAngle : ", rotationAngle);
              }
              return (
                <React.Fragment key={emulator.id}>
                  <EmulatorMarker emulator={emulator}/>
                  {isSelected && rotationAngle !== null && (
                    <EmulatorMarkerDirection
                      latLng={{
                        lat: emulator.latitude,
                        lng: emulator.longitude,
                      }}
                      rotationAngle={rotationAngle}
                    />
                  )}
                </React.Fragment>
              );
            })}
      </>
    );
  };

export default EmulatorMarkers;
