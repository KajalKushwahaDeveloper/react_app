import { Marker } from "@react-google-maps/api";
import React, { memo, useEffect, useState, useRef } from "react";

const EmulatorMarkerDirection = memo(
  ({ rotationAngle, id, latLng, markerDirectionRefs }) => {
    const [currentPosition, setCurrentPosition] = useState(latLng);

    const intervalId = useRef(null);

    useEffect(() => {
      // Clear the previous interval
      if (intervalId.current) {
        clearInterval(intervalId.current);
      }

      intervalId.current = setInterval(() => {
        const newLat =
          currentPosition.lat + (latLng.lat - currentPosition.lat) * 0.05;
        const newLng =
          currentPosition.lng + (latLng.lng - currentPosition.lng) * 0.05;
        setCurrentPosition({ lat: newLat, lng: newLng });
      }, 10);
      return () => {
        if (intervalId.current) {
          clearInterval(intervalId.current);
        }
      };
    }, [currentPosition.lat, currentPosition.lng, latLng]);


    // SVG with gradient and rotation

    const svgIcon = `
      <svg width="100%" height="100%" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" transform="rotate(${rotationAngle})">
      <defs>
        <radialGradient id="grad1" cx="50%" cy="100%" r="100%" fx="50%" fy="100%">
          <stop offset="0%" style="stop-color:rgb(0,255,255);stop-opacity:1" />
          <stop offset="100%" style="stop-color:rgb(0,0,0,0);stop-opacity:0" />
        </radialGradient>
      </defs>
      <path d="M32,0 A16,16 0 0,1 48,16 L32,32 L16,16 A16,16 0 0,1 32,0" fill="url(#grad1)" />
      </svg>`;


        return (
      <Marker
        onLoad={(marker) => {
          markerDirectionRefs.current[id] = marker;
        }}
        icon={{
          url:
            "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svgIcon),
          scaledSize: new window.google.maps.Size(100, 100),
          anchor: new window.google.maps.Point(50, 50),
          rotation: rotationAngle,
        }}
        rotation={rotationAngle}
        position={{
          lat: currentPosition.lat,
          lng: currentPosition.lng,
        }}
        zIndex={0}
      />
    );
  }
);

export default EmulatorMarkerDirection;
