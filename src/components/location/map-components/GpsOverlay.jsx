// GpsOverlay.jsx
import React from "react";
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
  setAssignedTelephoneNumber,
  
}) => {
  return (
    <div className="gps_overlay" style={{width:"40%", marginTop: "4rem", marginBottom:"1rem", paddingBottom: "58px" }}>
      <div style={{ marginBottom: "1rem"}}>
        <AddressTable tripData={tripData} emulator={emulator}/>
      </div>
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
  );
};

export default GpsOverlay;
