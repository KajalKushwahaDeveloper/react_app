// CreateTripOverlay.jsx
import React from "react";
import CreateTripTable from "./create_trip_table";
import "../../../scss/map.scss";

const CreateTripOverlay = ({
  isTableVisible,
  selectedEmId,
  showToast,
  setIsTableVisible,
  setSelectedEmId,
}) => {
  return (
    <div className="gps_createTrip_overlay">
      {isTableVisible && (
        <CreateTripTable
          selectedEmId={selectedEmId}
          showToast={showToast}
          setIsTableVisible={setIsTableVisible}
          setSelectedEmId={setSelectedEmId}
        />
      )}
    </div>
  );
};

export default CreateTripOverlay;
