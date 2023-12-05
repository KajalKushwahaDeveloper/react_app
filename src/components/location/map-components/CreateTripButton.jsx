// CreateTripButton.jsx
import React, { useEffect, useState } from "react";
import SyncIcon from "@mui/icons-material/Sync";
import ApiService from "../../../ApiService";
import { EMULATOR_DRAG_URL, TRIP_URL } from "../../../constants";
import { useViewPort } from "../../../ViewportProvider.js";
import { border } from "@material-ui/system";

const CreateTripButton = ({
  onClick,
  tripData,
  emulator,
  validateEmulatorsData,
}) => {
  const { width, height } = useViewPort();

  const breakpoint = 620;
  const isMobileBelowSixTwenty = width < breakpoint;
  const [isSpinning, setSpinning] = useState(false);
  const [hideCancel, setHideCancel] = useState(false);

  const handleButtonClick = () => {
    setSpinning(true);
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  const handleCancelTripClick = async () => {
    const confirmed = window.confirm("Delete this trip?");
    if (confirmed) {
      const token = localStorage.getItem("token");

      let payload = {
        emulatorId: emulator.id,
        cancelTrip: true,
        latitude: emulator.latitude,
        longitude: emulator.longitude,
        newTripIndex: null,
      };

      const { success, data, error } = await ApiService.makeApiCall(
        EMULATOR_DRAG_URL,
        "POST",
        payload,
        token,
        null
      );

      if (success) {
        validateEmulatorsData(null, data);
      } else {
      }
    }
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
    <div style={{
      display: "flex",
      justifyContent: "space-around",
      marginTop:"7px"
    }}>
      <button
        style={
          isMobileBelowSixTwenty
            ? {
                height: "25px",
                zIndex: 2,
                bottom: "-35px",
                right: !hideCancel ? 110 : 210,
                padding: ".65rem",
                display: "flex",
                alignItems: "center",
                fontSize: "11px",
              }
            : {
                height: "38px",
                zIndex: 2,
                position: "absolute",
                top: "135px",
                right: !hideCancel ? 110 : 230,
                padding: ".65rem",
                display: "flex",
                alignItems: "center",
              }
        }
        onClick={onClick}>
        Create Trip
      </button>

      {hideCancel ? (
        <button
          style={
            isMobileBelowSixTwenty
              ? {
                  height: "25px",
                  zIndex: 2,
                  bottom: "-35px",
                  right: 110,
                  padding: ".65rem",
                  display: "flex",
                  alignItems: "center",
                  fontSize: "11px",
              }
              :{
                  height: "38px",
                  zIndex: 2,
                  position: "absolute",
                  top: "135px",
                  right: 110,
                  padding: ".65rem",
                  display: "flex",
                  alignItems: "center",
                }
          }
          onClick={handleCancelTripClick}>
          Cancel Trip
        </button>
      ) : null}

      <button
        style={
          isMobileBelowSixTwenty
            ? {
                height: "25px",
                zIndex: 2,
                bottom: "-35px",
                right: 50,
                padding: ".65rem",
                display: "flex",
                alignItems: "center",
              }
            : {
                height: "38px",
                zIndex: 2,
                position: "absolute",
                top: "135px",
                right: 50,
                padding: ".65rem",
                display: "flex",
                alignItems: "center",
              }
        }
        onClick={handleButtonClick}>
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
