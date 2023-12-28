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
import React, { useEffect, useRef } from "react";

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
  const markerRef = useRef(null);
  // copy latLng to initialPosition but don't update it on latLng change
  useEffect(() => {
    if(markerRef.current === null || markerRef.current === undefined){
      return;
    }
    animateMarkerTo(markerRef.current, latLng);
  }, [latLng, markerRef]);

  // https://stackoverflow.com/a/55043218/9058905
  function animateMarkerTo(marker, newPosition) {
    var options = {
      duration: 1000,
      easing: function (x, t, b, c, d) {
        // jquery animation: swing (easeOutQuad)
        return -c * (t /= d) * (t - 2) + b;
      },
    };

    window.requestAnimationFrame =
      window.requestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.msRequestAnimationFrame;
    window.cancelAnimationFrame =
      window.cancelAnimationFrame || window.mozCancelAnimationFrame;

    // save current position. prefixed to avoid name collisions. separate for lat/lng to avoid calling lat()/lng() in every frame
    marker.AT_startPosition_lat = marker.getPosition().lat();
    marker.AT_startPosition_lng = marker.getPosition().lng();
    var newPosition_lat = newPosition.lat;
    var newPosition_lng = newPosition.lng;

    // crossing the 180° meridian and going the long way around the earth?
    if (Math.abs(newPosition_lng - marker.AT_startPosition_lng) > 180) {
      if (newPosition_lng > marker.AT_startPosition_lng) {
        newPosition_lng -= 360;
      } else {
        newPosition_lng += 360;
      }
    }

    var animateStep = function (marker, startTime) {
      var ellapsedTime = new Date().getTime() - startTime;
      var durationRatio = ellapsedTime / options.duration; // 0 - 1
      var easingDurationRatio = options.easing(
        durationRatio,
        ellapsedTime,
        0,
        1,
        options.duration
      );

      if (durationRatio < 1) {
        marker.setPosition({
          lat:
            marker.AT_startPosition_lat +
            (newPosition_lat - marker.AT_startPosition_lat) *
              easingDurationRatio,
          lng:
            marker.AT_startPosition_lng +
            (newPosition_lng - marker.AT_startPosition_lng) *
              easingDurationRatio,
        });

        // use requestAnimationFrame if it exists on this browser. If not, use setTimeout with ~60 fps
        if (window.requestAnimationFrame) {
          marker.AT_animationHandler = window.requestAnimationFrame(
            function () {
              animateStep(marker, startTime);
            }
          );
        } else {
          marker.AT_animationHandler = setTimeout(function () {
            animateStep(marker, startTime);
          }, 17);
        }
      } else {
        marker.setPosition(newPosition);
      }
    };

    // stop possibly running animation
    if (window.cancelAnimationFrame) {
      window.cancelAnimationFrame(marker.AT_animationHandler);
    } else {
      clearTimeout(marker.AT_animationHandler);
    }

    animateStep(marker, new Date().getTime());
  }

  return (
    <Marker
      key={id}
      icon={emulatorIcon}
      position={{ lat: latLng.lat, lng: latLng.lng}}
      onLoad={(marker) => {
        markerRef.current = marker;
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
