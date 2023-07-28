import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./scss/login.scss";
import ApiService from "./ApiService";
import { CLIENT_LOGIN } from "./constants";

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [responseError, setResponseError] = useState("");

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResponseError("");
    setEmailError("");
    setPasswordError("");
    if (!email) {
      setEmailError("Please enter a email");
    } else if (!password) {
      setPasswordError("Please enter a password");
    } else {
      try {
        const payload = { email, password };
        const { success, data, error } = await ApiService.makeApiCall(
          CLIENT_LOGIN,
          "POST",
          payload,
          null
        );
        if (success) {
          const token = data.token;
          localStorage.setItem("token", token);
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

  return (
    <>
      <div className="authScreen">
        <div className="container-fluid h-100">
          <div class="row h-100">
            <div class="col-md-6 centerMid d-none d-md-flex">
              <div class="Left_content">
                <img src="images/logo2.png" />
                <hr className="hr"></hr>
                <p className="para">
                  Vivamus at dui consequat, dapibus tellus vitae
                </p>
              </div>
            </div>
            <div className="col-md-6 formBox bg-light  centerMid flex-column">
              <div className="authCard shadow">
                <div class="Left_content d-block d-md-none">
                  <img src="images/logo2.png" />
                  <p className="para">
                    Vivamus at dui consequat, dapibus tellus vitae
                  </p>
                </div>
                <form onSubmit={handleSubmit}>
                  <h1>Log in to your account</h1>
                  <div className="row">
                    <div className="col-12">
                      <div className="inputField">
                        <input
                          type="email"
                          id="content_input"
                          name="email"
                          placeholder="Enter your email"
                          value={email}
                          onChange={handleEmailChange}
                          className="form-control"
                        />
                        {emailError && <p className="error">{emailError}</p>}
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="inputField">
                        <input
                          type="password"
                          id="content_input"
                          name="password"
                          placeholder="Enter your password"
                          value={password}
                          onChange={handlePasswordChange}
                          className="form-control"
                        />
                        {passwordError && (
                          <p className="error">{passwordError}</p>
                        )}
                      </div>
                    </div>
                    <div className="col-12 mt-3 btns">
                      <button className="btn btn-main" type="submit">
                        Login
                      </button>
                    </div>
                    <div className="col-12 mt-3 btns">
                      {responseError && (
                        <p className="error">{responseError}</p>
                      )}
                      <a href="#">Sign In?</a>
                    </div>
                  </div>
                </form>
              </div>
            </div>
            <img src="images/map-location.svg" alt="" className="gps" />
            <img src="images/middleImg.svg" alt="" className="middle" />
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
