// StartSimulationButton.jsx
import React from "react";
import { Button } from "@material-ui/core";

const StartSimulationButton = ({ onClick }) => {
  return (
    <div className="btnCont">
      <Button variant="contained" onClick={onClick}>
        Start Simulation
      </Button>
    </div>
  );
};

export default StartSimulationButton;
