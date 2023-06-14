import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./scss/login.scss";

const LoginPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [responseError, setResponseError] = useState("");

  useEffect(() => {
    const user = localStorage.getItem('token');
    if (user) {
      console.log("Logged In User: ", user); //User already logged in, redirect to home
      navigate("/home");
    }
  }, [navigate]);

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResponseError("");
    setUsernameError("");
    setPasswordError("");
    if (!username) {
      setUsernameError("Please enter a username");
    } else if (!password) {
      setPasswordError("Please enter a password");
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
    const item = { username, password };
  
    

const API = "http://64.226.101.239:8080/admin/log-in"; // LIVE API server URL
// const API = "http://192.168.1.123:8080/admin/log-in"; // LOCAL API server URL

    try {
      const response = await fetch(API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-KEY": "track_spot_api_key"
        },
        body: JSON.stringify(item),
      });
  
      if (!response.ok || response.status !== 200) {
        return { success: false, error: "Invalid credentials" };
      }
  
      // const result = await response.json();
      // const token = result.token;
      const token = "TOKEN";
      localStorage.setItem("token", token);
      return { success: true };
    } catch (error) {
      console.error("Error occurred during login:", error);
      throw error; // Rethrow the error to be caught by the caller (handleSubmit)
    }
  };


  return (
    <>
      <div className="main_div">
        <div className="left">
          <div className="image">
            <img src="images/logo2.png" />
            <hr className="hr"></hr>
          <p className="para">Vivamus at dui consequat, dapibus tellus vitae</p>
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
                    name="username"
                    placeholder="Enter your username"
                    value={username}
                    onChange={handleUsernameChange}
                  />
                  {usernameError && <p className="error">{usernameError}</p>}
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
