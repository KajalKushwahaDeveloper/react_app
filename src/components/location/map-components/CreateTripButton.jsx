// CreateTripButton.jsx
import React from "react";
import "../../../scss/map.scss";

const CreateTripButton = ({ onClick }) => {
  return (
    <div>
      <button
        style={{
          zIndex: 2,
          position: "absolute",
          top: 10,
          left: 170,
          padding: ".65rem",
        }}
        onClick={onClick}
      >
        Create Trip
      </button>
    </div>
  );
};

export default CreateTripButton;
