// StartSimulationButton.jsx
import React from "react";
import { Button } from "@material-ui/core";

const StartSimulationButton = ({ onClick }) => {
  return (
    <div className="btnCont p-3">
      <button variant="contained" onClick={onClick} className="btn btn-light">
        Start Simulation
      </button>
    </div>
  );
};

export default StartSimulationButton;
