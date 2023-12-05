import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import React, { useState, useEffect } from "react";
import IconButton from "@mui/material/IconButton";
import ClearIcon from "@mui/icons-material/Clear";
import "../scss/login.scss";
import { EMULATOR_TELEPHONE_UPDATE_URL } from "../constants";
import DropDown from "./dropDown";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: "-3px -3px 7px #97949473, 2px 2px 7px rgb(137, 138, 138)",
  pt: 2,
  px: 4,
  pb: 3,
};

const PopUpEmulatorTelephone = ({
  showToast,
  handleClose,
  open,
  userToEdit,
}) => {
  const [id, setId] = useState("");
  const [twilioNumber, setTwilioUpdatedPhone] = useState("");
  const [alternateNumber, setAlternateNumber] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (userToEdit) {
      setAlternateNumber(userToEdit.alternateTelephone);
      setId(userToEdit.id);
      console.log("userToEdit::", userToEdit);
    }
  }, [userToEdit]);
  console.log("twilioUpdatedPhone", twilioNumber);


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { success, error } = await addUser();

      if (success) {
        console.log("Telephone Number added successfully");
        if (userToEdit != null) {
          handleClose(null, userToEdit?.id);
        } else {
          handleClose(null, 0);
        }
        showToast("Telephone Number Added", "success");
      } else {
        showToast(error || "Failed to add Telephone Number", "error");
        setError(error || "Failed to add Telephone Number");
      }
    } catch (error) {
      console.log("Error occurred while adding Telephone Number:", error);
      setError("An error occurred while adding Telephone Number");
    }
  };

  const addUser = async () => {
    const user = {  
      id:id,
      telephone:twilioNumber,
      alternateTelephone:alternateNumber,
    };

    const token = localStorage.getItem("token");
    console.log("token : ", token);
    try {
      const response = await fetch(EMULATOR_TELEPHONE_UPDATE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(user),
      });
      console.log("addUser response:", response);
      if (!response.ok || response.status !== 200) {
        const text = await response.text();
        console.error("addUser error:", text);
        return { success: false, error: text };
      }
      return { success: true };
    } catch (e) {
      showToast(`Failed to unassign user ${e}`, "error");
      return { success: false, error: e };
    }
  };

  return (
    <div>
      <Modal
        open={open}
        userToEdit={userToEdit}
        onClose={handleClose}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box sx={{ ...style, width: 400 }}>
          <IconButton
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              zIndex: 1,
            }}
            onClick={handleClose}
          >
            <ClearIcon />
          </IconButton>
          <form onSubmit={handleSubmit}>
            <h1 style={{ marginBottom: "2rem" ,fontSize:"1.5rem", fontWeight:"600"}}> Assign Phone Number</h1>

            <DropDown 
              setTwilioUpdatedPhone = {setTwilioUpdatedPhone} 
              alternateNumber = {alternateNumber}
              setAlternateNumber = {setAlternateNumber}
            />

            <button type="submit" style={{width:"6rem",float:"right",marginRight:"0px",padding:".5rem 0"}}>
              Add
            </button>
            {error && <p className="error">{error}</p>}
          </form>
        </Box>
      </Modal>
    </div>
  );
};

export default PopUpEmulatorTelephone;
