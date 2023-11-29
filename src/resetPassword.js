import React, { useState } from "react";
import { RESET_PASSWORD } from "./constants";
import { useSearchParams } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import "./scss/home.scss";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

/**
 * React functional component representing the reset password page.
 *
 * @component
 * @returns {JSX.Element} The rendered React element for the reset password page.
 */
const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  // Extracts the token from the URL query parameters
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');


  /**
   * Handles changes in the password input field.
   *
   * @param {Object} e - The event object.
   * @returns {void} No return value.
   */
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };


  /**
   * Handles changes in the confirm password input field.
   *
   * @param {Object} e - The event object.
   * @returns {void} No return value.
   */
  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };


  /**
   * Handles the form submission for password reset.
   *
   * @function
   * @param {Object} e - The event object.
   * @returns {void} No return value.
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    // Perform validation for password and confirm password
    if (password !== confirmPassword) {
      setError("Passwords do not match");
    } else if (!password || !confirmPassword) {
      setError("Please enter both password and confirm password");
    } else {
      fetch(RESET_PASSWORD, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ password }),
      })
        .then((response) => {
          if (response.ok) {
            window.alert("SAVED PASSWORD");
            console.log("SAVED PASSWORD", token);
            localStorage.setItem("token", token);
            navigate("/gps");
          } else {
            throw new Error("An error occurred during password reset");
          }
        })
        .catch((error) => {
          // Show alert error when there is an error
          window.alert(error.message);
          setError("Please enter both password and confirm password");
        });
    }
  };

  // JSX rendering and other details...
  return (
    <div className="reset_password">
      <h1>Reset Password</h1>
     <div className="reset_password_form">
     <form onSubmit={handleSubmit}>
        <label>
          New Password:
          <input
            type="password"
            value={password}
            onChange={handlePasswordChange}
          />
        </label>
        <label>
          Confirm Password:
          <input
            type="password"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
          />
        </label>
        <button type="submit">Reset Password</button>
        {error && <p>{error}</p>}
      </form>
     </div>
    </div>
  );
};

export default ResetPasswordPage;
