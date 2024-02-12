import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "../../scss/navbar.scss";
import MenuIcon from "@mui/icons-material/Menu";
import { CLIENT_CURRENT } from "../../constants.js";
import { useEmulatorStore } from "../../stores/emulator/store.tsx";
import LinearProgressBar from "./StyledLinearProgressBar.js";

const Navbar = ({ isAdmin, setIsAdmin }) => {
  const [menuIcon, setMenuIcon] = useState(false);
  const [data, setData] = useState();

  const logout = useEmulatorStore((state) => state.logout);
  const navigate = useNavigate();

  const selectMicStatus = useEmulatorStore((state) => state.micCheck);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAdmin(false);
    logout();
    navigate("/login");
  };

  const fetchClientData = async () => {
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
        const deserializedData = JSON.parse(responseData);
        setData(deserializedData);
        return { success: true, error: null };
      }
    } catch (error) {
      console.error("Data Error: " + error);
    }
  };

  useEffect(() => {
    fetchClientData();
  }, []);

  return (
    <>
      <div className="header">
        <div className="main-nav">
          {/* 1st logo part  */}
          <div className="logo">
            <img
              className="logo_image"
              style={{ width: "8rem", height: "auto" }}
              src="images/logo/logbookgps_logo.png"
              alt="logo"
            />
            {window.location.pathname === "/gps" && selectMicStatus === false && (
              <div className="microstyle">
                Microphone is not connected!
              </div>
            )}
          </div>

          {/* 2nd menu part  */}
          <div
            className={menuIcon ? "menu-link mobile-menu-link" : "menu-link"}
          >
            <ul>
              {isAdmin && (
                <li>
                  <NavLink
                    to="/home"
                    className="navbar-link"
                    onClick={() => setMenuIcon(false)}
                  >
                    Licenses
                  </NavLink>
                </li>
              )}
              <li>
                <NavLink
                  to="/gps"
                  className="navbar-link"
                  onClick={() => setMenuIcon(false)}
                >
                  GPS
                </NavLink>
              </li>

              <p className="username_para" style={{ margin: "1rem 0" }}>
                {data?.firstName || "N/A"} {data?.lastName || "N/A"} (
                {data?.username || "N/A"})
              </p>
              <li>
                <NavLink to="/" onClick={() => handleLogout()}>
                  Logout
                </NavLink>
              </li>
            </ul>
          </div>
          {/* 3rd social media links */}
          <div className="social-media">
            {/* hamburger menu start  */}
            <div className="hamburger-menu">
              <a href="#" onClick={() => setMenuIcon(!menuIcon)}>
                <MenuIcon
                  style={{
                    width: "4rem",
                    height: "4rem",
                    paddingBottom: "2.5rem",
                  }}
                />
              </a>
            </div>
          </div>
        </div>
        {/* <div>
          Error
        </div> */}
        <LinearProgressBar />
      </div>
    </>
  );
};

export default Navbar;
