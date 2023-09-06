import React, { useState } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import ApiService from "../../../ApiService";
import { FORGOT_PASSWORD } from "../../../constants";

const ForgotPasswordModal = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [resetSuccess, setResetSuccess] = useState(null);
  const [responseError, setResponseError] = useState(null);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEmailError("");

    if (!email) {
      setEmailError("Please enter your email address.");
    } else {
      try {
        const { success, data, error } = await ApiService.makeApiCall(
          FORGOT_PASSWORD,
          "GET",
          null,
          null,
          email
        );
        if (success) {
          const token = data.token;
          localStorage.setItem("token", token);
          console.log("Sent reset password mail successful");
          setResetSuccess("Sent reset password mail successful")
        } else {
          setResponseError(error || "Invalid Email"); // Display appropriate error message
        }
      } catch (error) {
        console.log("Error occurred during login:", error);
        setResponseError("An error occurred during login"); // Display a generic error message
      }
    }
  };

  return (
    <Modal
      open={isOpen}
      // onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        sx={{
          paddingTop:"15px",
          position: "absolute",
          width: 400,
          bgcolor: "background.paper",
          border: "2px solid #000",
          boxShadow: 24,
          p: 4,
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <span className="close" onClick={onClose} style={{float:"right",marginTop:".5rem",height:"2rem",width:"2rem",cursor:"pointer"}}>
          &times;
        </span>
        <Typography id="modal-modal-title" variant="h6" component="h2" style={{paddingTop:"5px"}}>
          Forgot Password
        </Typography>
        {resetSuccess ? (
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Password reset instructions have been sent to your email address.
          </Typography>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group" style={{paddingTop:"40px"}}>
              <label htmlFor="email">Email Address:</label>
              <input style={{marginTop:"20px",marginBottom:"20px",marginLeft:"0px",marginRight:"0px"}}
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={handleEmailChange}
                className="form-control"
              />
              {emailError && <p className="error">{emailError}</p>}
              {responseError && <p className="error">{responseError}</p>}
            </div>
            <Button type="submit" variant="contained" color="primary" style={{marginTop: "30px", float: "right"}}>
              Reset Password
            </Button>
          </form>
        )}
      </Box>
    </Modal>
  );
};

export default ForgotPasswordModal;
