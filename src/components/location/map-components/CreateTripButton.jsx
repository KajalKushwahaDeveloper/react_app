// CreateTripButton.jsx
import React from "react";

const CreateTripButton = ({ onClick }) => {
  return (
    <div >
      <button
        style={{
          height:"38px",
          zIndex: 2,
          position: "absolute",
          top: 11,
          right: 45,
          padding: ".65rem",
          marginTop: '40px'
        }}
        onClick={onClick}
      >
        Create Trip
      </button>
    </div>
  );
};

export default CreateTripButton;
