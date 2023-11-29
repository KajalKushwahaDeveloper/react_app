import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "../scss/navbar.scss";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { CLIENT_CURRENT } from "../constants";

/**
 * Renders the Navbar component.
 *
 * @param {object} props - The props object containing the isAdmin property.
 * @return {JSX.Element} The rendered Navbar component.
 */
const Navbar = ({ isAdmin }) => {
  const [menuIcon, setMenuIcon] = useState(false);
  const [data, setData] = useState();
  const [error, setError] = useState();

  const navigate = useNavigate();
  
  /**
   * A function to handle user logout.
   *
   * @return {void} This function does not return anything.
   */
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  /**
   * Fetches client data.
   *
   * @return {Promise<Object>} An object indicating the success or failure of the operation.
   */
  const fetchClientData = async () => {
    console.log("fetchClientData isAdmin : "  + isAdmin);
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
    fetchClientData();
  }, []);

  // JSX rendering and other details...
  return (
    <>
      <div className="header">
        <div className="main-nav">
          {/* 1st logo part  */}
          <div className="logo">
            <img
              className="logo_image"
              // style={{ width: "17rem", height: "auto" }}
              src="images/logo3.png"
              alt="logo"
            />
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
        
              <p className="username_para" style={{margin :"1rem 0"}}>
                {data?.firstName || "N/A"} {data?.lastName || "N/A"} (
                {data?.username || "N/A"})
              </p>
              <li>
                <NavLink
                  to="/"
                  className="navbar-link-btn"
                  onClick={() => handleLogout()}
                >
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
                <MenuIcon style={{ width: "4rem", height: "4rem",paddingBottom:"2.5rem", }} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
