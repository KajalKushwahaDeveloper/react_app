import React, { useState } from "react";
import "./scss/map.scss";
import { ToastContainer, toast } from "react-toastify";
import WrappedMap from "./components/location/Map";
import LinearProgress from "@mui/material/LinearProgress";


const showToast = (message, type) => {
  console.log("Showing toast...");
  toast[type](message); // Use the 'type' argument to determine the toast type
};

const GPS = () => {
  const mapURL = `https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=AIzaSyAOJ2QPH1vPWF7wXqdHMGFR54Vzlb13M1E`;

  return (
    <>
      <ToastContainer style={{ zIndex: 3 }} />
      <div className="gps_page" style={{paddingTop:"58px"}}>
        <div className="gps_map">
            <WrappedMap
              showToast={showToast}
              googleMapURL={mapURL}
              loadingElement={<div style={{ height: `100%` }} />}
              containerElement={<div className="mapContainer" />}
              mapElement={<div style={{ height: `100%` }} />}
            />
        </div>
      </div>
    </>
  );
};
export default GPS;
