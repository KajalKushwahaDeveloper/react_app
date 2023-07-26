import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "../scss/navbar.scss";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

import { CLIENT_CURRENT } from "../constants";

const navItems = ["Home", "GPS"];

const Navbar = ({ isAdmin }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuIcon, setMenuIcon] = useState(false);
  const [data, setData] = useState();
  const [error, setError] = useState();

  const navigate = useNavigate();
  const location = useLocation();

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const fetchClientData = async () => {
    console.log("fetchClientData isAdmin : " + isAdmin);
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(CLIENT_CURRENT, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok || response.status !== 200) {
        return { success: false, error: "Invalid credentials" };
      } else {
        const responseData = await response.text();
        console.log("responseData navbar:", responseData);
        const deserializedData = JSON.parse(responseData);
        setData(deserializedData);
        console.log("deserializedData navbar:", deserializedData);
        return { success: true, error: null };
      }
    } catch (error) {
      console.log("Data Error: " + error);
      setError(error.message);
    }
  };

  useEffect(() => {
    const { success, error } = fetchClientData();
  }, []);

  return (
    <>
      <CssBaseline />
      <AppBar position="fixed" sx={{ backgroundColor: "red" }}>
        <Toolbar className="app_bar">
          {/* Logo */}
          <div className="logo">
            <img className="logo_image" src="images/logo2.png" alt="logo" />
          </div>

          <Box className="menu-link" sx={{ mr: 2, display: { lg: "block" } }}>
            {isAdmin && (
              <Button
                color="inherit"
                component={Link}
                to="/home"
                onClick={() => setMenuIcon(false)}
                className={location.pathname === "/home" ? "active-link" : ""}
              >
                Licenses
              </Button>
            )}
            <Button
              color="inherit"
              component={Link}
              to="/gps"
              onClick={() => setMenuIcon(false)}
              className={location.pathname === "/gps" ? "active-link" : ""}
            >
              GPS
            </Button>

            <Typography variant="body1" color="inherit" sx={{ mx: 2 }}>
              {data?.firstName || "N/A"} {data?.lastName || "N/A"} (
              {data?.username || "N/A"})
            </Typography>
            <Button
              // color="inherit"
              component={Link}
              to="/"
              onClick={() => handleLogout()}
              activeClassName="active-link"
            >
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
    </>
  );
};

export default Navbar;
