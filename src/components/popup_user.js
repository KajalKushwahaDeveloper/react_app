import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../scss/login.scss";
import IconButton from "@mui/material/IconButton";
import ClearIcon from "@mui/icons-material/Clear";
import { USER_URL } from "../constants";
import ApiService from "../ApiService";
import { useForm } from "react-hook-form";
import PhoneInput from "react-phone-number-input";
import 'react-phone-number-input/style.css'

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
  const [password, setEditPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState("");
  const [teleError, setTeleError] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    resetField,
    formState: { errors },
  } = useForm()


  console.log("userToEdit1234:", userToEdit);
  useEffect(() => {
    if (userToEdit) {
      setValue("firstname", userToEdit.firstName);
    setValue("lastname",userToEdit.lastName);
    setValue("email", userToEdit.email);
    setTelephone(userToEdit.telephone);
      setId(userToEdit.id);
      // setEmail(userToEdit.email);
      // setTelephone(userToEdit.telephone);
      // setFirstName(userToEdit.firstName);
      // setLastName(userToEdit.lastName);
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

  const handleEditPassword = (e) => {
    setEditPassword(e.target.value);
  };

  const handleSubmitData = async (e) => {
    // e.preventDefault();
    console.log(e);

    // if (!email) {
    //   setError("Please enter your email");
    // } else if (!telephone) {
    //   setError("Please enter your telephone number");
    // } else if (!lastName) {
    //   setError("Please enter your lastName");
    // } else if (!firstName) {
    //   setError("Please enter your firstName");
    // } else {

    if(!telephone)
    {
      setTeleError("Please enter your telephone number");
    }
    // else if(telephone.length > 10)
    // {
    //   setTeleError("Only 10 digits are allowed!")
    // }
    // else if(telephone.length < 10)
    // {
    //   setError("Minimum 10 digits!")
    // }
    else{
      try {
        console.log("User Add/Edit triggered : " + userToEdit);
        const { success, error } = await addOrUpdate(e);
        if (success) {
          if (userToEdit != null) {
            handleClose(userToEdit?.id, null);
          } else {
            handleClose(0, null);
          }
          if (userToEdit) {
            showToast("User Updated", "success"); // Call the showToast method with two arguments
          } else {
            showToast("User Added", "success"); // Call the showToast method with two arguments
          }
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

  const addOrUpdate = async (event) => {
    
    const user = {
      id,
      firstName: event.firstname,
      lastName: event.lastname,
      email: event.email,
      telephone: telephone,
      password,
    };

    const token = localStorage.getItem("token");
    console.log("token : ", token);
    try {
      var requestType = "POST"
      if (userToEdit) {
        requestType = "PUT"
      }
      const { success, data, error } = await ApiService.makeApiCall(
        USER_URL,
        requestType,
        user,
        token
      );
      if (success) {
        console.log("addUser response:", data);
        return { success: true};
      }else {
        return { success: false, error: error };
      }
    } catch (e) {
      console.log("addUser Failed to add/update user:", e);
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
              id="content_input"
              name="firstname"
              placeholder="Enter your first name"
              // value={firstName}
              // onChange={handleFirstNameChange}
              {...register("firstname", { required: {
                value: true,
                message: "Firstname is required!"
              },
            pattern: {
              value: /^[A-Z]+$/i,
              message: 'Only alphabets allowed!'
            }
            
            })}
            />
              {errors.firstname && <p className="ms-4 mb-1" style={{fontSize: 14, color: 'red'}}>{errors.firstname.message}</p>}
            <input
              type="text"
              id="content_input"
              name="lastname"
              placeholder="Enter your last name"
              // value={lastName}
              // onChange={handleLastNameChange}

              {...register("lastname", { required: {
                value: true,
                message: "Lastname is required!"
              },
            pattern: {
              value: /^[A-Z]+$/i,
              message: 'Only alphabets allowed!'
            }
          })}
            />
               {errors.lastname && <p className="ms-4 mb-1" style={{fontSize: 14, color: 'red'}}>{errors.lastname.message}</p>}
            <input
              type="text"
              id="content_input"
              name="email"
              placeholder="Enter your email"
              // value={email}
              // onChange={handleEmailChange}

              {...register("email", { required: {
                value: true,
                message: "Email is required!"
              },
            pattern: {
              value: /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/,
              message: 'Please correct email format!'
            }
          })}
            />
              {errors.email && <p className="ms-4 mb-1" style={{fontSize: 14, color: 'red'}}>{errors.email.message}</p>}
            {/* <input
              type="text"
              id="content_input"
              name="telephone"
              placeholder="Enter your telephone number"
              // value={telephone}
              // onChange={handleTelephoneChange}

              {...register("telephone", { required: {
                value: true,
                message: "Telephone is required!"
              },
            pattern: {
              value: /^\+[1-9]\d{1,14}$/,
              message: 'Only required format allowed!'
            },

          })}
            /> */}

<PhoneInput
  international
  // name="telephone"
  countryCallingCodeEditable={false}
  defaultCountry="US"
  value={telephone}
  limitMaxLength={10}
//   {...register("telephone", { required: {
//     value: true,
//     message: "Telephone is required!"
//   }

// })}
  onChange={setTelephone}
  />
             {teleError && <p className="ms-4 mb-1" style={{fontSize: 14, color: 'red'}}>{teleError}</p>}
            {userToEdit && (
              <input
                type="password"
                id="content_input"
                placeholder="password (empty if unchanged)"
                value={password}
                onChange={handleEditPassword}
              />
            )}
            <button className="login_button" type="submit">
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
