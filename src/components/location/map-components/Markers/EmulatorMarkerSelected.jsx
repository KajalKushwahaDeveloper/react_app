import { Marker } from "@react-google-maps/api";
import React, { useEffect, useRef } from "react";
import _ from "lodash";
import { useEmulatorStore } from "../../../../stores/emulator/store.tsx";

const EmulatorMarkerSelected = () => {
  console.log("Selected Marker Created!")
  const markerRef = useRef(null);
  const dragEmulator = useEmulatorStore.getState().dragEmulator;
  const moveEmulator = useEmulatorStore.getState().moveEmulator;

  const emulatorRef = useRef(useEmulatorStore.getState().connectedEmulator);
  const movedEmulatorRef = useRef(useEmulatorStore.getState().movedEmulator);
  const draggedEmulatorRef = useRef(useEmulatorStore.getState().draggedEmulator);


  useEffect(() => useEmulatorStore.subscribe(
    state => state.movedEmulator, (movedEmulator) => {
      if (markerRef.current === null || markerRef.current === undefined) {
        return
      }
      if(emulatorRef.current === null || emulatorRef.current === undefined){
        return
      }
      // moved
      if (movedEmulator && movedEmulator.moveMarker === true) {
        const movedToPosition = new window.google.maps.LatLng(movedEmulator.latitude, movedEmulator.longitude);
        markerRef.current?.setPosition(movedToPosition);
        markerRef.current?.setAnimation(window.google.maps.Animation.DROP);

        // do something maybe
      }
      // un-moved..
      else if(movedEmulator && movedEmulator.moveMarker === false) {
       // reset markerRef
        const newPosition = new window.google.maps.LatLng(emulatorRef.current?.latitude, emulatorRef.current?.longitude);
        markerRef.current?.setPosition(newPosition);
        markerRef.current?.setAnimation(null); 
      }
      movedEmulatorRef.current = movedEmulator
    },
  ), [])
  
  useEffect(() => useEmulatorStore.subscribe(state => state.draggedEmulator, (draggedEmulator) => {
    draggedEmulatorRef.current = draggedEmulator
    if(markerRef.current === null || markerRef.current === undefined){
      return
    }
    if(draggedEmulator === null || draggedEmulator === undefined){
      const position = new window.google.maps.LatLng(emulatorRef.current?.latitude, emulatorRef.current?.longitude);
      markerRef.current?.setPosition(position);
    }
  }), [])
  
  useEffect(() => useEmulatorStore.subscribe(state => state.connectedEmulator, (connectedEmulator) => {
    if (markerRef.current === null || markerRef.current === undefined) {
      return
    }
    if (!connectedEmulator || connectedEmulator === undefined) {
      return
    }
    // if current marker is being dragged or moved, skip
    if (draggedEmulatorRef.current?.emulator?.id === connectedEmulator.id || movedEmulatorRef?.emulator?.id === connectedEmulator.id) {
      return
    }

    emulatorRef.current = connectedEmulator

    const newPosition = new window.google.maps.LatLng(emulatorRef.current?.latitude, emulatorRef.current?.longitude);
    markerRef.current?.setPosition(newPosition);
    //TODO: use animation instead

    var icon_url = `images/${emulatorRef.current?.tripStatus}/`;
    icon_url = icon_url + "SELECT";
    icon_url = `${icon_url}/${emulatorRef.current?.status}.svg`;

    const emulatorIcon = {
      url: icon_url,
      scaledSize: new window.google.maps.Size(20, 20),
      anchor: new window.google.maps.Point(10, 10),
    };

    markerRef.current?.setIcon(emulatorIcon);

    // Update marker title
    const title = `${emulatorRef.current?.telephone} ${emulatorRef.current?.tripStatus}(${emulatorRef.current?.status})`;
    markerRef.current?.setTitle(title);
  }
  ), [])

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

  var icon_url = `images/${emulatorRef.current?.tripStatus}/`;
  icon_url = icon_url + "SELECT";
  icon_url = `${icon_url}/${emulatorRef.current?.status}.svg`;

  const emulatorIcon = {
    url: icon_url,
    scaledSize: new window.google.maps.Size(20, 20),
    anchor: new window.google.maps.Point(10, 10),
  };


  return (
    <>
      <Marker
        key={emulatorRef.current?.id}
        icon={emulatorIcon}
        position={{ lat: emulatorRef.current?.latitude, lng: emulatorRef.current?.longitude }}
        onLoad={marker => markerRef.current = marker}
        title={`${emulatorRef.current?.telephone} ${emulatorRef.current?.tripStatus}(${emulatorRef.current?.status})`}
        labelStyle={{
          textAlign: "center",
          width: "auto",
          color: "#037777777777",
          fontSize: "11px",
          padding: "0px",
        }}
        labelAnchor={{ x: "auto", y: "auto" }}
        // onClick={() => selectEmulator(emulator)}
        draggable={true}
        onDragStart={(event) => {
          // remove any animation on marker
          markerRef.current?.setAnimation(null);
          const { latLng } = event;
          dragEmulator({
            emulator: emulatorRef.current,
            latitude: latLng.lat(),
            longitude: latLng.lng(),
            isDragMarkerDropped: false,
          });
          // if drag started from a MovedEmulator, reset moveMarker to false
          if (movedEmulatorRef.current?.emulator?.id === emulatorRef.current?.id && movedEmulatorRef.current?.moveMarker === true) {
            moveEmulator({
              emulator: emulatorRef.current,
              latitude: emulatorRef.current.latitude,
              longitude: emulatorRef.current.longitude,
              moveMarker: false,
            });
          }
        }}
        onDragEnd={(event) => {
          const { latLng } = event;
          dragEmulator({
            emulator: emulatorRef.current,
            latitude: latLng.lat(),
            longitude: latLng.lng(),
            isDragMarkerDropped: true,
          });
        }}
        zIndex={1}
      />
    </>
  );
}

export default EmulatorMarkerSelected;
