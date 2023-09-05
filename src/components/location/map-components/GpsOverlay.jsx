// GpsOverlay.jsx
import React from "react";
import GpsTable from "./gps_page_table";
import AddressTable from "./address_table";

const GpsOverlay = ({
  showToast,
  emulators,
  setSelectedEmId,
  selectedEmId,
  tripData,
}) => {
  return (
    <div className="gps_overlay" style={{ marginTop: "4rem", marginBottom:"1rem" }}>
      <GpsTable
        showToast={showToast}
        setSelectedEmId={setSelectedEmId}
        selectedEmId={selectedEmId}
        data={emulators}
      />
         <div style={{ marginTop: "1rem", width:"80%"}}>
      <AddressTable tripData={tripData} />
      </div>
    </div>
  );
};

export default GpsOverlay;
