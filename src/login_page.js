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
          setResponseError( "Invalid credentials"); // Display appropriate error message
        }
      } catch (error) {
        console.log("Error occurred during login:", error);
        setResponseError("An error occurred during login"); // Display a generic error message
      }
    }
  };

  return (
    <>
      <div className="main_div">
        <div className="left">
          <div className="image">
            <img src="images/logo2.png" />
            <hr className="hr"></hr>
            <p className="para">
              Vivamus at dui consequat, dapibus tellus vitae
            </p>
          </div>
        </div>

        <div className="right">
          <div className="map_img">
            <img src="images/map.png" />
            <div className="center_div">
              <div className="content">
                <form onSubmit={handleSubmit}>
                  <h1>Log in</h1>
                  <input
                    type="email"
                    id="content_input"
                    name="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={handleEmailChange}
                  />
                  <input
                    type="password"
                    id="content_input"
                    name="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={handlePasswordChange}
                  />
                  <button className="login_button" type="submit">
                    Login
                  </button>
                  {passwordError && <p className="error" style={{margin:"0"}}>{passwordError}</p>}
                  {emailError && <p className="error"style={{margin:"0"}}>{emailError}</p>}
                  {responseError && <p className="error"style={{margin:"0"}}>{responseError}</p>}
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
