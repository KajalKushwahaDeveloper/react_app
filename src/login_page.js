import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./scss/login.scss";
import { ADMIN_LOGIN } from './constants';

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [responseError, setResponseError] = useState("");

  useEffect(() => {
    const user = localStorage.getItem('token');
    if (user) {
      console.log("Logged In User: ", user); //User already logged in, redirect to home
      navigate("/home");
    }
  }, [navigate]);

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

    try {
      const response = await fetch(ADMIN_LOGIN, {
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
