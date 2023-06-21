import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../scss/login.scss";
import { USER_URL } from "../constants";

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

const PopUp = ({ showToast }) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [telephone, setTelephone] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleTelephoneChange = (e) => {
    setTelephone(e.target.value);
  };

  const handleFirstNameChange = (e) => {
    setFirstName(e.target.value);
  };

  const handleLastNameChange = (e) => {
    setLastName(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setError("Please enter your email");
    } else if (!telephone) {
      setError("Please enter your telephone number");
    } else if (!password) {
      setError("Please enter your password");
    } else if (!lastName) {
      setError("Please enter your lastName");
    } else if (!firstName) {
      setError("Please enter your firstName");
    } else {
      try {
        const { success, error } = await addUser();

        if (success) {
          console.log("User added successfully");
          handleClose();
          showToast("User Added", "success"); // Call the showToast method with two arguments
          // navigate("/home"); // Redirect to the home page
        } else {
          showToast(error || "Failed to add user", "success"); // Call the showToast method with two arguments
          setError(error || "Failed to add user"); // Display appropriate error message
        }
      } catch (error) {
        console.log("Error occurred while adding user:", error);
        setError("An error occurred while adding user"); // Display a generic error message
      }
    }
  };

  const addUser = async () => {
    const user = {
      firstName,
      lastName,
      email,
      telephone,
      password,
    };

    const token = localStorage.getItem("token");
    console.log("token : ", token);
    const response = await fetch(USER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(user),
    });
    console.log("response:", response);
    if (!response.ok || response.status !== 200) {
      return { success: false, error: "Failed to add user" };
    }

    const result = await response.json();
    console.log("result:", result);
    // Process the response as needed
    return { success: true };
  };

  return (
    <div>
      <Button onClick={handleOpen}>Add User</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box sx={{ ...style, width: 400 }}>
          <form onSubmit={handleSubmit}>
            <h1>Sign Up</h1>
            <input
              type="text"
              id="content_input"
              placeholder="Enter your first name"
              value={firstName}
              onChange={handleFirstNameChange}
            />
            <input
              type="text"
              id="content_input"
              placeholder="Enter your last name"
              value={lastName}
              onChange={handleLastNameChange}
            />
            <input
              type="password"
              id="content_input"
              placeholder="Enter your password"
              value={password}
              onChange={handlePasswordChange}
            />
            <input
              type="text"
              id="content_input"
              placeholder="Enter your email"
              value={email}
              onChange={handleEmailChange}
            />
            <input
              type="number"
              id="content_input"
              placeholder="Enter your telephone number"
              value={telephone}
              onChange={handleTelephoneChange}
            />
            <button className="login_button" type="submit">
              Add User
            </button>
            {error && <p className="error">{error}</p>}
          </form>
        </Box>
      </Modal>
    </div>
  );
};

export default PopUp;
