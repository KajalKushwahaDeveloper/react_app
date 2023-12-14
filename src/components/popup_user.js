import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import React, { useState, useEffect } from "react";
import "../scss/login.scss";
import IconButton from "@mui/material/IconButton";
import ClearIcon from "@mui/icons-material/Clear";
import { USER_URL } from "../constants";
import ApiService from "../ApiService";
import PhoneInputWithCountry from "react-phone-number-input/react-hook-form"
import "react-phone-number-input/style.css";

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
  setValue,
  reset,
  resetField,
  register,
  handleSubmit,
  errors,
  control
}) => {

  const [id, setId] = useState("");
  const [password, setEditPassword] = useState("");
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    
    if (userToEdit) {
      setValue("firstname", userToEdit.firstName);
      setValue("lastname", userToEdit.lastName);
      setValue("email", userToEdit.email);
      setValue("telephone", userToEdit.telephone);
      setId(userToEdit.id);
    }
    else
    {
      reset();
      resetField();
    }
  }, [userToEdit]);

  const handleEditPassword = (e) => {
    setEditPassword(e.target.value);
  };

  const handleSubmitData = async (data) => {
      try {
        const { success, error } = await addOrUpdate(data);
        if (success) {
          if (userToEdit != null) {
            reset();
            resetField();
            handleClose(userToEdit?.id, null);
          } else {
            handleClose(0, null);
            
          }
          if (userToEdit) {
            showToast("User Updated", "success"); // Call the showToast method with two arguments
            reset();
          } else {
            reset();
            showToast("User Added", "success"); // Call the showToast method with two arguments
          }
          // navigate("/home"); // Redirect to the home page
        } else {  
          reset();
          resetField();
          handleClose(0, null);
          
          showToast(error || "Failed to add user", "error"); // Call the showToast method with two arguments
          setError(error || "Failed to add user"); // Display appropriate error message
        }
      } catch (error) {
        setError("An error occurred while adding user"); // Display a generic error message
      }
    // }
  };

  const addOrUpdate = async (data) => {
    const user = {
      id: id,
      firstName: data.firstname,
      lastName: data.lastname,
      email: data.email,
      telephone: data.telephone,
      password: password,
    };
    

    try {
      var requestType = "POST";
      if (userToEdit) {
        requestType = "PUT";
      }
      const { success, data, error } = await ApiService.makeApiCall(
        USER_URL,
        requestType,
        user,
        token
      );
      if (success) {
        return { success: true };
      } else {
        return { success: false, error: error };
      }
    } catch (e) {
      showToast(`Failed to add/update User ${e}`, "error");
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
          <form onSubmit={handleSubmit(handleSubmitData)}>
            <h1
              style={{
                marginBottom: "3rem",
                fontSize: "1.5rem",
                fontWeight: "600",
              }}
            >
              {userToEdit === null ? "Add User" : "Edit User"}
            </h1>

            <input
              type="text"
              id="firstname"
              name="firstname"
              placeholder="Enter your first name"
              {...register("firstname", {
                required: {
                  value: true,
                  message: "Firstname is required!",
                },
                pattern: {
                  value: /^[A-Z]+$/i,
                  message: "Only alphabets allowed!",
                },
              })}
            />
            {errors.firstname && (
              <p className="ms-4 mb-1" style={{ fontSize: 14, color: "red" }}>
                {errors.firstname.message}
              </p>
            )}
            <input
              type="text"
              id="lastname"
              name="lastname"
              placeholder="Enter your last name"
              {...register("lastname", {
                required: {
                  value: true,
                  message: "Lastname is required!",
                },
                pattern: {
                  value: /^[A-Z]+$/i,
                  message: "Only alphabets allowed!",
                },
              })}
            />
            {errors.lastname && (
              <p className="ms-4 mb-1" style={{ fontSize: 14, color: "red" }}>
                {errors.lastname.message}
              </p>
            )}
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              {...register("email", {
                required: {
                  value: true,
                  message: "Email is required!",
                },
                pattern: {
                  value: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                  message: "Please correct email format!",
                },
              })}
            />
            {errors.email && (
              <p className="ms-4 mb-1" style={{ fontSize: 14, color: "red" }}>
                {errors.email.message}
              </p>
            )}

            <PhoneInputWithCountry
            name="telephone"
            id="telephone"
            control={control}
              international
              countryCallingCodeEditable={false}
              defaultCountry="US"
              limitMaxLength={10}
              rules={{ required: {
                value: true,
                message: "Telephone is required!",
              }}}
            />
            
            {errors.telephone && (
              <p className="ms-4 mb-1" style={{ fontSize: 14, color: "red" }}>
                {errors.telephone.message}
              </p>
            )}
            {userToEdit && (
              <input
                type="password"
                id="password"
                placeholder="password (empty if unchanged)"
                value={password}
                onChange={handleEditPassword}
              />
            )}
            <button className="login_button" type="submit">
              {userToEdit === null ? "Add User" : "Edit User"}
            </button>
            {/* {error && <p className="error">{error}</p>} */}
          </form>
        </Box>
      </Modal>
    </div>
  );
};

export default PopUpUser;
