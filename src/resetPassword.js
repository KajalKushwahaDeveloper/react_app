import React, { useState } from "react";
import { RESET_PASSWORD } from "./constants";
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

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
