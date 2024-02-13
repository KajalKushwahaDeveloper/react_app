import "./scss/map.scss";
import "./scss/button.scss";
import { ToastContainer } from "react-toastify";
import React, { useEffect } from "react";
import { BottomSheet } from "react-spring-bottom-sheet";
import "react-spring-bottom-sheet/dist/style.css";
import { useViewPort } from "./ViewportProvider.js";
import GpsTable from "./components/location/map-components/gps_page_table.js";
import AddressTable from "./components/location/map-components/Address/AddressTable.js";
import { DragDialog } from "./components/location/map-components/DragDialog.jsx";
import GoogleMapContainer from "./components/location/map-components/GoogleMapContainer.jsx";
import CreateTripDialog from "./components/location/map-components/CreateTrip/CreateTripDialog.js";
import MovePositionDialog from "./components/location/map-components/CreateTrip/MovePositionDialog.js";
import CreateTripButton from "./components/location/map-components/MapButtons.jsx";
import { useEmulatorStore } from "./stores/emulator/store.tsx";

const GPS = () => {
  const selectedDevice = useEmulatorStore((state) => state.selectedDevice);

  const setMicCheck = useEmulatorStore((state) => state.setMicEnabled);

  console.log("GPS rendered!", selectedDevice)
  const { width } = useViewPort();
  const breakpoint = 620;
  const isMobile = width < breakpoint;


  useEffect(() => {
    if (window.location.pathname === "/gps") {

      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        // Attempt to access the user's media devices (microphone)
        navigator.mediaDevices.getUserMedia({ audio: true })
          .then((stream) => {
            console.log(stream)
            // Stop all tracks once we have the permission
            stream.getTracks().forEach(track => track.stop());;
          })
          .catch((error) => {
            console.log(error);
          });
      }

      // For granted and denied status
      const checkMicrophonePermission = async () => {
        try {
          // Check microphone permission status
          const permissionStatus = await navigator.permissions.query({ name: 'microphone' });
          
          permissionStatus.state === "granted" ? setMicCheck(true) : setMicCheck(false);

          // Listen for changes in permission status
          permissionStatus.onchange = () => {
            permissionStatus.state === "granted" ? setMicCheck(true) : setMicCheck(false);
          };
        } catch (error) {
          console.error('Error checking microphone permission:', error);
        }
      };

      checkMicrophonePermission();
      return () => {
        // Cleanup if necessary
      };

    }
  }, [setMicCheck]);


  return (
    <>
      <ToastContainer style={{ zIndex: 9999 }} /> {/* to show above all */}
      <DragDialog />
      <CreateTripDialog />
      <MovePositionDialog />
      {!isMobile && (
        <>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <AddressTable />
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap",
                width: "100%",
              }}
            >
              <div style={{ width: "320px", height: "100vh" }}>
                <GpsTable />
              </div>
              {/* TODO fix the map, its showing full screen, should be 100% of the remaining space */}
              <div style={{ flex: "1", top: "128px" }}>
                <GoogleMapContainer />
              </div>
            </div>
          </div>

          <CreateTripButton />
        </>
      )}
      {isMobile && (
        <>
          <div style={{ flex: "1", height: "100vh" }}>
            <GoogleMapContainer />
          </div>
          <div>
            ‎
            <div>
              <div>
                <AddressTable />
              </div>
            </div>
          </div>
          <BottomSheet
            className="bottom_sheet"
            open={true}
            blocking={false}
            // header={
            //   <div className="mt-1 block w-full rounded-md bg-gray-100 border-transparent focus:border-gray-300 focus:bg-white focus:ring-0">
            //     INFO
            //   </div>
            // }
            snapPoints={({ maxHeight }) => [maxHeight / 15, maxHeight * 0.45]}
          >
            <GpsTable />
            {/* <div>
              ‎
              <div>
                <div>
                  <AddressTable />
                </div>
              </div>
            </div> */}
          </BottomSheet>
        </>
      )}
    </>
  );
};
export default GPS;
