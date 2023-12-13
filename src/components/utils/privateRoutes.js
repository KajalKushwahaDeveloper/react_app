import { Outlet, Navigate } from "react-router-dom";
import Navbar from "../../components/navbar.js";


const PrivateRoutes = ({ isAdmin }) => {
      let auth = localStorage.getItem("token");
    return(
      auth ? <>
        <Navbar isAdmin={isAdmin} style={{ zIndex: 9998 }} />
        <Outlet /> </>
        : <Navigate to='/login' />
    )
}

export default PrivateRoutes;