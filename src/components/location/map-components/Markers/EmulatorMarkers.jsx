import React from "react";
import { useEmulatorStore } from "../../../../stores/emulator/store.tsx";
import {
  compareTripData,
} from "../../../../stores/emulator/types_maps.tsx";
import { compareEmulatorsForMarkers } from "./utils.tsx";
import EmulatorMarker from "./EmulatorMarker.jsx";
import EmulatorMarkerDirection from "./EmulatorMarkerDirection.jsx";

const EmulatorMarkers = ({
    hoveredMarker,
    handleMarkerMouseOut,
    handleMarkerMouseOver,
    handleEmulatorMarkerDragEnd,
  }) => {
    console.log("EmulatorMarkers refreshed");
    const markers = useEmulatorStore(
      (state) => state.emulators,
      (oldEmulators, newEmulators) => {
        const diff = compareEmulatorsForMarkers(oldEmulators, newEmulators);
        if (diff === true) {
          console.log("MARKERS markers changed ");
        }
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

    const selectEmulator = useEmulatorStore((state) => state.selectEmulator);

    function selectEmulatorId(id) {
      // find from emulators, the emulator with id
      const emulator = markers.find((emulator) => emulator.id === id);
      if (emulator) {
        selectEmulator(emulator);
      }
    }

    return (
      <>
        {markers !== null &&
          markers.length > 0 &&
          markers
            ?.filter(
              (emulator) =>
                emulator.latitude !== null && emulator.longitude !== null
            )
            .map((emulator, _) => {
              console.log("MARKERS emulatorComing:", emulator);
              const isHovered = hoveredMarker?.id === emulator?.id;
              const isSelected = selectedEmulator?.id === emulator?.id;

              //PAUSED RESTING RUNNING STOP //HOVER SELECT DEFAULT //ONLINE OFFLINE INACTIVE
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

              const emulatorIcon = {
                url: icon_url,
                scaledSize: new window.google.maps.Size(20, 20),
                anchor: new window.google.maps.Point(10, 10),
              };

              return (
                <>
                  <EmulatorMarker
                    latLng={{ lat: emulator.latitude, lng: emulator.longitude }}
                    telephone={emulator.telephone}
                    status={emulator.status}
                    tripStatus={emulator.tripStatus}
                    emulatorIcon={emulatorIcon}
                    handleMarkerMouseOver={handleMarkerMouseOver}
                    handleMarkerMouseOut={handleMarkerMouseOut}
                    handleEmulatorMarkerDragEnd={handleEmulatorMarkerDragEnd}
                    selectEmulatorId={selectEmulatorId}
                  />
                  {isSelected && rotationAngle !== null && (
                    <EmulatorMarkerDirection
                      latLng={{
                        lat: emulator.latitude,
                        lng: emulator.longitude,
                      }}
                      rotationAngle={rotationAngle}
                    />
                  )}
                </>
              );
            })}
      </>
    );
  };

export default EmulatorMarkers;
