import React, { useEffect, useState } from "react";
import LoginPage from "../login_page.js";
import RedirectPage from "../redirect_page.js";
import Home from "../home.js";
import GPS from "../gps.js";

import { Routes, Route, useLocation } from "react-router-dom";
import ApiService from "../ApiService.js";
import { CLIENT_CURRENT } from "../constants.js";
import { useNavigate } from "react-router-dom";
import PrivateRoutes from "../components/utils/privateRoutes.js";
import PageNotFound from "../view/pageNotFound.js";
import { useEmulatorStore } from "../stores/emulator/store.tsx";
import useMarkerStore from "../stores/emulator/markerStore.js";

function App() {
  console.log("TEST@ App rendered!")
  const navigate = useNavigate();
  const location = useLocation();
  const [isAdmin, setIsAdmin] = useState(false);

  const connectEmulatorsSSE = useEmulatorStore.getState().connectEmulatorsSSE;
  const initMarkers = useMarkerStore.getState().initMarkers;
  const createDevices = useEmulatorStore.getState().createDevices;

  useEffect(() => {
    const checkToken = async () => {
      if (
        location.pathname !== "/login" &&
        location.pathname !== "/" &&
        location.pathname !== "/home" &&
        location.pathname !== "/redirect" &&
        location.pathname !== "/gps" &&
        location.pathname !== "/page404"
      ) {
        navigate("/page404");
        return;
      }

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
            localStorage.removeItem("token");
            navigate("/login");
          }
        } catch (error) {
          console.error("CLIENT_CURRENT 2 Error: ", error);
          localStorage.removeItem("token");
          navigate("/login");
        }
      } else {
        navigate("/login");
      }
    };

    checkToken();
  }, [location.pathname, navigate]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      connectEmulatorsSSE();
      initMarkers();
      createDevices();
    }
  }, [connectEmulatorsSSE, initMarkers, localStorage.getItem("token")]);

  return (
    <>
      <Routes>
        <Route path="/page404" element={<PageNotFound />} />
        <Route
          element={<PrivateRoutes isAdmin={isAdmin} setIsAdmin={setIsAdmin} />}
        >
          <Route path="/home" element={<Home />} />
          <Route path="/gps" element={<GPS />} />
          <Route path="/redirect" element={<RedirectPage />} />
        </Route>
        <Route exact path="/login" element={<LoginPage />} />
      </Routes>
    </>
  );
}

export default App;
