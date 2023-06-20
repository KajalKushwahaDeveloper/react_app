import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../scss/login.scss";


const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow:  "-3px -3px 7px #97949473, 2px 2px 7px rgb(137, 138, 138)",
  pt: 2,
  px: 4,
  pb: 3,
};



const PopUp = () => {
    const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [date, setDate] = useState("");
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

  const handleMobileChange = (e) => {
    setMobile(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
 
    if (!email) {
      setEmail("Please enter your email");
    } else if (!mobile) {
      setMobile("Please enter your mobile number");
    } else {
      try {
        const { success, error } = await userLogin();
  
        if (success) {
          console.log("Login successful");
          navigate("/home"); // Redirect to the home page
        } else {
          setResponseError(error || "Invalid credentials"); // Display appropriate error message
        }
      } catch (error) {
        console.log("Error occurred during login:", error);
        setResponseError("An error occurred during login"); // Display a generic error message
      }
    }
  };
  
  const userLogin = async () => {
    const item = { email, password };
  
    

const API = "http://64.226.101.239:8080/admin/log-in"; // LIVE API server URL
// const API = "http://192.168.1.123:8080/admin/log-in"; // LOCAL API server URL

    try {
      const response = await fetch(API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(item),
      });
  
      if (!response.ok || response.status !== 200) {
        return { success: false, error: "Invalid credentials" };
      }
  
      const result = await response.json();
      const token = result.token;
      // const token = "TOKEN";
      localStorage.setItem("token", token);
      return { success: true };
    } catch (error) {
      console.error("Error occurred during login:", error);
      throw error; // Rethrow the error to be caught by the caller (handleSubmit)
    }
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
                  <h1>SignUp</h1>
                  <input
                    type="text"
                    id="content_input"
                    name="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={handleEmailChange}
                  />
            
                  <input
                    type="number"
                    id="content_input"
                    name="mobile"
                    placeholder="Enter your password"
                    value={mobile}
                    onChange={handleMobileChange}
                  />
                   <input
                    type="date"
                    id="content_input"
                    name="date"
                    placeholder="Enter your Registration date"
                    value={date}
                    onChange={handleDateChange}
                  />
               
                  <button className="login_button" type="submit">
                    Login
                  </button>
                  {error && <p className="error">{error}</p>}
                  <a href="#">Sign In?</a>
                </form>
        
        </Box>
      </Modal>
    </div>
  );
}
export default PopUp;