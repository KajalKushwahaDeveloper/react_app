// GpsOverlay.jsx
import React from "react";
import GpsTable from "./gps_page_table";
import CurrentLocation from "./current_location";
import AddressTable from "./address_table";

const GpsOverlay = ({ showToast, setSelectedEmId ,createTripData}) => {
 
  return (
    <div className="gps_overlay">
      <GpsTable showToast={showToast} setSelectedEmId={setSelectedEmId} />
      <CurrentLocation />
      <AddressTable createTripData={createTripData}/>
      
    </div>
  );
};

export default GpsOverlay;
