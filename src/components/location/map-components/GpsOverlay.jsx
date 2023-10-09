// GpsOverlay.jsx
import React from "react";
import GpsTable from "./gps_page_table";
import AddressTable from "./address_table";
import { useState } from "react";


const GpsOverlay = ({
  showToast,
  emulators,
  setSelectedEmId,
  selectedEmId,
  tripData,
  setSelectedEmulator,
  selectedEmulator,
  emulator,
  AssignedTelephoneNumber,
  setAssignedTelephoneNumber,
  
}) => {
  return (
    <div className="gps_overlay" style={{width:"40%", marginTop: "4rem", marginBottom:"1rem" }}>
      <GpsTable
        showToast={showToast}
        setSelectedEmId={setSelectedEmId}
        selectedEmId={selectedEmId}
        emulators={emulators}
        setSelectedEmulator={setSelectedEmulator}
        selectedEmulator={selectedEmulator}
        AssignedTelephoneNumber={AssignedTelephoneNumber}
        setAssignedTelephoneNumber={setAssignedTelephoneNumber}
      />
         <div style={{ marginTop: "1rem", width:"80%"}}>
      <AddressTable tripData={tripData} emulator={emulator}/>
      </div>
    </div>
  );
};

export default GpsOverlay;
