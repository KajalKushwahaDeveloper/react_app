import "./scss/map.scss";
import { ToastContainer, toast } from "react-toastify";
import WrappedMap from "./components/location/Map";
import React, { useState, useEffect } from "react";
import CreateTripButton from "./components/location/map-components/CreateTripButton.jsx";
import CreateTripOverlay from "./components/location/map-components/CreateTripOverlay";
import { BottomSheet } from "react-spring-bottom-sheet";
import "react-spring-bottom-sheet/dist/style.css";
import { useViewPort } from "./ViewportProvider.js";
import { useStates } from "./StateProvider.js";
import GpsTable from "./components/location/map-components/gps_page_table.js";
import AddressTable from "./components/location/map-components/address_table.js";
import { GetEmulatorApi } from "./components/api/emulator.js";
import { Hidden } from "@mui/material";

const showToast = (message, type) => {
  console.log("Showing toast...");
  toast[type](message); // Use the 'type' argument to determine the toast type
};

const GPS = () => {
  const { width, height } = useViewPort();
  const {
    selectedEmId,
    paths,
    stops,
    tripData,
    emulators,
    setEmulators,
    emulator,
    setEmulator,
    setSelectedEmId,
    selectedEmulator,
    setSelectedEmulator,
    AssignedTelephoneNumber,
    setAssignedTelephoneNumber,
    isTableVisible,
    setIsTableVisible,
    validateEmulatorsData,
    hoveredMarker,
    setHoveredMarker,
  } = useStates();
  const [emulatorData, setEmulatorData] = useState();
  const [runEmuAPI, setRunEmuApi] = useState(false);

  const breakpoint = 620;
  const isMobile = width < breakpoint;

  const mapURL = `https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=AIzaSyB1HsnCUe7p2CE8kgBjbnG-A8v8aLUFM1E`;

  const handleCreateTripButton = () => {
    if (selectedEmulator === null) {
      showToast("Emulator is not selected", "error"); //Emulator is not selected error
    } else if (AssignedTelephoneNumber === null) {
      console.log("Assigned number", AssignedTelephoneNumber);
      showToast("Telephone Number is not Assigned", "error"); //Telephone Number is not Assigned
    } else {
      setIsTableVisible(!isTableVisible);
    }
  };

  const emuAPI = () => {
    setRunEmuApi(!runEmuAPI);
  };

  useEffect(() => {
    const getEmulatorData = async () => {
      const { success, data, error } = await GetEmulatorApi();
      if (success) {
        setEmulatorData(data);
      } else {
        console.log("Error:", error);
      }
    };
    getEmulatorData();
  }, [runEmuAPI]);

  return (
    <>
      <ToastContainer style={{ zIndex: 9999 }} /> {/* to show above all */}
      {!isMobile && (
        <>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div>
              <AddressTable tripData={tripData} emulator={emulator} />
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap",
              }}
            >
              <div style={{ minWidth: "400px", height: "100vh" }}>
                <GpsTable
                  showToast={showToast}
                  setSelectedEmId={setSelectedEmId}
                  selectedEmId={selectedEmId}
                  hoveredMarker={hoveredMarker}
                  emulators={emulatorData}
                  setSelectedEmulator={setSelectedEmulator}
                  selectedEmulator={selectedEmulator}
                  AssignedTelephoneNumber={AssignedTelephoneNumber}
                  setAssignedTelephoneNumber={setAssignedTelephoneNumber}
                  emuAPI={emuAPI}
                />
              </div>
              {/* TODO fix the map, its showing full screen, should be 100% of the remaining space */}
              <div style={{ flex: "1" }}>
                <WrappedMap showToast={showToast} />
              </div>
            </div>
          </div>

          <CreateTripButton
            onClick={handleCreateTripButton}
            tripData={tripData}
            emulator={emulator}
            validateEmulatorsData={validateEmulatorsData}
            emuAPI={emuAPI}
          />
          <CreateTripOverlay
            isTableVisible={isTableVisible}
            selectedEmId={selectedEmId}
            selectedEmulator={selectedEmulator}
            showToast={showToast}
            setIsTableVisible={setIsTableVisible}
            setSelectedEmId={setSelectedEmId}
            emuAPI={emuAPI}
          />
        </>
      )}
      {isMobile && (
        <>
          <div  style={{ flex: "1", height:"100vh" }}>
            <WrappedMap showToast={showToast} />
          </div>
          <BottomSheet
            className="bottom_sheet"
            open={true}
            blocking={false}
            header={
              <div className="mt-1 block w-full rounded-md bg-gray-100 border-transparent focus:border-gray-300 focus:bg-white focus:ring-0">
                INFO
              </div>
            }
            snapPoints = {({ maxHeight }) => [maxHeight / 15, maxHeight * 0.7]}
          >
            <div>
              ‎
              <CreateTripOverlay
                isTableVisible={isTableVisible}
                selectedEmId={selectedEmId}
                selectedEmulator={selectedEmulator}
                showToast={showToast}
                setIsTableVisible={setIsTableVisible}
                setSelectedEmId={setSelectedEmId}
                emuAPI={emuAPI}
              />
              <div>
                <div>
                  <AddressTable
                    tripData={tripData}
                    emulator={emulator}
                    validateEmulatorsData={validateEmulatorsData}
                    handleCreateTripButton={handleCreateTripButton}
                    showToast={showToast}
                    setSelectedEmId={setSelectedEmId}
                    selectedEmId={selectedEmId}
                    hoveredMarker={hoveredMarker}
                    emulators={emulatorData}
                    setSelectedEmulator={setSelectedEmulator}
                    selectedEmulator={selectedEmulator}
                    AssignedTelephoneNumber={AssignedTelephoneNumber}
                    setAssignedTelephoneNumber={setAssignedTelephoneNumber}
                    emuAPI={emuAPI}
                  />
                </div>
              </div>
            </div>
          </BottomSheet>
        </>
      )}
    </>
  );
};
export default GPS;
