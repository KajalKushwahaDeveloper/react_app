import React, { useState } from "react";
import { NavLink, useNavigate} from "react-router-dom";
import "../scss/navbar.scss"
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";



const Navbar = () => {
  const [menuIcon, setMenuIcon] = useState(false);
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/login');
  };

  return (
    <>
    <div className="header">
        <div className="main-nav">
          {/* 1st logo part  */}
          <div className="logo">
            <img
              className="logo_image"
              // style={{ width: "17rem", height: "auto" }}
              src="images/logo2.png"
              alt="logo"
            />
          </div>

          {/* 2nd menu part  */}
          <div
            className={menuIcon ? "menu-link mobile-menu-link" : "menu-link"}
          >
            <ul className="">
              <li>
                <NavLink
                  to="/home"
                  className="navbar-link"
                  onClick={() => setMenuIcon(false)}
                >
                  Licenses
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/gps"
                  className="navbar-link"
                  onClick={() => setMenuIcon(false)}
                >
                  GPS
                </NavLink>
              </li>
              {/* Drop down  */}
             
              <li>
                <NavLink
                  to="/settings"
                  className="navbar-link"
                  onClick={() => setMenuIcon(false)}
                >
                  Settings
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/portfolio"
                  className="navbar-link"
                  onClick={() => setMenuIcon(false)}
                >
                  firstname lastname
                </NavLink>
              </li>
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
                <MenuIcon style={{ width: "4rem", height: "4rem" }} />
              </a>
            </div>
          </div>
        </div>
    </div>
    </>
  );
};

export default Navbar;

