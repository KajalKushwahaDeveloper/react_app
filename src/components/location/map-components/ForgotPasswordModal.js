import React, { useState } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import ApiService from "../../../ApiService";

const ForgotPasswordModal = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [resetSuccess, setResetSuccess] = useState(false);

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
        // Send a request to your API to initiate the password reset process
        const response = await ApiService.sendPasswordResetEmail(email);
        if (response.success) {
          setResetSuccess(true);
        } else {
          setEmailError("Email not found. Please check your email address.");
        }
      } catch (error) {
        setEmailError("An error occurred while sending the reset email.");
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
        <span className="close" onClick={onClose} style={{float:"right",marginTop:".5rem",height:"2rem",width:"2rem"}}>
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
