import React, { useEffect, useState } from "react";
import Navbar from "./components/navbar.js";
import axios from "axios";
import "./scss/home.scss";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { EMULATOR_URL } from "./constants.js";
import EmulatorTable from "./components/emulator_table.js";
import UserTable from "./components/user_table.js";
import { Button } from "@mui/material";
import DownloadApk from "./components/download_apk.js";
import PopUpUser from "./components/popup_user.js";
import PopUpAssignUser from "./components/popup_assign_user.js";
import PopUpEmulatorTelephone from "./components/popup_emulator_update_telephone.js";
import { ForkLeft } from "@mui/icons-material";

const Home = () => {
  const [openUserPopup, setOpenUserPopup] = useState(false);
  const [openEmulatorPopup, setOpenEmulatorPopup] = useState(false);
  const [openUserAssignPopup, setOpenUserAssignPopup] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);
  const [emulatorToAssignUser, setEmulatorToAssignUser] = useState(null);
  const [userAssingedEmulator, setUserAssingedEmulator] = useState(null);
  const [userEditedId, setUserEditedId] = useState(null);
  const [emulatorEditedId, setEmulatorEditedId] = useState(null);

  const showToast = (message, type) => {
    console.log("Showing toast...");
    toast[type](message); // Use the 'type' argument to determine the toast type
  };

  const handleOpen = () => {
    setOpenUserPopup(true);
    setUserToEdit(null);
  };

  const handleClose = (userEditedId, emulatorEditedId) => {
    setOpenUserPopup(false);
    setUserToEdit(null);
    setOpenUserAssignPopup(false);
    setEmulatorToAssignUser(null);
    setOpenEmulatorPopup(false)
    if (userEditedId != null && !isNaN(+userEditedId)) setUserEditedId(userEditedId);
    if (emulatorEditedId != null && !isNaN(+emulatorEditedId)) setEmulatorEditedId(emulatorEditedId);
  };

  //Edit button click
  const handleEditButtonClick = (data) => {
    console.log("IconButton clicked with data:", data);
    setUserToEdit(data);
    setOpenUserPopup(true);
  };

  //telephone update
  const handleEmulatorTelephonePopup = (data) => {
    console.log("IconButton clicked with data:", data);
    setUserToEdit(data);
    setOpenEmulatorPopup(true);
  };
//assign user button
  const handleAssignUserButtonClick = (data) => {
    console.log("Assign Button clicked with data:", data);
    setEmulatorToAssignUser(data);
    setOpenUserAssignPopup(true);
  };
//assign user to an emulator
  const handleAssignedUserToEmulator = (success, error, data) => {
    console.log("assignedUserToEmulator with data:", data);
    setUserAssingedEmulator(data);
    setEmulatorToAssignUser(null);
    setOpenUserAssignPopup(false);
  };

  return (
    <>
      <ToastContainer style={{ zIndex: 3 }} />

      <div className="home_div">
        <div className="emulator_table"
          style={{
            display: "flex",
            flexDirection: "column",
            padding: "0rem 1rem",
          }}
        >
          <DownloadApk />
          <EmulatorTable
            showToast={showToast}
            handleAssignUserButtonClick={handleAssignUserButtonClick}
            userAssingedEmulator={userAssingedEmulator}
            setUserAssingedEmulator={setUserAssingedEmulator}
            handleEmulatorTelephonePopup={handleEmulatorTelephonePopup}
            emulatorEditedId = {emulatorEditedId}
          />
        </div>
        <div className="user_table" style={{ display: "flex", flexDirection: "column",marginBottom:"245px" }}>
          <Button
            className="login_button"
            style={{ padding:"1rem",  margin: ".5rem" , marginLeft:"0px",marginRight:"0px",height:"45px"}}
            onClick={handleOpen}
          >
            Add User
          </Button>
          <PopUpUser
            showToast={showToast}
            handleClose={handleClose}
            open={openUserPopup}
            userToEdit={userToEdit}
          />
            <PopUpEmulatorTelephone
            showToast={showToast}
            handleClose={handleClose}
            open={openEmulatorPopup}
            userToEdit={userToEdit}
          />
          <PopUpAssignUser
            showToast={showToast}
            close={handleClose}
            open={openUserAssignPopup}
            emulatorToAssignUser={emulatorToAssignUser}
            handleAssignedUserToEmulator={handleAssignedUserToEmulator}
          />
          <UserTable
            showToast={showToast}
            handleEditButtonClick={handleEditButtonClick}
            userEditedId={userEditedId}
            userAssingedEmulator={userAssingedEmulator}
          />
        </div>
      </div>
    </>
  );
};

export default Home;
