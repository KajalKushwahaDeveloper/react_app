import { Outlet, Navigate } from "react-router-dom";
import Navbar from "../root/navbar.js";

import GPS from "../../gps.js";

const PrivateRoutes = ({ isAdmin, setIsAdmin }) => {
    let auth = localStorage.getItem("token");
    return(
      auth ? <>
        <Navbar isAdmin={isAdmin} setIsAdmin={setIsAdmin} style={{ zIndex: 9998 }} />
        {isAdmin === false ? (
          <GPS />
        ):  <Outlet />}
        </>
        : <Navigate to='/login' />
    )
}

export default PrivateRoutes;