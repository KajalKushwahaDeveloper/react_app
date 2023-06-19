import Navbar from "./Navbar";
import React from "react";
import { NavLink } from "react-router-dom";
import styled from "styled-components";

const Header = () => {
  return (
    <MainHeader>
      <Navbar />
    </MainHeader>
  );
};

const MainHeader = styled.header`
  width: 100%;
  height: auto;
  background-color: ${({ theme }) => theme.colors.bg};
  color: ${({ theme }) => theme.colors.color_white};
  position: fixed;
  padding: 1rem 0rem;
  z-index: 999999;
`;

export default Header;
