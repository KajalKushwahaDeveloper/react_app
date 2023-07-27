import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import React, { useState, useEffect } from "react";
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

const PopUpUser = ({
  showToast,
  handleClose,
  handleOpen,
  open,
  userToEdit,
}) => {
  const navigate = useNavigate();
  const [id, setId] = useState("");
  const [email, setEmail] = useState("");
  const [telephone, setTelephone] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (userToEdit) {
      setId(userToEdit.id);
      setEmail(userToEdit.email);
      setTelephone(userToEdit.telephone);
      setFirstName(userToEdit.firstName);
      setLastName(userToEdit.lastName);
    }
  }, [userToEdit]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setError("Please enter your email");
    } else if (!telephone) {
      setError("Please enter your telephone number");
    } else if (!lastName) {
      setError("Please enter your lastName");
    } else if (!firstName) {
      setError("Please enter your firstName");
    } else {
      try {
        const { success, error } = await addUser();

        if (success) {
          console.log("User added successfully");
          if (userToEdit != null) {
            handleClose(userToEdit?.id);
          } else {
            handleClose(0);
          }
          showToast("User Added", "success"); // Call the showToast method with two arguments
          // navigate("/home"); // Redirect to the home page
        } else {
          showToast(error || "Failed to add user", "error"); // Call the showToast method with two arguments
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
      id,
      firstName,
      lastName,
      email,
      telephone,
    };

    const token = localStorage.getItem("token");
    console.log("token : ", token);
    try {
      const response = await fetch(USER_URL, {
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
      return { success: false, error: e};
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
        <Box sx={{ ...style, maxWidth: 400, borderRadius: "15px", padding: "15px" }}>
          <form onSubmit={handleSubmit}>
            <h3>{userToEdit === null ? "Add User" : "Edit User"}</h3>
            <input
              type="text"
              id="content_input"
              placeholder="Enter your first name"
              value={firstName}
              onChange={handleFirstNameChange}
              className="form-control mt-3"
            />
            <input
              type="text"
              id="content_input"
              placeholder="Enter your last name"
              value={lastName}
              onChange={handleLastNameChange}
              className="form-control mt-3"

            />
            <input
              type="text"
              id="content_input"
              placeholder="Enter your email"
              value={email}
              onChange={handleEmailChange}
              className="form-control mt-3"

            />
            <input
              type="number"
              id="content_input"
              placeholder="Enter your telephone number"
              value={telephone}
              onChange={handleTelephoneChange}
              className="form-control mt-3"

            />
            <button className="login_button btn btn-main mt-3" type="submit">
              {userToEdit === null ? "Add User" : "Edit User"}
            </button>
            {error && <p className="error">{error}</p>}
          </form>
        </Box>
      </Modal>
    </div>
  );
};

export default PopUpUser;
