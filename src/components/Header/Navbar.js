import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import styled from "styled-components";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { Button } from "../components/components/Button";
import DropDown from "../components/components/DropDown";
import Second_DropDown from "../components/components/Second_DropDown";

const Navbar = () => {
  const [menuIcon, setMenuIcon] = useState(false);

  return (
    <>
      <Nav>
        <div className="main-nav">
          {/* 1st logo part  */}
          <div className="logo">
            <img
              className="logo_image"
              style={{ width: "17rem", height: "auto" }}
              src="https://ftechiz.com/wp-content/uploads/2022/11/FtechizLogo.png"
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
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/about"
                  className="navbar-link"
                  onClick={() => setMenuIcon(false)}
                >
                  About Us
                </NavLink>
              </li>
              {/* Drop down  */}
              <li>
                <DropDown />
              </li>
              <li>
                <Second_DropDown />
              </li>
              <li>
                <NavLink
                  to="/career"
                  className="navbar-link"
                  onClick={() => setMenuIcon(false)}
                >
                  Career
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/portfolio"
                  className="navbar-link"
                  onClick={() => setMenuIcon(false)}
                >
                  Portfolio
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/hire"
                  className="navbar-link-btn"
                  onClick={() => setMenuIcon(false)}
                >
                  Hire Us
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
      </Nav>
    </>
  );
};
const Nav = styled.nav`
  a {
    text-decoration: none;
    color: white;
  }

  li {
    list-style: none;
  }

  .main-nav {
    width: 100%;
    height: 7rem;
    display: grid;
    grid-template-columns: 0rem 1fr 2fr 0rem;
  }

  .logo {
    display: flex;
    justify-content: start;
    align-items: center;
    margin-left: 3rem;
  }

  .menu-link {
    grid-column: 3/4;
    color: ${({ theme }) => theme.colors.color_white};
  }

  .menu-link ul {
    height: 7rem;
    display: flex;
    justify-content: space-around;
    align-items: center;
  }

  .navbar-link-btn {
    background: ${({ theme }) => theme.colors.helper};
    padding: 0.8rem 1.2rem;
    border-radius: 0.4rem;
  }

  /* ----------- Grid part ends ----------------- */

  .menu-link ul li {
    font-size: 1.8rem;
    padding: 0.6rem 1rem;

    &:hover {
      background: ${({ theme }) => theme.colors.helper};
      padding: 0.6rem 1rem;
      border-radius: 0.4rem;
    }
  }
  .active {
    background: ${({ theme }) => theme.colors.helper};
    padding: 0.8rem 1.5rem;
    border-radius: 0.4rem;
  }
  .menu-link ul li a {
    text-transform: capitalize;
    color: ${({ theme }) => theme.colors.color_white};
    transition: 0.5s;
    font-size: 1.7rem;
  }
  .menu-link ul li:hover > a {
    transform-origin: left;
    opacity: 0.9;
    transition: 0.5s;
  }

  .social-media .hamburger-menu {
    display: none;
  }
  /* responsive css style  */
  @media (max-width: 1080px) {
    .main-nav {
      width: 100%;
      height: 7rem;
      display: grid;
      grid-template-columns: 0rem 0.8fr 2fr 0rem;
    }
    .menu-link ul li {
      font-size: 1.8rem;
      padding: 0 0.5rem;

      &:hover {
        background: ${({ theme }) => theme.colors.helper};
        padding: 0.5rem;
      }
    }

    .logo,
    .menu-link ul,
    .social-media ul {
      height: 8rem;
    }
  }

  /* responsive css style  */
  @media (max-width: 998px) {
    line-height: 4.5rem;
    .main-nav {
      height: 7rem;
      grid-template-columns: 1rem 2fr 3fr 0rem;
    }

    .menu-link {
      display: none;
    }

    .logo,
    .social-media ul {
      height: 7rem;
    }

    .mobile-menu-link {
      grid-column: 2/4;
      position: relative;
      z-index: 99;
    }

    .mobile-menu-link {
      background-color: ${({ theme }) => theme.colors.bg};
      position: absolute;
      left: 0;
      top: 8rem;
      transition: all 0.5s ease-out;
      width: 100%;
      height: 100vh;
      display: block;
      ${"" /* grid-column: 2/5; */}
      align-items: center;
      padding: 29.7rem 0;
      ${"" /* transform-origin: top; */}
    }

    .mobile-menu-link ul {
      display: flex;
      justify-content: center;
      flex-direction: column;
      align-items: center;
      color: ${({ theme }) => theme.colors.color_white};
    }
    .menu-link ul li {
      font-size: 1.6rem;
      padding: 0.1rem 1.6rem;
      &:hover {
        background: ${({ theme }) => theme.colors.helper};
        padding: 0.1rem 1rem;
        border-radius: 0.4rem;
      }
    }
    .mobile-menu-link ul li a {
      color: ${({ theme }) => theme.colors.color_white};
      font-size: 2.2rem;
    }

    .social-media {
      grid-row: 1/2;
      grid-column: 3/5;
      justify-items: end;
      align-items: center;
      ${"" /* transition: all 2s linear; */}
    }

    .social-media {
      height: 7rem;
      display: flex;
      justify-self: end;
      align-items: center;
    }

    .social-media .hamburger-menu {
      display: block;
      font-size: 2.5rem;
      margin-right: 1rem;
    }
    .hire-btn {
      padding: 0rem 4rem;
      font-size: 1rem;
    }
  }
  @media (max-width: 798px) {
    line-height: 4.5rem;

    .main-nav {
      height: 7rem;
      padding: 0 1rem;
      grid-template-columns: 1rem 2fr 1fr 0rem;
    }

    .logo,
    .social-media ul {
      height: 6rem;
    }

    .social-media {
      height: 6rem;
      display: flex;
      justify-self: end;
      align-items: center;
    }
    .menu-link ul li {
      font-size: 1.8rem;
      padding: 0.1rem 1.6rem;

      &:hover {
        background: ${({ theme }) => theme.colors.helper};
        padding: 0.1rem 1rem;
        border-radius: 0.4rem;
      }
    }
    .mobile-menu-link ul li a {
      color: ${({ theme }) => theme.colors.color_white};
      font-size: 2.2rem;
    }
    .mobile-menu-link {
      background-color: ${({ theme }) => theme.colors.bg};
      position: absolute;
      left: 0;
      top: 8rem;
      transition: all 0.5s ease-out;
      width: 100%;
      height: 100vh;
      display: block;
      ${"" /* grid-column: 2/5; */}
      align-items: center;
      padding: 35rem 0;
      ${"" /* transform-origin: top; */}
    }
    .hamburger-menu {
      display: block;
      font-size: 2.5rem;
    }
  }

  @media (max-width: 520px) {
    line-height: 5rem;
    .main-nav {
      height: 7rem;
      grid-template-columns: 1rem 4fr 1fr 0rem;
    }

    .logo,
    .social-media ul {
      height: 6rem;
    }

    .hamburger-menu {
      display: block;
      font-size: 6.5rem;
      padding-left: 1rem;
    }
    .menu-link ul li {
      font-size: 1.8rem;
      padding: 0.1rem 1rem;

      &:hover {
        background: ${({ theme }) => theme.colors.helper};
        padding: 0.1rem 1rem;
        border-radius: 0.4rem;
      }
    }
    .mobile-menu-link {
      ${"" /* grid-column: 2/4; */}
      position: relative;
      z-index: 99;
    }

    .mobile-menu-link {
      background-color: ${({ theme }) => theme.colors.bg};
      position: absolute;
      left: 0;
      top: 8rem;
      transition: all 0.5s ease-out;
      width: 100%;
      height: 100vh;
      display: block;
      ${"" /* grid-column: 2/5; */}
      align-items: center;
      padding: 25rem 0;
      ${"" /* transform-origin: top; */}
    }
    .mobile-menu-link ul {
      height: auto;
      display: flex;
      justify-content: space-around;
      flex-direction: column;
      align-items: center;
      color: ${({ theme }) => theme.colors.color_white};
      .navbar-link-btn {
        background: ${({ theme }) => theme.colors.helper};
        padding: 0.8rem 1.2rem;
        border-radius: 0.4rem;
      }
    }
    .mobile-menu-link ul li a {
      color: ${({ theme }) => theme.colors.color_white};
      font-size: 2.2rem;
    }
  }
`;
export default Navbar;
