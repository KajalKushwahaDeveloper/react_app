import React, { useState } from "react";
import SearchBar from "./SearchBar.js";
import { CREATE_TRIP_URL } from "../../../../constants.js";
import CloseIcon from "@mui/icons-material/Close";
import ApiService from "../../../../ApiService.js";
import { Modal, Box, Typography, Button, IconButton } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";

import { useStates } from "../../../../StateProvider.js";
import { useEmulatorStore } from "../../../../stores/emulator/store.tsx";
import { compareSelectedEmulator } from "../../../../stores/emulator/types_maps.tsx";

import "../../../../scss/map.scss";
import "../../../../scss/button.scss";
import DateTimePickerValue from "./DateTimeFieldValue.tsx";
import dayjs from 'dayjs';

const CreateTripDialog = () => {
  const { isTableVisible } = useStates();
  const fetchEmulators = useEmulatorStore((state) => state.fetchEmulators);
  const selectedEmulator = useEmulatorStore(
    (state) => state.selectedEmulator,
    (oldSelectedEmulator, newSelectedEmulator) => {
      compareSelectedEmulator(oldSelectedEmulator, newSelectedEmulator);
    }
  );

  const [fromLat, setFromLat] = useState();
  const [fromLong, setFromLong] = useState();
  const [toLat, setToLat] = useState();
  const [toLong, setToLong] = useState();
  const [fromAddress, setFromAddress] = useState();
  const [toAddress, setToAddress] = useState();
  const [inputValue, setInputValue] = useState("");

  const [dateTime, setDateTime] = React.useState(dayjs('2023-01-12T15:30'));
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { setIsTableVisible, showToast } = useStates();

  const handleClose = () => {
    setIsTableVisible(false);
  };

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleAddClick = async () => {
    if ((!fromLat && !fromLong) || (!toLat && !toLong)) {
      showToast("Please fill both locations!", "error");
      return;
    }

    setError("");

    let confirmed = false;
    if (
      selectedEmulator.startLat !== null &&
      selectedEmulator.tripStatus !== "STOP"
    ) {
      confirmed = window.confirm(
        "Creating new Trip will remove running trip for this emulator!! Continue?"
      );
    } else {
      confirmed = true;
    }
    if (confirmed) {
      setIsLoading(true);
      const payload = {
        startLat: fromLat,
        startLong: fromLong,
        endLat: toLat,
        endLong: toLong,
        fromAddress: fromAddress,
        toAddress: toAddress,
        speed: 60,
        emulatorDetailsId: selectedEmulator.id,
        arrivalTime: dateTime.unix() * 1000,
      };
      const token = localStorage.getItem("token");
      const { success, error } = await ApiService.makeApiCall(
        CREATE_TRIP_URL,
        "POST",
        payload,
        token
      );
      if (success) {
        setIsLoading(true);
        showToast("Trip Added successfully", "success");
        fetchEmulators();
        handleClose();
      } else {
        showToast(error, "error");
      }
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="gps_createTrip_overlay">
        <Modal
          open={isTableVisible}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "300px",
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
              paddingTop: "0px",
              paddingLeft: "0px",
              paddingRight: "0px",
              paddingBottom: "1rem",
              zIndex: "0px !important",
            }}
          >
            <IconButton
              edge="end"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
              sx={{
                position: "absolute",
                top: 0,
                right: 10,
                color: "white",
              }}
            >
              <CloseIcon />
            </IconButton>
            <Typography
              variant="h6"
              component="h2"
              style={{
                paddingBottom: "10px",
                backgroundColor: "#007dc6",
                color: "white",
              }}
            >
              Create Trip
            </Typography>
            <div style={{ margin: "1rem 0" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <div style={{ flex: 1 }}>
                  <SearchBar
                    setLat={setFromLat}
                    setLong={setFromLong}
                    setAddress={setFromAddress}
                    inputValue={inputValue}
                    setInputValue={setInputValue}
                    handleInputChange={handleInputChange}
                    label="From Address"
                  />
                </div>
                <div style={{ margin: "1rem 0" }}>
                  <SearchBar
                    setLat={setToLat}
                    setLong={setToLong}
                    setAddress={setToAddress}
                    inputValue={inputValue}
                    setInputValue={setInputValue}
                    handleInputChange={handleInputChange}
                    label="To Address"
                  />
                  {error && <p className="error">{error}</p>}
                </div>
                <div style={{ margin: "1rem 0" }}>
                  <DateTimePickerValue value={dateTime} setValue={setDateTime}/>
                  {error && <p className="error">{error}</p>}
                </div>
                <div style={{ margin: "1rem 0" }}>
                  <Button
                    onClick={handleAddClick}
                    style={{
                      cursor: "pointer",
                      width: "auto",
                      textAlign: "center",
                      float: "right",
                      backgroundColor: "#1976d2",
                      color: "white",
                      marginRight: "0.7rem",
                    }}
                    disabled={isLoading ? true : false}
                  >
                    Add
                  </Button>
                  {error && <p className="error">{error}</p>}
                </div>

                <div style={{ margin: "0" }}>
                  {isLoading ? (
                    <CircularProgress color="primary" />
                  ) : (
                    ""
                  )}
                </div>
              </div>

            </div>
          </Box>
        </Modal>
      </div>
    </>
  );
};

export default CreateTripDialog;
