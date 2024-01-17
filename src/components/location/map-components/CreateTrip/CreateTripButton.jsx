import React, { useEffect, useState } from "react";
import SyncIcon from "@mui/icons-material/Sync";
import ApiService from "../../../../ApiService.js";
import { EMULATOR_DRAG_URL } from "../../../../constants.js";
import { useViewPort } from "../../../../ViewportProvider.js";
import { useStates } from "../../../../StateProvider.js";
import { useEmulatorStore } from "../../../../stores/emulator/store.tsx";
import { compareSelectedEmulator } from "../../../../stores/emulator/types_maps.tsx";

const CreateTripButton = () => {
  const { width } = useViewPort();
  const { showToast, setIsTableVisible, isTableVisible } = useStates();

  //Initiate fetchEmulators from store
  const fetchEmulators = useEmulatorStore((state) => state.fetchEmulators);
  const storetripData = useEmulatorStore((state) => state.tripData);
  const selectedEmulator = useEmulatorStore(
    (state) => state.selectedEmulator,
    (oldSelectedEmulator, newSelectedEmulator) => {
      compareSelectedEmulator(oldSelectedEmulator, newSelectedEmulator);
    }
  );
  const breakpoint = 620;
  const breakpointTab = 992;
  const isMobileBelowSixTwenty = width < breakpoint;
  const isTabBreakpoint = width < breakpointTab;
  const [isSpinning, setSpinning] = useState();
  const [hideCancel, setHideCancel] = useState(false);

  const handleCreateTripButton = () => {
    if (selectedEmulator === null) {
      showToast("Emulator is not selected", "error"); //Emulator is not selected error
    } else if (selectedEmulator.AssignedTelephoneNumber === null) {
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
      `Are you want to cancel ${storetripData?.fromAddress[0]?.long_name} to ${storetripData?.toAddress[0].long_name} trip?`
    );
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
        showToast("Trip has been cancelled", "success");
        fetchEmulators();
      } else {
        showToast("Trip Not cancelled", "error");
      }
    }
  };

  useEffect(() => {
    if (storetripData !== null && selectedEmulator !== null) {
      setHideCancel(true);
    } else {
      setHideCancel(false);
    }
  }, [storetripData, selectedEmulator]);

  return (
    <div
      style={
        isMobileBelowSixTwenty
          ? {
              display: "flex",
              justifyContent: "space-around",
              margin: ".5rem 0",
            }
          : {
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
            : isTabBreakpoint
            ? {
                height: "38px",
                zIndex: 2,
                position: "absolute",
                top: "155px",
                right: !hideCancel ? 110 : 230,
                padding: ".65rem",
                display: "flex",
                alignItems: "center",
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
              : isTabBreakpoint
              ? {
                  height: "38px",
                  zIndex: 2,
                  position: "absolute",
                  top: "155px",
                  right: 110,
                  padding: ".65rem",
                  display: "flex",
                  alignItems: "center",
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
            : isTabBreakpoint
            ? {
                height: "38px",
                zIndex: 2,
                position: "absolute",
                top: "155px",
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