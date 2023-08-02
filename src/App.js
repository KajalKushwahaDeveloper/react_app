import React, { useEffect, useState } from "react";
import LoginPage from "./login_page";
import Home from "./home";
import GPS from "./gps";
import Logout from "./logout.js";
import Settings from "./settings.js";
import Navbar from "./components/navbar";
import ResetPasswordPage from "./resetPassword";

import {
  Routes,
  Route,
  BrowserRouter as Router,
  useLocation,
  Outlet,
} from "react-router-dom";
import ApiService from "./ApiService";
import { CLIENT_CURRENT } from "./constants";
import { useNavigate } from "react-router-dom";

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State variable for login status

  const checkToken = async () => {
    const token = localStorage.getItem("token");
    if (token != null) {
      try {
        const { success, data, error } = await ApiService.makeApiCall(
          CLIENT_CURRENT,
          "GET",
          null,
          token
        );
        if (success) {
          const authorities = data.authorities;
          let isRoleAdmin = false;
          authorities.forEach((authority) => {
            if (authority.authority === "ROLE_ADMIN") {
              isRoleAdmin = true;
              return; // Exit the loop early if ROLE_ADMIN is found
            }
          });
          setIsAdmin(isRoleAdmin);
          if (location.pathname === "/redirect") {
            if (isRoleAdmin) {
              navigate("/home");
            } else {
              navigate("/gps");
            }
            return;
          }

          if (isRoleAdmin) {
            if (location.pathname === "/login" || location.pathname === "/") {
              navigate("/home");
            }
          } else {
            if (
              location.pathname === "/login" ||
              location.pathname === "/" ||
              location.pathname === "/home"
            ) {
              navigate("/gps");
            }
          }
        } else {
          console.error("CLIENT_CURRENT Error: ", error);
          localStorage.removeItem("token");
          navigate("/login");
        }
      } catch (error) {
        console.error("CLIENT_CURRENT 2 Error: ", error);
        localStorage.removeItem("token");
        setIsLoggedIn(false); // Set login status to false
        navigate("/login");
      }
    }
  };

  useEffect(() => {
    checkToken();
  }, [location.pathname]);

  // TODO: When checkToken is running, we need to show a redirecting page....

  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route element={<AuthenticatedLayout isAdmin={isAdmin} />}>
        <Route path="/home" element={<Home />} />
        <Route path="/gps" element={<GPS />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/logout" element={<Logout />} />
      </Route>
    </Routes>
  
  );
}

const AuthenticatedLayout = ({ isAdmin }) => {
  return (
    <>
      <Navbar isAdmin={isAdmin} />
      <Outlet />
    </>
  );
};

export default App;
