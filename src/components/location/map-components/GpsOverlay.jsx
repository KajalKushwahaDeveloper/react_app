// GpsOverlay.jsx
import React, { useEffect } from "react";
import GpsTable from "./gps_page_table";
import AddressTable from "./address_table";
import { useState } from "react";
import "../../../scss/map.scss";


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
  setAssignedTelephoneNumber
}) => {
  return (
    <div className="changeTopGpsTable" style={{marginBottom:"4rem", position:"absolute", top:"22vh"}}>
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
      <div>
        <AddressTable tripData={tripData} emulator={emulator}/>
      </div>
    </div>
  );
};

export default GpsOverlay;
