// CreateTripButton.jsx
import React, { useEffect, useState } from "react";
import SyncIcon from "@mui/icons-material/Sync";

const CreateTripButton = ({ onClick, tripData, emulator }) => {
  console.log("tripData", tripData);
  console.log("emulator", emulator);
  const [isSpinning, setSpinning] = useState(false);
  const [hideCancel, setHideCancel] = useState(false);

  const handleButtonClick = () => {
    setSpinning(true);
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  useEffect(() => {
    if (
      (tripData !== null && emulator !== null) ||
      (tripData !== null && emulator === null)
    ) {
      setHideCancel(true);
    } else {
      setHideCancel(false);
    }
  }, [tripData, emulator]);

  return (
    <div>
      <button
        style={{
          height: "38px",
          zIndex: 2,
          position: "absolute",
          top: "135px",
          right: !hideCancel ? 110 : 230,
          padding: ".65rem",
          display: "flex",
          alignItems: "center",
        }}
        onClick={onClick}
      >
        Create Trip
      </button>

      {hideCancel ? (
        <button
          style={{
            height: "38px",
            zIndex: 2,
            position: "absolute",
            top: "135px",
            right: 110,
            padding: ".65rem",
            display: "flex",
            alignItems: "center",
          }}
          // onClick={onClick}
        >
          Cancel Trip
        </button>
      ) : null}

      <button
        style={{
          height: "38px",
          zIndex: 2,
          position: "absolute",
          top: "135px",
          right: 50,
          padding: ".65rem",
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
