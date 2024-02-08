import "./scss/map.scss";
import "./scss/button.scss";
import { ToastContainer } from "react-toastify";
import React, { useEffect, useState } from "react";
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
  const [isMicrophoneConnected, setIsMicrophoneConnected] = useState(false);

  console.log("GPS rendered!",selectedDevice)
  const { width } = useViewPort();
  const breakpoint = 620;
  const isMobile = width < breakpoint;

  console.log("windowsLocation:", window.location.pathname);

  useEffect(() => {
    if (window.location.pathname === "/gps") {
      let mediaStream = null;
      const handleMicrophoneStatusChange = () => {
        console.log("HelloData");
        setIsMicrophoneConnected(false);
      };

      // Check if the browser supports getUserMedia
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        // Attempt to access the user's media devices (microphone)

        navigator.mediaDevices.getUserMedia({ audio: true })
          .then((stream) => {
            // Microphone access granted
            console.log("respAudio", stream);
            setIsMicrophoneConnected(true);

            // Store the media stream
            mediaStream = stream;

            // Listen for the microphone status change event
            mediaStream.getAudioTracks()[0].addEventListener('ended', handleMicrophoneStatusChange);
          })
          .catch((error) => {
            // Microphone access denied or no microphone detected
            setIsMicrophoneConnected(false);
            // Open a popup to notify the user
            // alert('Please connect a microphone or grant access to your microphone to use this feature.');
          });

      } else {
        // Browser doesn't support getUserMedia
        setIsMicrophoneConnected(false);
        // Open a popup to notify the user
        // alert('Your browser does not support accessing the microphone. Please use a different browser.');
      }

      // Cleanup function to remove event listener and close media stream
      return () => {
        if (mediaStream !== null) {
          mediaStream.getAudioTracks()[0].removeEventListener('ended', handleMicrophoneStatusChange);
          mediaStream.getTracks().forEach(track => track.stop());
        }
      };
      }
  }, []);

  console.log("CheckMicrophone:",isMicrophoneConnected);

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
