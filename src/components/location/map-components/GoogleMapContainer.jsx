import React, { useEffect, useRef } from "react";

import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";

import { useEmulatorStore } from "../../../stores/emulator/store.tsx";
import { compareTripData } from "../../../stores/emulator/types_maps.tsx";
import EmulatorMarkers from "./Markers/EmulatorMarkers.jsx";
import { StopComponents } from "./Trip/StopComponents.jsx";
import { SelectedStopInfo } from "./Trip/SelectedStopInfo.jsx";
import { PathComponent } from "./Trip/PathComponent.jsx";
import useFetch from "../../../hooks/useFetch.js";
import { EMULATOR_URL } from "../../../constants.js";

const libraries = ["drawing", "places", "autocomplete"];

const GoogleMapContainer = () => {
  const center = useEmulatorStore((state) => state.center);
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
  useEffect(() => {
    if (
      tripData === null ||
      mapRef.current === null ||
      mapRef.current === null ||
      mapRef.current === undefined
    ) {
      return;
    }
    if (tripData.tripPoints === null || tripData.tripPoints.length <= 0) {
      return;
    }
    const bounds = new window.google.maps.LatLngBounds();
    tripData?.tripPoints?.forEach((element) => {
      bounds.extend(new window.google.maps.LatLng(element.lat, element.lng));
    });
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
          color: "#7E7E7E",
        }
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
          color: "#ffffff",
        }
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
          color: "#dae2ec",
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
          color: "#BEBEBEBE",
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
          color: "#dae2ec",
        }
      ],
    },
    {
      featureType: "poi",
      elementType: "geometry",
      stylers: [
        {
          color: "#e9eef3",
        }
      ],
    },
    {
      featureType: "road.highway",
      elementType: "geometry.fill",
      stylers: [
        {
          color: "#ffffff",
        }
      ],
    },
    {
      featureType: "road.highway",
      elementType: "geometry.stroke",
      stylers: [
        {
          color: "#8F8F8F",
        },
        {
          weight: 0.5,
        },
      ],
    },
    {
      featureType: "road.arterial",
      elementType: "geometry",
      stylers: [
        {
          color: "#BEBEBE",
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
          color: "#DDDDDDBE",
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
          color: "#BEBEBEBE",
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
          color: "#BEBEBE",
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

      <EmulatorMarkers />
    </GoogleMap>
  ) : (
    <>Loading...</>
  );
};

export default React.memo(GoogleMapContainer);
