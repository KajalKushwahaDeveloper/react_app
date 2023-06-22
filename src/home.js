import React, { useEffect, useState } from "react";
import Navbar from "./components/navbar.js";
import axios from "axios";
import "./scss/home.scss";
import PopUp from "./components/popup.js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { EMULATOR_URL } from "./constants.js";
import EmulatorTable from "./components/emulator_table.js";
import UserTable from "./components/user_table.js";
import Button from "@mui/material/Button";

const Home = () => {
  const [emulator, setEmulator] = useState();
  const [emulatorValue, setEmulatorValue] = useState("");
  const [visibleForm, setVisibleForm] = useState(false);
  const [fcmToken, setFcmToken] = useState("");

  const [open, setOpen] = useState(false, null);
  const [userToEdit, setUserToEdit] = useState(null);
  const [editedId, setEditedId] = useState(null);

  const showToast = (message, type) => {
    console.log("Showing toast...");
    toast[type](message); // Use the 'type' argument to determine the toast type
  };

  const handleOpen = () => {
    setOpen(true);
    setUserToEdit(null);
  };

  const handleClose = (id) => {
    setOpen(false);
    setUserToEdit(null);
    if(id!=null && !isNaN(+id))
    setEditedId(id);
  };
  
  const handleEditButtonClick = (data) => {
    console.log('IconButton clicked with data:', data);
    setUserToEdit(data);
    setOpen(true);
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
    <ToastContainer style={{zIndex:3}}/>
      <Navbar />
      <div className="home_div">
          <div>
            <EmulatorTable showToast={showToast} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <Button className="login_button" style={{width:'auto', margin:'1rem'}} onClick={handleOpen}>Add User</Button>
            <PopUp showToast={showToast} handleOpen={handleOpen} handleClose={handleClose} open={open} userToEdit = {userToEdit}/>
            <UserTable showToast={showToast} handleEditButtonClick = {handleEditButtonClick} editedId = {editedId}/>
          </div>
      </div>
    </>
  );
};

export default Home;
