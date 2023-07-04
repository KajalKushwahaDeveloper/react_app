import React, { useState } from "react";
import GpsTable from "./components/gps_page_table";
import CurrentLocation from "./components/current_location";
import "./scss/map.scss";
import CreateTable from "./components/user_emulator_table";
import { ToastContainer, toast } from "react-toastify";
import WrappedMap from "./components/location/Map";
import useFetch from "./components/hooks/useFetch";

import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";

const showToast = (message, type) => {
  console.log("Showing toast...");
  toast[type](message); // Use the 'type' argument to determine the toast type
};

const GPS = () => {
  const { data: paths } = useFetch(
    "https://61a4a0604c822c0017041d33.mockapi.io/shuttle/v1/path"
  );
  const { data: stops } = useFetch(
    "https://61a4a0604c822c0017041d33.mockapi.io/shuttle/v1/stops"
  );
  const mapURL = `https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=AIzaSyAOJ2QPH1vPWF7wXqdHMGFR54Vzlb13M1E`;

  const [userAssingedEmulator, setUserAssingedEmulator] = useState(null);
  const [openUserAssignPopup, setOpenUserAssignPopup] = useState(false);
  const [emulatorToAssignUser, setEmulatorToAssignUser] = useState(null);
  const handleAssignUserButtonClick = (data) => {
    console.log("Assign Button clicked with data:", data);
    setEmulatorToAssignUser(data);
    setOpenUserAssignPopup(true);
  };

  return (
    <>
      <ToastContainer style={{ zIndex: 3 }} />
      <div className="gps_page">
        <div className="gps_tables">
          <GpsTable
            showToast={showToast}
            handleAssignUserButtonClick={handleAssignUserButtonClick}
            userAssingedEmulator={userAssingedEmulator}
            setUserAssingedEmulator={setUserAssingedEmulator}
          />

          <CurrentLocation />

          <CreateTable />

          <button className="login_button">START</button>
        </div>
        <div className="gps_map">
          {paths && stops ? (
            <WrappedMap
              paths={paths}
              stops={stops}
              googleMapURL={mapURL}
              loadingElement={<div style={{ height: `100%` }} />}
              containerElement={<div className="mapContainer" />}
              mapElement={<div style={{ height: `100%` }} />}
            />
          ) : (
            <Box sx={{ width: "100%" }}>
              <LinearProgress />
            </Box>
          )}
        </div>
      </div>
    </>
  );
};
export default GPS;