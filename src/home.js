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
import Download_Apk from "./components/download_apk.js";
import PopUpUser from "./components/popup_user.js";
import PopUpAssignUser from "./components/popup_assign_user.js";

const Home = () => {
  const [emulator, setEmulator] = useState();
  const [emulatorValue, setEmulatorValue] = useState("");
  const [visibleForm, setVisibleForm] = useState(false);
  const [fcmToken, setFcmToken] = useState("");

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
    setUserAssingedEmulator(data)
    setEmulatorToAssignUser(null);
    setOpenUserAssignPopup(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        console.log("token : ", token);
        const response = await axios.get(EMULATOR_URL, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        // console.log(response.data); // Handle the response data here
        setEmulator(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <ToastContainer style={{ zIndex: 3 }} />
      <Navbar />
      <div className="home_div">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            padding: "0rem 1rem",
          }}
        >
          <Download_Apk />
          <EmulatorTable
            showToast={showToast}
            handleAssignUserButtonClick={handleAssignUserButtonClick}
            userAssingedEmulator={userAssingedEmulator}
          />
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <Button
            className="login_button"
            style={{ padding:"1rem",  margin: "1rem" }}
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
          <PopUpAssignUser
            showToast={showToast}
            handleClose={handleClose}
            open={openUserAssignPopup}
            emulatorToAssignUser={emulatorToAssignUser}
            handleAssignedUserToEmulator={handleAssignedUserToEmulator}
          />
          <UserTable
            showToast={showToast}
            handleEditButtonClick={handleEditButtonClick}
            editedId={editedId}
          />
        </div>
      </div>
    </>
  );
};

export default Home;
