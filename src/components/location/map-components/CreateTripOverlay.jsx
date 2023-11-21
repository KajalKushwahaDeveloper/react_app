// CreateTripOverlay.jsx
import React from "react";
import CreateTripTable from "./create_trip_table";
import "../../../scss/map.scss";

const CreateTripOverlay = ({
  isTableVisible,
  selectedEmId,
  selectedEmulator,
  showToast,
  setIsTableVisible,
  setSelectedEmId,
  setCreateTripInfo,
}) => {
  return (
    <div className="gps_createTrip_overlay">
      {isTableVisible && (
        <CreateTripTable
          selectedEmId={selectedEmId}
          selectedEmulator={selectedEmulator}
          showToast={showToast}
          setIsTableVisible={setIsTableVisible}
          setSelectedEmId={setSelectedEmId}
          setCreateTripInfo={setCreateTripInfo}
        />
      )}
    </div>
  );
};

export default CreateTripOverlay;
