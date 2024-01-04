import "./scss/map.scss";
import { ToastContainer } from "react-toastify";
import WrappedMap from "./components/location/Map";
import React from "react";
import CreateTripButton from "./components/location/map-components/CreateTripButton.jsx";
import CreateTripOverlay from "./components/location/map-components/CreateTripOverlay";
import { BottomSheet } from "react-spring-bottom-sheet";
import "react-spring-bottom-sheet/dist/style.css";
import { useViewPort } from "./ViewportProvider.js";
import GpsTable from "./components/location/map-components/gps_page_table.js";
import AddressTable from "./components/location/map-components/Address/address_table.js";

const GPS = () => {
  console.log("GPS.js refreshed");
  const { width } = useViewPort();
  const breakpoint = 620;
  const isMobile = width < breakpoint;

  return (
    <>
      <ToastContainer style={{ zIndex: 9999 }} /> {/* to show above all */}
      <CreateTripOverlay />
      {!isMobile && (
        <>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div>
              <AddressTable />
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap",
              }}
            >
              <div style={{ minWidth: "390px", height: "100vh" }}>
                <GpsTable />
              </div>
              {/*  fix the map, its showing full screen, should be 100% of the remaining space */}
              <div style={{ flex: "1", top: "128px" }}>
                <WrappedMap />
              </div>
            </div>
          </div>

          <CreateTripButton />
        </>
      )}
      {isMobile && (
        <>
          <div style={{ flex: "1", height: "100vh" }}>
            <WrappedMap />
          </div>
          <div>
              ‎
              <div>
                <div>
                  <AddressTable/>
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
