// GpsOverlay.jsx
import React from "react";
import GpsTable from "./gps_page_table";
import AddressTable from "./address_table";

const GpsOverlay = ({ showToast, emulators, setSelectedEmId , tripData}) => {
 
  return (
    <div className="gps_overlay">
      <GpsTable showToast={showToast} setSelectedEmId={setSelectedEmId} data = {emulators}/>
      <AddressTable tripData={tripData}/>
      
    </div>
  );
};

export default GpsOverlay;
