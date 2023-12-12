// CreateTripButton.jsx
import React, { useEffect, useState } from "react";
import SyncIcon from "@mui/icons-material/Sync";
import ApiService from "../../../ApiService";
import { EMULATOR_DRAG_URL, TRIP_URL } from "../../../constants";
import { useViewPort } from "../../../ViewportProvider.js";
import { useStates } from "../../../StateProvider.js";
import { border } from "@material-ui/system";
import { ToastContainer, toast } from "react-toastify";
import { useEmulatorStore } from "../../../stores/emulator/store.tsx";
import { compareSelectedEmulator } from "../../../stores/emulator/types_maps.tsx";

const CreateTripButton = ( ) => {
  const { width, height } = useViewPort();
  const {
    showToast,
    AssignedTelephoneNumber,
    setIsTableVisible,
    isTableVisible,
    tripData,
  } = useStates();
  
  //Initiate fetchEmulators from store
  const fetchEmulators = useEmulatorStore((state) => state.fetchEmulators);

  const selectedEmulator = useEmulatorStore(
    (state) => state.selectedEmulator,
    (oldSelectedEmulator, newSelectedEmulator) => {
      // Check if compareSelectedEmulator is working as intented (Updating emulators only on shallow change)
      const diff = compareSelectedEmulator(oldSelectedEmulator, newSelectedEmulator);
      if(diff === true) {
        console.log("selectedEmulator changed (CreateTripButton)", );
      }
      compareSelectedEmulator(oldSelectedEmulator, newSelectedEmulator)
    }
  );
  const breakpoint = 620;
  const isMobileBelowSixTwenty = width < breakpoint;
  const [isSpinning, setSpinning] = useState(false);
  const [hideCancel, setHideCancel] = useState(false);

  const handleCreateTripButton = () => {
    if (selectedEmulator === null) {
      showToast("Emulator is not selected", "error"); //Emulator is not selected error
    } else if (AssignedTelephoneNumber === null) {
      console.log("Assigned number", AssignedTelephoneNumber);
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
    const confirmed = window.confirm("Delete this trip?");
    if (confirmed) {
      const token = localStorage.getItem("token");

      let payload = {
        emulatorId: selectedEmulator?.id,
        cancelTrip: true,
        latitude: selectedEmulator?.latitude,
        longitude: selectedEmulator?.longitude,
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
        toast["success"]("Trip has been cancelled");
        fetchEmulators();
      } else {
        toast["error"]("Trip is not cancelled");
      }
    }
  };

  useEffect(() => {
    if ( tripData !== null || selectedEmulator !== null ) {
      setHideCancel(true);
    } else {
      setHideCancel(false);
    }
  }, [tripData, selectedEmulator]);

  return (
    <div
      style={
        isMobileBelowSixTwenty ?{
        display: "flex",
        justifyContent: "space-around",
        marginTop: "1rem",
      }:{
        display: "flex",
        justifyContent: "space-around",
  
      }
    }
    >
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
        onClick={handleCreateTripButton}
      >
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
              : {
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
          onClick={handleCancelTripClick}
        >
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
