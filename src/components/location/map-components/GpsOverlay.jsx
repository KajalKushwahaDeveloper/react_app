// GpsOverlay.jsx
import React from "react";
import GpsTable from "./gps_page_table";
import CurrentLocation from "./current_location";
import AddressTable from "./address_table";

const GpsOverlay = ({ showToast, emulators, setSelectedEmId, selectedEmId, tripData}) => {
  return (
    <div className="gps_overlay">
      <GpsTable 
        showToast={showToast} 
        setSelectedEmId={setSelectedEmId} 
        selectedEmId={selectedEmId} 
        data = {emulators}
      />
      <CurrentLocation />
      <AddressTable tripData={tripData}/>
      
    </div>
  );
};

export default GpsOverlay;
