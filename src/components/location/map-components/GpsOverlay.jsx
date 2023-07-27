// GpsOverlay.jsx
import React from "react";
import GpsTable from "./gps_page_table";
import CurrentLocation from "./current_location";
import AddressTable from "./address_table";

const GpsOverlay = ({ showToast, emulators, setSelectedEmId , tripData}) => {
 
  return (
    <div className="gps_overlay">
      <GpsTable showToast={showToast} setSelectedEmId={setSelectedEmId} data = {emulators}/>
      <CurrentLocation />
      <AddressTable tripData={tripData}/>
      
    </div>
  );
};

export default GpsOverlay;
