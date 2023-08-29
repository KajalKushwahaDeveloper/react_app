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
    <div className="gps_overlay" style={{ marginTop: "5rem" }}>
      <GpsTable
        showToast={showToast}
        setSelectedEmId={setSelectedEmId}
        selectedEmId={selectedEmId}
        data={emulators}
      />
      <AddressTable tripData={tripData} />
    </div>
  );
};

export default GpsOverlay;
