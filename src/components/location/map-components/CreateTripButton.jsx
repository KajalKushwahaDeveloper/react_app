// CreateTripButton.jsx
import React from "react";

const CreateTripButton = ({ onClick }) => {
  return (
    <div>
      <button
        style={{
          height:"40.5px",
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
