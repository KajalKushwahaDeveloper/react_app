import { Marker } from "@react-google-maps/api";
import React, { useEffect, useRef } from "react";
import useMarkerStore from "../../../../stores/emulator/markerStore.js";
import { useEmulatorStore } from "../../../../stores/emulator/store.tsx";

const EmulatorMarker = React.memo(({ id }) => {
  const dragEmulator = useEmulatorStore((state) => state.dragEmulator);
  const draggedEmulator = useEmulatorStore((state) => state.draggedEmulator);
  const hoveredMarker = useEmulatorStore((state) => state.hoveredEmulator);
  const hoverEmulator = useEmulatorStore((state) => state.hoverEmulator);
  const selectEmulator = useEmulatorStore((state) => state.selectEmulator);

  const emulatorRef = useRef({
    id: id,
    telephone: `+1 000 000 0000`,
    tripStatus: `PAUSED`,
    status: `OFFLINE`,
    latitude: 37.7749,
    longitude: -122.4194,
  })

  //PAUSED RESTING RUNNING STOP //HOVER SELECT DEFAULT //ONLINE OFFLINE INACTIVE
  var icon_url = `images/${emulatorRef.current?.tripStatus}/`;
  icon_url = icon_url + "DEFAULT";
  icon_url = `${icon_url}/${emulatorRef.current?.status}.svg`;

  const emulatorIcon = {
    url: icon_url,
    scaledSize: new window.google.maps.Size(20, 20),
    anchor: new window.google.maps.Point(10, 10),
  };

  const markerRef = useRef(null);

  useEffect(() => useMarkerStore.subscribe(state => {
    if (markerRef.current === null || markerRef.current === undefined) {
      return
    }
    // if current marker is being hovered or dragged, skip
    if (hoveredMarker?.id === id || draggedEmulator?.emulator?.id === id) {
      return
    }

    emulatorRef.current = state[id]
    const newPosition = new window.google.maps.LatLng(emulatorRef.current?.latitude, emulatorRef.current?.longitude);
    markerRef.current?.setPosition(newPosition);

    var icon_url = `images/${emulatorRef.current?.tripStatus}/`;
    icon_url = icon_url + "DEFAULT";
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
  ), [draggedEmulator?.emulator?.id, hoveredMarker?.id, id])

  useEffect(() => useEmulatorStore.subscribe(state => state.connectedEmulator, (connectedEmulator) => {
    if (connectedEmulator?.id === id) {
      // hide the marker
      markerRef.current?.setVisible(false);
    } else {
      // show the marker
      markerRef.current?.setVisible(true);
    }
  }
  ), [id])


  return (
    <Marker
      key={id}
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
      onClick={() => selectEmulator(emulatorRef.current)}
      onMouseOver={() => {
        //check if the same marker is being dragged or hovered already
        if (draggedEmulator?.emulator?.id === id || hoveredMarker?.id === id) {
          return
        }
        hoverEmulator(emulatorRef.current)
      }}
      onMouseOut={() => {
        //check if the same marker is being dragged
        if (draggedEmulator?.emulator?.id === id) {
          return
        }
        hoverEmulator(null)
      }}
      draggable={true}
      onDragStart={(event) => {
        const { latLng } = event;
        dragEmulator({
          emulator: emulatorRef.current,
          latitude: latLng.lat(),
          longitude: latLng.lng(),
          isDragMarkerDropped: false,
        });
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
  );
});

export default EmulatorMarker;
