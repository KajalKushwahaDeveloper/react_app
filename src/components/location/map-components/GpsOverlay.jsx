// GpsOverlay.jsx
import React from "react";
import GpsTable from "./gps_page_table";
import CurrentLocation from "./current_location";

const GpsOverlay = ({ showToast, setSelectedEmId }) => {
  return (
    <div className="gps_overlay">
      <GpsTable showToast={showToast} setSelectedEmId={setSelectedEmId} />
      <CurrentLocation />
    </div>
  );
};

export default GpsOverlay;
