import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import React, { useState } from "react";
import PopupEmulatorHistoryTable from "./popup_emulator_history_table";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: "-3px -3px 7px #97949473, 2px 2px 7px rgb(137, 138, 138)",
  pt: 2,
  px: 2,
  pb: 2,
};

const mobileStyle = {
  width: "90%",
  maxWidth: "90vw", // Adjust the maximum width for smaller screens
};

const PopUpEmulatorHistory = ({ showToast, handleClose, open, emulatorHistory }) => {
  const handleSubmit = async (e) => {
    e.preventDefault();
    handleClose(0);
  };

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box
          sx={{
            ...style,
            width: "auto",
            height: "auto",
            ...mobileStyle, // Apply mobile styles
          }}
        >
          <h3>HISTORY</h3>
          {/* Ensure that PopupEmulatorHistoryTable is properly set inside the Box */}
          <PopupEmulatorHistoryTable data={emulatorHistory} showToast={showToast} />
          <button
            className="login_button"
            type="button"
            style={{ height: "40px" }}
            onClick={(e) => handleSubmit(e)}
          >
            CLOSE
          </button>
        </Box>
      </Modal>
    </div>
  );
};

export default PopUpEmulatorHistory;
