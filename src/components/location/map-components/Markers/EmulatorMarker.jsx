// component with marker which will change position with animation on new props
// <EmulatorMarker
// emulator={emulator}
// emulatorIcon={emulatorIcon}
// isSelected={isSelected}
// rotationAngle={rotationAngle}
// hoveredMarker={hoveredMarker}
// handleMarkerMouseOver={handleMarkerMouseOver}
// handleMarkerMouseOut={handleMarkerMouseOut}
// handleEmulatorMarkerDragEnd={handleEmulatorMarkerDragEnd}
// selectEmulator={selectEmulator}
// markerRefs={markerRefs}
// />

import { Marker } from "@react-google-maps/api";
import React, { memo, useEffect, useState, useRef } from "react";

const EmulatorMarker = memo(
  ({
    id,
    latLng,
    telephone,
    status,
    tripStatus,
    emulatorIcon,
    handleMarkerMouseOver,
    handleMarkerMouseOut,
    handleEmulatorMarkerDragEnd,
    selectEmulatorId,
    markerRefs,
  }) => {
    const [currentPosition, setCurrentPosition] = useState(latLng);
    const intervalId = useRef(null);

    useEffect(() => {
      // Clear the previous interval
      if (intervalId.current) {
        clearInterval(intervalId.current);
      }

      intervalId.current = setInterval(() => {
        const newLat =
          currentPosition.lat + (latLng.lat - currentPosition.lat) * 0.03;
        const newLng =
          currentPosition.lng + (latLng.lng - currentPosition.lng) * 0.03;
        setCurrentPosition({ lat: newLat, lng: newLng });
      }, 10);
      return () => {
        if (intervalId.current) {
          clearInterval(intervalId.current);
        }
      };
    }, [currentPosition.lat, currentPosition.lng, latLng]);

    return (
      <Marker
        key={id}
        icon={emulatorIcon}
        position={{
          lat: currentPosition.lat,
          lng: currentPosition.lng,
        }}
        onLoad={(marker) => {
          markerRefs.current[id] = marker;
        }}
        title={`${telephone} ${tripStatus}(${status})`}
        labelStyle={{
          textAlign: "center",
          width: "auto",
          color: "#037777777777",
          fontSize: "11px",
          padding: "0px",
        }}
        labelAnchor={{ x: "auto", y: "auto" }}
        onClick={() => selectEmulatorId(id)}
        onMouseOver={() => handleMarkerMouseOver(id)}
        onMouseOut={handleMarkerMouseOut}
        draggable={true}
        onDragEnd={(event) => {
          handleEmulatorMarkerDragEnd(id, event);
        }}
        zIndex={1}
      />
    );
  }
);

export default EmulatorMarker;
