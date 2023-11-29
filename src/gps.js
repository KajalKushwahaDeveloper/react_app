import "./scss/map.scss";
import { ToastContainer, toast } from "react-toastify";
import WrappedMap from "./components/location/Map";
import GpsTable from "./components/location/map-components/gps_page_table";
import MyTable from "./components/MyTable";
import React, { useState } from "react";

const showToast = (message, type) => {
  console.log("Showing toast...");
  toast[type](message); // Use the 'type' argument to determine the toast type
};

const GPS = () => {
  const mapURL = `https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=AIzaSyB1HsnCUe7p2CE8kgBjbnG-A8v8aLUFM1E`;
  
  return (
    <>
      <ToastContainer style={{ zIndex: 9999 }} /> {/* to show above all */}
      <WrappedMap
        showToast={showToast}
        googleMapURL={mapURL}
        loadingElement={<div style={{ height: `100%` }} />}
        containerElement={<div className="mapContainer" />}
        mapElement={<div style={{ height: `100%` }} />}
      />
    </>
  );
};
export default GPS;
