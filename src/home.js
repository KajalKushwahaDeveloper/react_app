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

const Home = () => {
  const [openUserPopup, setOpenUserPopup] = useState(false);
  const [openUserAssignPopup, setOpenUserAssignPopup] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);
  const [emulatorToAssignUser, setEmulatorToAssignUser] = useState(null);
  const [userAssingedEmulator, setUserAssingedEmulator] = useState(null);
  const [editedId, setEditedId] = useState(null);

  const showToast = (message, type) => {
    console.log("Showing toast...");
    toast[type](message); // Use the 'type' argument to determine the toast type
  };

  const handleOpen = () => {
    setOpenUserPopup(true);
    setUserToEdit(null);
  };

  const handleClose = (id) => {
    setOpenUserPopup(false);
    setUserToEdit(null);
    setOpenUserAssignPopup(false);
    setEmulatorToAssignUser(null);
    if (id != null && !isNaN(+id)) setEditedId(id);
  };

  const handleEditButtonClick = (data) => {
    console.log("IconButton clicked with data:", data);
    setUserToEdit(data);
    setOpenUserPopup(true);
  };

  const handleAssignUserButtonClick = (data) => {
    console.log("Assign Button clicked with data:", data);
    setEmulatorToAssignUser(data);
    setOpenUserAssignPopup(true);
  };

  const handleAssignedUserToEmulator = (success, error, data) => {
    console.log("assignedUserToEmulator with data:", data);
    setUserAssingedEmulator(data);
    setEmulatorToAssignUser(null);
    setOpenUserAssignPopup(false);
  };

  return (
    <>
      <ToastContainer style={{ zIndex: 4 }} />
      <section className="dashboard">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-6">
              <DownloadApk />
              <EmulatorTable
                showToast={showToast}
                handleAssignUserButtonClick={handleAssignUserButtonClick}
                userAssingedEmulator={userAssingedEmulator}
                setUserAssingedEmulator={setUserAssingedEmulator}
              />
            </div>
            <div className="col-lg-6 mt-4 mt-lg-0">
              <div className="mb-5">
                <button className="btn btn-green mb-4" onClick={handleOpen}>
                  Add User
                </button>
                <PopUpUser
                  showToast={showToast}
                  handleClose={handleClose}
                  open={openUserPopup}
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
                  editedId={editedId}
                  userAssingedEmulator={userAssingedEmulator}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* <ToastContainer style={{ zIndex: 3 }} /> */}
    </>
  );
};

export default Home;
