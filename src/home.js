import React, { useEffect, useState } from "react";
import Navbar from "./components/navbar.js";
import axios from "axios";
import "./scss/home.scss";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CLIENT_CURRENT, EMULATOR_CREATE_RANDOM_URL, EMULATOR_URL } from "./constants.js";
import EmulatorTable from "./components/emulator_table.js";
import UserTable from "./components/user_table.js";
import { Button } from "@mui/material";
import DownloadApk from "./components/download_apk.js";
import PopUpUser from "./components/popup_user.js";
import PopUpAssignUser from "./components/popup_assign_user.js";
import PopUpEmulatorTelephone from "./components/popup_emulator_update_telephone.js";
import GeneratedIdPopup from "./components/generated_id_popup.js";
import ApiService from "./ApiService.js";

const Home = () => {
  const [openUserPopup, setOpenUserPopup] = useState(false);
  const [openEmulatorPopup, setOpenEmulatorPopup] = useState(false);
  const [openUserAssignPopup, setOpenUserAssignPopup] = useState(false);
  const [openGeneratedIdPopup, setOpenGeneratedIdPopup] = useState(false);
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

  const handleCreateEmulator =  async() => {
    showToast("Creating Emulator","info")
    const { success, data, error } = await ApiService.makeApiCall(
      EMULATOR_CREATE_RANDOM_URL,
      "POST",
      null,
      null
    );
    if (success) {
      showToast(" Emulator Created ","success")
    } else {
      showToast(" Failed to create Emulator ","error")
    }
  };

  const handleClose = (userEditedId, emulatorEditedId) => {
    setOpenUserPopup(false);
    setUserToEdit(null);
    setOpenUserAssignPopup(false);
    setEmulatorToAssignUser(null);
    setOpenEmulatorPopup(false);
    setOpenGeneratedIdPopup(false);
    if (userEditedId != null && !isNaN(+userEditedId))
      setUserEditedId(userEditedId);
    if (emulatorEditedId != null && !isNaN(+emulatorEditedId))
      setEmulatorEditedId(emulatorEditedId);
  };

  //Edit PHONE NUMBER button click
  const handleEditButtonClick = (data) => {
    console.log("IconButton clicked with data:", data);
    setUserToEdit(data);
    setOpenUserPopup(true);
  };

  //emulator generated id button click
  const handleGeneratedIdButtonClick = (data) => {
    console.log("IconButton clicked with data:", data);
    setUserToEdit(data);
    setOpenGeneratedIdPopup(true);
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
        <div
          className="emulator_table"
          style={{
            display: "flex",
            flexDirection: "column",
            padding: "0rem 1rem",
            marginTop: "0.5rem",
          }}
        >
          <GeneratedIdPopup />
          <DownloadApk />

          <Button
            style={{
              width: "15rem",
              background: "#007dc6",
              color: "white",
              marginBottom: "1rem",
            }}
            onClick={handleCreateEmulator}
          >
            Create Emulator
          </Button>

          <EmulatorTable
            showToast={showToast}
            handleAssignUserButtonClick={handleAssignUserButtonClick}
            userAssingedEmulator={userAssingedEmulator}
            setUserAssingedEmulator={setUserAssingedEmulator}
            handleEmulatorTelephonePopup={handleEmulatorTelephonePopup}
            emulatorEditedId={emulatorEditedId}
            handleGeneratedIdButtonClick={handleGeneratedIdButtonClick}
          />
        </div>
        <div
          className="user_table"
          style={{
            display: "flex",
            flexDirection: "column",
            marginBottom: "9rem",
          }}
        >
          <Button
            style={{
              width: "9rem",
              background: "#007dc6",
              color: "white",
              marginBottom: "1rem",
            }}
            onClick={handleOpen}
          >
            Add User
          </Button>

          {/* emulator user popup */}
          <PopUpUser
            showToast={showToast}
            handleClose={handleClose}
            open={openUserPopup}
            userToEdit={userToEdit}
          />

          {/* emulator telephone number edit popup */}
          <PopUpEmulatorTelephone
            showToast={showToast}
            handleClose={handleClose}
            open={openEmulatorPopup}
            userToEdit={userToEdit}
          />

          {/*  emulator generated id */}
          <GeneratedIdPopup
           showToast={showToast}
           open={openGeneratedIdPopup}
           close={handleClose}
          />

          {/* assign user popup */}
          <PopUpAssignUser
            showToast={showToast}
            close={handleClose}
            open={openUserAssignPopup}
            emulatorToAssignUser={emulatorToAssignUser}
            handleAssignedUserToEmulator={handleAssignedUserToEmulator}
          />

          {/* user table */}
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
