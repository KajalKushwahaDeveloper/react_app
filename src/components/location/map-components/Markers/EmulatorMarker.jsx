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
import _ from "lodash";
import { useEmulatorStore } from "../../../../stores/emulator/store.tsx";
import useMarkerStore from "../../../../stores/emulator/markerStore.js";

const EmulatorMarker = React.memo(({ id }) => {
  const emulatorRef = useRef({
    id: id,
    telephone: `+1 000 000 0000`,
    tripStatus: `PAUSED`,
    status: `OFFLINE`,
    latitude: 37.7749,
    longitude: -122.4194,
  })
  useEffect(() => useMarkerStore.subscribe(state => emulatorRef.current = state[id]), [id])
  console.log('i only render once')
  

  function SelectEmulatorId() {
    // const emulator = emulators.find((emulator) => emulator.id === id);
    // selectEmulator(emulator);
  }

  function HoverEmulatorId() {
    // const emulator = emulators.find((emulator) => emulator.id === id);
    // hoverEmulator(emulator);
  }

  const dragEmulator = useEmulatorStore((state) => state.dragEmulator);

  const hoveredMarker = useEmulatorStore((state) => state.hoveredEmulator);
  const hoverEmulator = useEmulatorStore((state) => state.hoverEmulator);

  const selectEmulator = useEmulatorStore((state) => state.selectEmulator);

  const isHovered = hoveredMarker?.id === id;
  //PAUSED RESTING RUNNING STOP //HOVER SELECT DEFAULT //ONLINE OFFLINE INACTIVE
  var icon_url = `images/${emulatorRef.current?.tripStatus}/`;
  if (isHovered) {
    icon_url = icon_url + "HOVER";
  } else {
    icon_url = icon_url + "DEFAULT";
  }
  icon_url = `${icon_url}/${emulatorRef.current?.status}.svg`;

  const emulatorIcon = {
    url: icon_url,
    scaledSize: new window.google.maps.Size(20, 20),
    anchor: new window.google.maps.Point(10, 10),
  };

  const markerRef = useRef(null);

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

  const handleEmulatorMarkerDragEnd = (event) => {
    // if (!emulators || !id) {
    //   console.error("DRAG Emulator not found in data");
    //   return;
    // }
    // const { latLng } = event;
    // dragEmulator({
    //   emulator: emulators.find((emulator) => emulator.id === id),
    //   latitude: latLng.lat(),
    //   longitude: latLng.lng(),
    // });
  };

  // loop every second
  useEffect(() => {
    const interval = setInterval(() => {
      // animateMarkerTo(markerRef.current, {
      //   lat: emulatorRef.current?.latitude,
      //   lng: emulatorRef.current?.longitude,
      // });
    }, 1000);
    return () => clearInterval(interval);
  }, []);
  //log all values
  console.log('emulator', emulatorRef.current)
  console.log('emulatorIcon', emulatorIcon)
  console.log('markerRefs', markerRef.current)

  return (
    <Marker
      key={id}
      icon={emulatorIcon}
      position={{ lat: emulatorRef.current?.latitude, lng: emulatorRef.current?.longitude }}
      onLoad={(marker) => {
        markerRef.current = marker;
      }}
      title={`${emulatorRef.current?.telephone} ${emulatorRef.current?.tripStatus}(${emulatorRef.current?.status})`}
      labelStyle={{
        textAlign: "center",
        width: "auto",
        color: "#037777777777",
        fontSize: "11px",
        padding: "0px",
      }}
      labelAnchor={{ x: "auto", y: "auto" }}
      onClick={() => SelectEmulatorId()}
      onMouseOver={() => HoverEmulatorId()}
      onMouseOut={() => hoverEmulator(null)}
      draggable={true}
      onDragEnd={(event) => {
        handleEmulatorMarkerDragEnd(event);
      }}
      zIndex={1}
    />
  );
});

export default EmulatorMarker;
