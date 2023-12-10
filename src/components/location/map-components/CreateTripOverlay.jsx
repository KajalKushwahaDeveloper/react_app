// CreateTripOverlay.jsx
import React from "react";
import CreateTripTable from "./create_trip_table";
import "../../../scss/map.scss";
import { useStates } from "../../../StateProvider";

const CreateTripOverlay = () => {
  const {
    isTableVisible,
    selectedEmId,
    selectedEmulator,
    showToast,
    setIsTableVisible,
    setSelectedEmId,
  } = useStates();

  return (
    <div className="gps_createTrip_overlay">
      {isTableVisible && (
        <CreateTripTable
          selectedEmId={selectedEmId}
          selectedEmulator={selectedEmulator}
          showToast={showToast}
          setIsTableVisible={setIsTableVisible}
          setSelectedEmId={setSelectedEmId}
        />
      )}
    </div>
  );
};

export default CreateTripOverlay;
