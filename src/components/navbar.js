import React from "react";
import { useNavigate } from "react-router-dom";
import "../scss/button.scss";

const Navbar = () => {
  const navigate = useNavigate();
  return (
    <>
      <div className="" style={{padding:"1rem 0", overflow:"hidden"}}>
        <a className="navbar-brand" href="#">
        <button onClick={navigate('/login')} type="button" className="login_button ">Logout</button>
        </a>
      </div>
    </>
  );
};

export default Navbar;
