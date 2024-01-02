import { Marker } from "@react-google-maps/api";
import React, { useEffect, useState, useRef } from "react";

const EmulatorMarker = ({
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
  }) => {
    console.log("EmulatorMarker refreshed");
    const [currentPosition, setCurrentPosition] = useState(latLng);
    const intervalId = useRef(null);

    useEffect(() => {
      // Clear the previous interval
      if (intervalId.current) {
        clearInterval(intervalId.current);
      }

      intervalId.current = setInterval(() => {
        const newLat =
          currentPosition.lat + (latLng.lat - currentPosition.lat) * 0.2;
        const newLng =
          currentPosition.lng + (latLng.lng - currentPosition.lng) * 0.2;
        setCurrentPosition({ lat: newLat, lng: newLng });
      }, 500);
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
  };

export default EmulatorMarker;
