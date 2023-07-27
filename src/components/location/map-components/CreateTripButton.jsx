// CreateTripButton.jsx
import React from "react";

const CreateTripButton = ({ onClick }) => {
  return (
    <div>
      <button
        className="btn btn-light ms-4"
        style={{
          zIndex: 2,
          position: "absolute",
          top: 10,
          left: 180,
          padding: ".4rem .65rem",
        }}
        onClick={onClick}
      >
        Create Trip
      </button>
    </div>
  );
};

export default CreateTripButton;
