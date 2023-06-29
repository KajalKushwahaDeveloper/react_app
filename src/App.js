import React, { useEffect } from "react";
import LoginPage from "./login_page";
import Home from "./home";
import GPS from "./gps";
import Logout from "./logout.js";
import Settings from "./settings.js";
import ResetPasswordPage from "./resetPassword";
import { Routes, Route, BrowserRouter as Router, useLocation } from "react-router-dom";
import ApiService from "./ApiService";
import { CLIENT_CURRENT } from "./constants";
import { useNavigate } from "react-router-dom";

import Navbar from "./components/navbar";
function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const checkToken = async () => {
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
            if (location.pathname === "/login") {
              navigate("/home");
            }
          } else {
            if (location.pathname === "/login") {
              navigate("/gps");
            }
            if (location.pathname === "/home") {
              navigate("/gps");
            }
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

  useEffect(() => {
    checkToken();
  }, [location.pathname]);

  //TODO :  When checkToken is running, we need to show a redirecting page....
  
    return (
      <>
        <Navbar/>
          <Routes>
            <Route  path="/" element={<LoginPage/>} /> 
            <Route path="/login" element={<LoginPage/>} />
            <Route path="/home" element={<Home/>} />
            <Route path="/gps" element={<GPS/>} />
            <Route path="/settings" element={<Settings/>} />
            <Route path="/logout" element={<Logout/>} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
      </Routes>
      </>
    );
  }

  export default App;