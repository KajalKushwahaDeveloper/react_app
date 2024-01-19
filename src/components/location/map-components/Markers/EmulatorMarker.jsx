import { Marker } from "@react-google-maps/api";
import React, { useEffect, useRef } from "react";
import useMarkerStore from "../../../../stores/emulator/markerStore.js";
import { useEmulatorStore } from "../../../../stores/emulator/store.tsx";
import { set } from "lodash";

const EmulatorMarker = React.memo(({ id }) => {
  const dragEmulator = useEmulatorStore.getState().dragEmulator;
  const hoverEmulator = useEmulatorStore.getState().hoverEmulator;
  const selectEmulator = useEmulatorStore.getState().selectEmulator;

  const hoveredEmulatorRef = useRef(useEmulatorStore.getState().hoveredMarker);
  const draggedEmulatorRef = useRef(useEmulatorStore.getState().draggedEmulator);
  const connectedEmulatorRef = useRef(useEmulatorStore.getState().connectedEmulator);

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

  useEffect(() => useEmulatorStore.subscribe(state => state.hoveredEmulator, (hoveredEmulator) => {
    if (hoveredEmulator && hoveredEmulator.id === id) { // if the hoveredEmulator is the same as this marker (id), we set the hoveredEmulatorRef to only this marker
      hoveredEmulatorRef.current = hoveredEmulator
      return
    }
    if (hoveredEmulator === null || hoveredEmulator === undefined) { // if the hoveredEmulator is null, we set the hoveredEmulatorRef to null
      hoveredEmulatorRef.current = hoveredEmulator
    }
  }), [id])

  useEffect(() => useEmulatorStore.subscribe(state => state.draggedEmulator, (draggedEmulator) => {
    if (draggedEmulator && draggedEmulator.emulator.id === id) { // if the draggedEmulator is the same as this marker (id), we set the draggedEmulatorRef to only this marker
      draggedEmulatorRef.current = draggedEmulator
      return
    }
    if (draggedEmulator === null || draggedEmulator === undefined) { // if the draggedEmulator is null, we set the draggedEmulatorRef to null
      draggedEmulatorRef.current = draggedEmulator
    }
  }), [id])

  useEffect(() => useMarkerStore.subscribe(state => {
    if (markerRef.current === null || markerRef.current === undefined) {
      return
    }
    // if current marker (non selected!) is being  dragged, skip
    if (draggedEmulatorRef.current?.emulator?.id === id) {
      return
    }
    // if current marker is the connectedEmulator, skip
    if (connectedEmulatorRef.current?.id === id) {
      return
    }
    emulatorRef.current = state[id];
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
    // can further optimize by checking if the icon and title is the same
    markerRef.current?.setIcon(emulatorIcon);
    // Update marker title
    const title = `${emulatorRef.current?.telephone} ${emulatorRef.current?.tripStatus}(${emulatorRef.current?.status})`;
    markerRef.current?.setTitle(title);
  }
  ), [id])

  useEffect(() => useEmulatorStore.subscribe(state => state.connectedEmulator, (connectedEmulator) => {
    if (connectedEmulator?.id === id) {
      // set ConnectedEmulatorRef to only this marker
      connectedEmulatorRef.current = connectedEmulator
      // hide the marker
      setMarkerVisibility(false);
      return
    }
    // show the marker
    setMarkerVisibility(true);
  }
  ), [id])

  // function to set Marker to be visible or not after checking it's existing visibility
  const setMarkerVisibility = (isVisible) => {
    if (markerRef.current?.getVisible() !== isVisible) {
      markerRef.current.setVisible(isVisible);
    }
  };

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
        if (draggedEmulatorRef.current?.emulator?.id === id || hoveredEmulatorRef.current?.id === id) {
          return
        }
        hoverEmulator(emulatorRef.current)
      }}
      onMouseOut={() => {
        //check if the same marker is being dragged
        if (draggedEmulatorRef.current?.emulator?.id === id) {
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
