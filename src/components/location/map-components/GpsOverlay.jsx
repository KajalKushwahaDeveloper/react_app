// GpsOverlay.jsx
import React from "react";
import GpsTable from "./gps_page_table";
import AddressTable from "./address_table";
import { useState } from "react";
import "../../../scss/map.scss";
import MyTable from "../../MyTable";


const GpsOverlay = ({
  showToast,
  emulators,
  setSelectedEmId,
  selectedEmId,
  hoveredMarker,
  tripData,
  setSelectedEmulator,
  selectedEmulator,
  emulator,
  AssignedTelephoneNumber,
  setAssignedTelephoneNumber,
  
}) => {
  return (
    <div style={{marginBottom:"4rem", position:"absolute", top:"50px"}}>
      <div>
        <GpsTable 
         showToast={showToast}
         setSelectedEmId={setSelectedEmId}
         selectedEmId={selectedEmId}
         hoveredMarker={hoveredMarker}
         emulators={emulators}
         setSelectedEmulator={setSelectedEmulator}
         selectedEmulator={selectedEmulator}
         AssignedTelephoneNumber={AssignedTelephoneNumber}
         setAssignedTelephoneNumber={setAssignedTelephoneNumber}
        />
      </div>
      {/* <div>
        <MyTable />
      </div> */}
      {/* <div>
        <AddressTable tripData={tripData} emulator={emulator}/>
      </div> */}
    </div>
  );
};

export default GpsOverlay;
