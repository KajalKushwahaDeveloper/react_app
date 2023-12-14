import React, { useEffect, useState } from "react";
import LoginPage from "../login_page.js";
import Home from "../home.js";
import GPS from "../gps.js";
import Navbar from "../components/navbar.js";
import ResetPasswordPage from "../resetPassword.js";

import {
  Routes,
  Route,
  BrowserRouter as Router,
  useLocation,
  Outlet,
} from "react-router-dom";
import ApiService from "../ApiService.js";
import { CLIENT_CURRENT } from "../constants.js";
import { useNavigate } from "react-router-dom";
import PrivateRoutes from "../components/utils/privateRoutes.js";
import PageNotFound from "../view/pageNotFound.js";

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAdmin, setIsAdmin] = useState(false);

  const [baseRoutes, setBaseRoutes] = useState(false);

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
          /* localStorage.removeItem("token");
          navigate("/login"); */
        }
      } catch (error) {
        console.error("CLIENT_CURRENT 2 Error: ", error);
        /* localStorage.removeItem("token");
        navigate("/login"); */
      }
    }
  };

  useEffect(() => {
    checkToken();
  }, [location.pathname]);
  // TODO: When checkToken is running, we need to show a redirecting page....

  useEffect(() => {
    if (localStorage.getItem("token") && window.location.pathname === "/") {
      navigate(-1);
    } else if (window.location.pathname === "/") {
      navigate("/login");
    } else if (window.location.pathname === "/login") {
      navigate(-1);
    } else {
      setBaseRoutes(true);
    }
  }, []);

  return (
    <>
      <Routes>
        <Route element={<PrivateRoutes isAdmin={isAdmin} />}>
          <Route path="/home" element={<Home />} />
          <Route path="/gps" element={<GPS />} />
          {window.location.pathname === "/" && navigate("/login")}
        </Route>
        <Route exact path="/login" element={<LoginPage />} />
        {baseRoutes === true && (
          <Route>
            {window.location.pathname === "/" && navigate("/login")}
            <Route path="/login" element={<LoginPage />} />
            <Route path="*" element={<PageNotFound />} />
          </Route>
        )}
      </Routes>
    </>
  );
}

export default App;
