import React, { useEffect, useState } from "react";
import SyncIcon from "@mui/icons-material/Sync";
import ApiService from "../../../ApiService.js";
import { EMULATOR_DRAG_URL } from "../../../constants.js";
import { useViewPort } from "../../../ViewportProvider.js";
import { useStates } from "../../../StateProvider.js";
import { useEmulatorStore } from "../../../stores/emulator/store.tsx";

const MapButtons = () => {
  const { width } = useViewPort();
  const { showToast, setIsTableVisible, isTableVisible, isMoveDialogVisible, setIsMoveDialogVisible } = useStates();

  //Initiate fetchEmulators from store
  const tripData = useEmulatorStore((state) => state.tripData);
  const connectedEmulator = useEmulatorStore((state) => state.connectedEmulator);
  const movedEmulator = useEmulatorStore((state) => state.movedEmulator);
  const moveEmulator = useEmulatorStore((state) => state.moveEmulator);
  const breakpoint = 620;
  const isMobile = width < breakpoint;
  const [isSpinning, setSpinning] = useState();
  const [showCancel, setShowCancel] = useState(false);

  const handleSetPositionClick = () => {
    if (connectedEmulator === null) {
      showToast("Emulator is not selected", "error"); //Emulator is not selected error
    } else {
      setIsMoveDialogVisible(!isMoveDialogVisible);
    }
  };

  const handleSetPositionCancelClick = () => {
    moveEmulator({
      emulator: connectedEmulator,
      latitude: connectedEmulator.latitude,
      longitude: connectedEmulator.longitude,
      moveMarker: false
    });
  };

  const handleCreateTripButton = () => {
    if (connectedEmulator === null) {
      showToast("Emulator is not selected", "error"); //Emulator is not selected error
    } else if (connectedEmulator.AssignedTelephoneNumber === null) {
      showToast("Telephone Number is not Assigned", "error"); //Telephone Number is not Assigned
    } else {
      setIsTableVisible(!isTableVisible);
    }
  };

  const handleButtonClick = () => {
    setSpinning(true);
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  const handleCancelTripClick = async () => {
    const confirmed = window.confirm(
      `Are you want to cancel ${tripData?.fromAddress[0]?.long_name} to ${tripData?.toAddress[0].long_name} trip?`
    );
    if (confirmed) {
      const token = localStorage.getItem("token");

      let payload = {
        emulatorId: connectedEmulator?.id,
        cancelTrip: true,
        latitude: connectedEmulator?.latitude,
        longitude: connectedEmulator?.longitude,
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
        showToast("Trip has been cancelled", "success");
        // fetchEmulators();
        //NOTE: Don't need to refresh.. gets refreshed by SSE
      } else {
        showToast("Trip Not cancelled", "error");
      }
    }
  };

  useEffect(() => {
    if (tripData !== null && connectedEmulator !== null) {
      // leave earlier same, set show cancel true
      setShowCancel(true);
    } else {
      setShowCancel(false);
    }
  }, [tripData, connectedEmulator]);

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          flexShrink:"1",
          padding:"0",
        }}>
        {connectedEmulator && (
          <>
            {movedEmulator && movedEmulator.moveMarker === true ? (
              <button
                style={{
                  height: "40px",
                  zIndex: 2,
                  position: "absolute",
                  top: "135px",
                  right: showCancel ? 300 : 180,
                  justifyContent: "center",
                  backgroundColor: "#f44336",
                }}
                onClick={handleSetPositionCancelClick}
              >
                Cancel Set Position
              </button>
            ) :
              <button
                style={{
                  height: "40px",
                  zIndex: 2,
                  position: "absolute",
                  top: "135px",
                  right: showCancel ? 300 : 180,
                  justifyContent: "center",
                }}
                onClick={handleSetPositionClick}
              >
                Set position
              </button>
            }
            <button
              style={{
                height: "38px",
                zIndex: 2,
                position: "absolute",
                top: "135px",
                right: showCancel ? 180 : 60,
                justifyContent: "center",
              }}
              onClick={handleCreateTripButton}
            >
              Create Trip
            </button>

            {showCancel ? (
              <button
                style={{
                  height: "40px",
                  zIndex: 2,
                  position: "absolute",
                  top: "135px",
                  right: 60,
                  justifyContent: "center",
                  backgroundColor: "#f44336",
                }}
                onClick={handleCancelTripClick}
              >
                Cancel Trip
              </button>
            ) : null}
          </>
        )}
        <button
          style={{
            width: "40px",
            height: "40px",
            zIndex: 2,
            position: "absolute",
            top: "135px",
            right: 0,
            justifyContent: "center",
          }}
          onClick={handleButtonClick}
        >
          <SyncIcon
            sx={{
              width: "30px",
              height: "30px",
              transition: "transform 1s ease-in-out", // CSS transition for smooth animation
              transform: isSpinning ? "rotate(360deg)" : "", // Apply rotation based on state
            }}
          />
        </button>
      </div>
    </>
  )
};

export default MapButtons;