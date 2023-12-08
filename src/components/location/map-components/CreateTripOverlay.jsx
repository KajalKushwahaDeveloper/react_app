// CreateTripOverlay.jsx
import React from "react";
import CreateTripTable from "./create_trip_table";
import "../../../scss/map.scss";
import { useStates } from "../../../StateProvider";

const CreateTripOverlay = () => {
  const { isTableVisible } = useStates();

  return (
    <div className="gps_createTrip_overlay">
      {isTableVisible && <CreateTripTable />}
    </div>
  );
};

export default CreateTripOverlay;
