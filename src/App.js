import React, { useEffect, useState } from "react";
import LoginPage from "./login_page";
import Home from "./home";
import GPS from "./gps";
import Logout from "./logout.js";
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

/**
 * React component representing the main application.
 *
 * @component
 * @returns {JSX.Element} The rendered React element for the application.
 */
function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAdmin, setIsAdmin] = useState(false);

   /**
   * Checks the token stored in local storage and performs actions based on the token's validity.
   *
   * @async
   * @function
   * @returns {Promise<void>} A promise that resolves once the token is checked and actions are performed.
   */
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
        navigate("/login");
      }
    }
  };

  /**
   * React lifecycle hook that runs the `checkToken` function when the component mounts or the pathname changes.
   *
   * @useEffect
   * @effect
   */
  useEffect(() => {
    checkToken();
  }, [location.pathname]);
  // TODO: When checkToken is running, we need to show a redirecting page....

  /**
   * React component representing the application's routes.
   *
   * @component
   * @returns {JSX.Element} The rendered React element for the application routes.
   */
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route element={<AuthenticatedLayout isAdmin={isAdmin} />}>
      <Route path="/home" element={<Home />} />
      <Route path="/gps" element={<GPS />} />
      <Route path="/logout" element={<Logout />} />
      </Route>
    </Routes>
  );
}

/**
 * Renders the authenticated layout.
 *
 * @param {boolean} isAdmin - Indicates if the user is an admin.
 * @return {ReactNode} The rendered authenticated layout.
 */
const AuthenticatedLayout = ({ isAdmin }) => {
  return (
    <>
      <Navbar isAdmin={isAdmin} />
      <Outlet />
    </>
  );
};

export default App;
