import React from "react";
import EmulatorMarker from "./EmulatorMarker.jsx";
import useMarkerStore from "../../../../stores/emulator/markerStore.js";

const EmulatorMarkers = () => {
  console.log('app only render once')
  const items = useMarkerStore((state) => state.items)

  
  console.log('items : ', items)
  return (
    <>
      {items?.map((id) => {
            return (
              <EmulatorMarker
                key={id}
                id={id}
              />
            );
          })}
    </>
  );
};

export default EmulatorMarkers;
