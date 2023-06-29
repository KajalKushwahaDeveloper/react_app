import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./scss/login.scss";
import ApiService from "./ApiService";
import { ADMIN_LOGIN, CLIENT_CURRENT } from "./constants";

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [responseError, setResponseError] = useState("");

  useEffect(() => {
    fetchData();
  });

  const fetchData = async () => {
    const token = localStorage.getItem("token");
    console.error("CLIENT_CURRENT: token : ", token);
    if (token != null) {
      try {
        console.error("CLIENT_CURRENT: RAN");
        const { success, data, error } = await ApiService.makeApiCall(
          CLIENT_CURRENT,
          "GET",
          null,
          token
        );
        if (success) {
          console.error("CLIENT_CURRENT: ", data);
          const authorities = data.authorities;
          let isRoleAdmin = false;
          authorities.forEach((authority) => {
            if (authority.authority === "ROLE_ADMIN") {
              isRoleAdmin = true;
              return; // Exit the loop early if ROLE_ADMIN is found
            }
          });
          if (isRoleAdmin) {
            navigate("/home"); // Redirect to the home page
          } else {
            navigate("/gps"); // Redirect to the gps page
          }
        } else {
          console.error("CLIENT_CURRENT Error: ", error);
          localStorage.removeItem("token");
        }
      } catch (error) {
        console.error("CLIENT_CURRENT 2 Error: ", error);
        localStorage.removeItem("token");
      }
    }
  };


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
          ADMIN_LOGIN,
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
                    type="text"
                    id="content_input"
                    name="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={handleEmailChange}
                  />
                  {emailError && <p className="error">{emailError}</p>}
                  <input
                    type="password"
                    id="content_input"
                    name="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={handlePasswordChange}
                  />
                  {passwordError && <p className="error">{passwordError}</p>}
                  <button className="login_button" type="submit">
                    Login
                  </button>
                  {responseError && <p className="error">{responseError}</p>}
                  <a href="#">Sign In?</a>
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
