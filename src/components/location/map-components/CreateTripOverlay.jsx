// CreateTripOverlay.jsx
import React from "react";
import CreateTripTable from "./create_trip_table";
import "../../../scss/map.scss";
import CreateTripDialogBox from "../../create_trip_dialog_box";

const CreateTripOverlay = ({
  isTableVisible,
  selectedEmId,
  showToast,
  setIsTableVisible,
  setSelectedEmId,
  setCreateTripInfo,
}) => {
  return (
    <div className="gps_createTrip_overlay">

        <CreateTripDialogBox
          selectedEmId={selectedEmId}
          showToast={showToast}
          setIsTableVisible={setIsTableVisible}
          setSelectedEmId={setSelectedEmId}
          setCreateTripInfo={setCreateTripInfo}
          isTableVisible={isTableVisible}
        />

    </div>
  );
};

export default CreateTripOverlay;
