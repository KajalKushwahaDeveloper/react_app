import React, { useState, useEffect } from "react";
import SearchBar from "../SearchBar.js";
import { CREATE_TRIP_URL } from "../../../constants.js";
import CloseIcon from "@mui/icons-material/Close";
import ApiService from "../../../ApiService.js";
import { Modal, Box, Typography, Button, IconButton } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";

import "../../../scss/button.scss";
import { useStates } from "../../../StateProvider.js";

const CreateTripTable = ({
  showToast,
  setIsTableVisible,
}) => {
  const [fromLat, setFromLat] = useState();
  const [fromLong, setFromLong] = useState();
  const [toLat, setToLat] = useState();
  const [toLong, setToLong] = useState();
  const [fromAddress, setFromAddress] = useState();
  const [toAddress, setToAddress] = useState();
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState("");
  const [open, setOpen] = useState(true); // Automatically open the modal
  const [isLoading, setIsLoading] = useState(false);
  const { setSelectedEmId, selectedEmId, selectedEmulator } = useStates();

  const handleClose = () => {
    setIsTableVisible(false);
    setOpen(false);
  };

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleAddClick = async () => {
 
    if ((!fromLat && !fromLong) || (!toLat && !toLong)) {
      setError("Please fill both locations.");
      return;
    }

    setError("");


    const token = localStorage.getItem("token");
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
        emulatorDetailsId: selectedEmId,
      };

      const { success, data, error } = await ApiService.makeApiCall(
        CREATE_TRIP_URL,
        "POST",
        payload,
        token
      );
      if (success) {
        console.log("data : ", selectedEmulator);
        console.log("data : ", selectedEmId);
        console.log("data : ", data.emulatorDetailsId);
        setIsLoading(true);
        showToast("Added successfully", "success");
        setSelectedEmId(null);
        setSelectedEmId(data.emulatorDetailsId);
      } else {
        showToast(error, "error");
      }
setIsLoading(false);
      handleClose();
    }
  };

  return (
    <>
      <Modal
        open={open}
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
                />
              </div>
              {isLoading ? (
                <div style={{ position: "absolute", top: "40%" }}>
                  <CircularProgress color="primary" />
                </div>
              ) : (
                ""
              )}
              <div style={{ margin: "1rem 0" }}>
                <SearchBar
                  setLat={setToLat}
                  setLong={setToLong}
                  setAddress={setToAddress}
                  inputValue={inputValue}
                  setInputValue={setInputValue}
                  handleInputChange={handleInputChange}
                />
                {error && <p className="error">{error}</p>}
              </div>
            </div>
          </div>
          <div style={{display: 'flex', justifyContent: 'center'}}>

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
            disabled={isLoading ? true: false}
          >
            Add
          </Button>
          
          </div>
        </Box>
      </Modal>
    </>
  );
};

export default CreateTripTable;
