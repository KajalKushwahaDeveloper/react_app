// CreateTripButton.jsx
import React, { useState } from "react";
import SyncIcon from "@mui/icons-material/Sync";

const CreateTripButton = ({ onClick }) => {
  const [isSpinning, setSpinning] = useState(false);

  const handleButtonClick = () => {
    setSpinning(true);
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };
  return (
    <div>
      <button
        style={{
          height: "38px",
          zIndex: 2,
          position: "absolute",
          top: 90,
          right: 110,
          padding: ".65rem",
          marginTop: "40px",
        }}
        onClick={onClick}
      >
        Create Trip
      </button>
      <button
        style={{
          height: "38px",
          zIndex: 2,
          position: "absolute",
          top: 90,
          right: 50,
          padding: ".65rem",
          marginTop: "40px",
          display: "flex",
          alignItems: "center",
        }}
        onClick={handleButtonClick}
      >
        <SyncIcon
          sx={{
            transition: "transform 1s ease-in-out", // CSS transition for smooth animation
            transform: isSpinning ? "rotate(360deg)" : "", // Apply rotation based on state
          }}
        />
      </button>
    </div>
  );
};

export default CreateTripButton;
