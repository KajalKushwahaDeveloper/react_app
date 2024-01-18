import React, { useEffect, useRef } from "react";

import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";

import { useEmulatorStore } from "../../../stores/emulator/store.tsx";
import { defaultLat, defaultLng } from "../../../stores/emulator/types_maps.tsx";
import EmulatorMarkers from "./Markers/EmulatorMarkers.jsx";
import { StopComponents } from "./Trip/StopComponents.jsx";
import { SelectedStopInfo } from "./Trip/SelectedStopInfo.jsx";
import { PathComponent } from "./Trip/PathComponent.jsx";
import useFetch from "../../../hooks/useFetch.js";
import { EMULATOR_URL } from "../../../constants.js";
import { defaultMapStyle, roadMapStyle } from "./MapStyles.js";

const libraries = ["drawing", "places", "autocomplete"];

const GoogleMapContainer = () => {
  console.log("rendering google map container");
  const mapRef = useRef(null);
  const styleRef = useRef("default");

  useEffect(() => useEmulatorStore.subscribe(
    state => state.draggedEmulator, (draggedEmulator) => {
      console.log("draggedEmulator changed", draggedEmulator);
      if (mapRef.current === null || mapRef.current === undefined) {
        return;
      }
      // not-dragged
      if (draggedEmulator && !draggedEmulator?.isDragMarkerDropped) {
        if (styleRef.current === "roadmap") {
          return;
        }
        styleRef.current = "roadmap";
        mapRef.current?.setOptions({ styles: roadMapStyle });
      }
      // dragged
      else if (!draggedEmulator || draggedEmulator?.isDragMarkerDropped) {
        if (styleRef.current === "default") {
          return;
        }
        styleRef.current = "default";
        mapRef.current?.setOptions({ styles: defaultMapStyle });
      }
    },
  ), [])

  useEffect(() => useEmulatorStore.subscribe(
    state => state.movedEmulator, (movedEmulator) => {
      console.log("movedEmulator changed", movedEmulator);
      if (mapRef.current === null || mapRef.current === undefined) {
        return;
      }
      // moved
      if (movedEmulator && movedEmulator.moveMarker) {
        mapRef.current?.setCenter({ lat: movedEmulator.latitude, lng: movedEmulator.longitude });
        mapRef.current?.setZoom(10);
        // do something maybe
      }
      // un-moved..
      else if (!movedEmulator || movedEmulator?.isDragMarkerDropped) {
        // do something maybe
      }
    },
  ), [])
  useEffect(() => useEmulatorStore.subscribe(
    state => state.center, (center) => {
      console.log("center changed", center);
      if (mapRef.current === null || mapRef.current === undefined) {
        return;
      }
      // center changed
      if (center && center.lat && center.lng) {
        mapRef.current?.setCenter(center);
      }
    }
  ), [])

  useEffect(() => useEmulatorStore.subscribe(
    state => state.tripData, (tripData) => {
      console.log("tripData changed", tripData);
      if (mapRef.current === null || mapRef.current === undefined) {
        return;
      }
      if (tripData && tripData.tripPoints && tripData.tripPoints.length > 0) {
        const bounds = new window.google.maps.LatLngBounds();
        // extend bound for first middle and last element.
        bounds.extend(
          new window.google.maps.LatLng(
            tripData.tripPoints[0].lat,
            tripData.tripPoints[0].lng
          )
        );
        bounds.extend(
          new window.google.maps.LatLng(
            tripData.tripPoints[tripData.tripPoints.length - 1].lat,
            tripData.tripPoints[tripData.tripPoints.length - 1].lng
          )
        );
        bounds.extend(
          new window.google.maps.LatLng(
            tripData.tripPoints[Math.floor(tripData.tripPoints.length / 2)].lat,
            tripData.tripPoints[Math.floor(tripData.tripPoints.length / 2)].lng
          )
        );
        console.log("fitting bounds", bounds);
        mapRef.current.fitBounds(bounds);
      }
    }
  ), [])



  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyB1HsnCUe7p2CE8kgBjbnG-A8v8aLUFM1E",
    libraries: libraries,
  });
  const [selectedStop, setSelectedStop] = React.useState(null);

  const handleMarkerClick = (stop) => {
    setSelectedStop(stop);
  };

  const createDevices = useEmulatorStore((state) => state.createDevices);

  const { data } = useFetch(EMULATOR_URL);

  useEffect(() => {
    if (data !== null) {
      createDevices(data);
    }
  }, [createDevices, data]);

  const handleInfoWindowClose = () => {
    setSelectedStop(null);
  };

  const containerStyle = {
    position: "unset !important",
    width: "100%",
    height: "100%",
  };

  const onLoad = React.useCallback(function callback(map) {
    mapRef.current = map;
  }, []);

  const onUnmount = React.useCallback(function callback(map) {
    mapRef.current = null;
  }, []);

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      zoom={4}
      center={{ lat: defaultLat, lng: defaultLng }}
      gestureHandling="none"
      zoomControl={false}
      options={{ scrollwheel: true, styles: defaultMapStyle, disableDefaultUI: true }}
      onLoad={onLoad}
      onUnmount={onUnmount}
    >
      <PathComponent />

      <StopComponents handleMarkerClick={handleMarkerClick}></StopComponents>
      {selectedStop && (
        <SelectedStopInfo
          selectedStop={selectedStop}
          handleInfoWindowClose={handleInfoWindowClose}
        ></SelectedStopInfo>
      )}

      <EmulatorMarkers />
    </GoogleMap>
  ) : (
    <>Loading...</>
  );
};

export default React.memo(GoogleMapContainer);
