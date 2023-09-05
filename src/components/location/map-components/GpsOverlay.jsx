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
  AssignedTelephoneNumber,
  setAssignedTelephoneNumber,
  
}) => {
  return (
    <div className="gps_overlay" style={{ marginTop: "5rem" }}>
      <GpsTable
        showToast={showToast}
        setSelectedEmId={setSelectedEmId}
        selectedEmId={selectedEmId}
        data={emulators}
        setSelectedEmulator={setSelectedEmulator}
        selectedEmulator={selectedEmulator}
        AssignedTelephoneNumber={AssignedTelephoneNumber}
        setAssignedTelephoneNumber={setAssignedTelephoneNumber}
      />
      <AddressTable tripData={tripData} />
    </div>
  );
};

export default GpsOverlay;
