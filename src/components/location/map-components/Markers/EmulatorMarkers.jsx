import React from "react";
import { useEmulatorStore } from "../../../../stores/emulator/store.tsx";
import { compareEmulatorsForMarkers } from "./utils.tsx";
import EmulatorMarker from "./EmulatorMarker2.jsx";

const EmulatorMarkers = () => {
  const markers = useEmulatorStore(
    (state) => state.emulators,
    (oldEmulators, newEmulators) => {
      compareEmulatorsForMarkers(oldEmulators, newEmulators);
    }
  );

  const selectedEmulator = useEmulatorStore((state) => state.selectedEmulator);
  
  return (
    <>
      {markers !== null &&
        markers.length > 0 &&
        markers
          ?.filter(
            (emulator) =>
              emulator.latitude !== null && emulator.longitude !== null && emulator.id !== selectedEmulator?.id
          )
          .map((emulator) => {
            return (
              <EmulatorMarker key = {emulator.id} 
              emulator={emulator} />
            );
          })}
    </>
  );
};

export default EmulatorMarkers;
