import React, { useEffect, useState } from "react";

import {
   EMULATOR_URL,
} from "../../constants";

import GoogleMapContainer from "./map-components/GoogleMapContainer";

import "../../css/mapbottomsheet.css";
import { useEmulatorStore } from "../../stores/emulator/store.tsx";
import useFetch from "../../hooks/useFetch.js";

const Map = () => {
  console.log("Map refreshed");
  
  const fetchEmulators = useEmulatorStore((state) => state.fetchEmulators);
  console.log("fetchEmulators: ", fetchEmulators);

  const createDevices = useEmulatorStore((state) => state.createDevices);

  const { data } = useFetch(EMULATOR_URL)
  
  useEffect(() => {
    console.log("Map.js - useEffect - data: ", data);
    if(data !== null) {
      createDevices(data);
    }
  }, [createDevices, data]);

  const [selectedStop, setSelectedStop] = useState(null);

  const handleMarkerClick = (stop) => {
    setSelectedStop(stop);
  };


  const handleInfoWindowClose = () => {
    setSelectedStop(null);
  };

  return (
    <GoogleMapContainer
      selectedStop={selectedStop}
      handleMarkerClick={handleMarkerClick}
      handleInfoWindowClose={handleInfoWindowClose}
    />
  );
};

export default Map;
