import React, { useEffect, useRef } from "react";

import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";

import "../../../scss/map.scss";
import { useEmulatorStore } from "../../../stores/emulator/store.tsx";
import { compareTripData } from "../../../stores/emulator/types_maps.tsx";
import EmulatorMarkers from "./Markers/EmulatorMarkers.jsx";
import { StopComponents } from "./Trip/StopComponents.jsx";
import { SelectedStopInfo } from "./Trip/SelectedStopInfo.jsx";
import { PathComponent } from "./Trip/PathComponent.jsx";

const libraries = ["drawing", "places", "autocomplete"];

const GoogleMapContainer = ({
  selectedStop,
  handleMarkerClick,
  handleInfoWindowClose
}) => {
  const center = useEmulatorStore((state) => state.center);
  console.log("GoogleMapContainer refreshed ");
  const tripData = useEmulatorStore(
    (state) => state.tripData,
    (oldTripData, newTripData) => compareTripData(oldTripData, newTripData)
  );
  const mapRef = useRef(null);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyB1HsnCUe7p2CE8kgBjbnG-A8v8aLUFM1E",
    libraries: libraries,
  });

  useEffect(() => {
    if (
      tripData === null ||
      mapRef.current === null ||
      mapRef.current === null ||
      mapRef.current === undefined
    ) {
      console.log(`fitBounds ERROR: ${tripData} mapRef: ${mapRef.current}`);
      return;
    }
    if (tripData.tripPoints === null || tripData.tripPoints.length <= 0) {
      console.log(
        `fitBounds ERROR tripData: ${tripData === null} mapRef: ${
          mapRef.current === null
        }`
      );
      return;
    }
    const bounds = new window.google.maps.LatLngBounds();
    tripData?.tripPoints?.forEach((element) => {
      bounds.extend(new window.google.maps.LatLng(element.lat, element.lng));
    });
    console.log("bounds", bounds);
    mapRef.current.fitBounds(bounds);
  }, [mapRef, tripData]);

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

  const darkMapStyle = [
    {
      featureType: "all",
      elementType: "labels.text.fill",
      stylers: [
        {
          saturation: 36,
        },
        {
          color: "#000000",
        },
        {
          lightness: 40,
        },
      ],
    },
    {
      featureType: "all",
      elementType: "labels.text.stroke",
      stylers: [
        {
          visibility: "on",
        },
        {
          color: "#000000",
        },
        {
          lightness: 16,
        },
      ],
    },
    {
      featureType: "all",
      elementType: "labels.icon",
      stylers: [
        {
          visibility: "off",
        },
      ],
    },
    {
      featureType: "administrative",
      elementType: "geometry.fill",
      stylers: [
        {
          color: "#000000",
        },
        {
          lightness: 20,
        },
      ],
    },
    {
      featureType: "administrative",
      elementType: "geometry.stroke",
      stylers: [
        {
          color: "#000000",
        },
        {
          lightness: 17,
        },
        {
          weight: 1.2,
        },
      ],
    },
    {
      featureType: "landscape",
      elementType: "geometry",
      stylers: [
        {
          color: "#000000",
        },
        {
          lightness: 20,
        },
      ],
    },
    {
      featureType: "poi",
      elementType: "geometry",
      stylers: [
        {
          color: "#000000",
        },
        {
          lightness: 21,
        },
      ],
    },
    {
      featureType: "road.highway",
      elementType: "geometry.fill",
      stylers: [
        {
          color: "#000000",
        },
        {
          lightness: 17,
        },
      ],
    },
    {
      featureType: "road.highway",
      elementType: "geometry.stroke",
      stylers: [
        {
          color: "#000000",
        },
        {
          lightness: 29,
        },
        {
          weight: 0.2,
        },
      ],
    },
    {
      featureType: "road.arterial",
      elementType: "geometry",
      stylers: [
        {
          color: "#000000",
        },
        {
          lightness: 18,
        },
      ],
    },
    {
      featureType: "road.local",
      elementType: "geometry",
      stylers: [
        {
          color: "#000000",
        },
        {
          lightness: 16,
        },
      ],
    },
    {
      featureType: "transit",
      elementType: "geometry",
      stylers: [
        {
          color: "#000000",
        },
        {
          lightness: 19,
        },
      ],
    },
    {
      featureType: "water",
      elementType: "geometry",
      stylers: [
        {
          color: "#000000",
        },
        {
          lightness: 17,
        },
      ],
    },
  ];

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      zoom={4}
      center={center}
      gestureHandling="none"
      zoomControl={false}
      options={{ scrollwheel: true, styles: darkMapStyle }}
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

      <EmulatorMarkers/>
    </GoogleMap>
  ) : (
    <>Loading...</>
  );
};

export default GoogleMapContainer;
