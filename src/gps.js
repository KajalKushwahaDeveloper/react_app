import React, { useEffect, useState } from "react";
import Navbar from "./components/navbar.js";
import axios from "axios";
import "./scss/home.scss";
import Dropdown from "./components/dropDown.js";
import Form from "./components/form.js";
import {EMULATOR_URL} from "./constants.js"
// import Map from "./components/map.js";

// const API = "http://64.226.101.239:8080/emulator"; // LIVE API server URL
// const API = "http://192.168.1.123:8080/emulator"; // LOCAL API server URL

const GPS = () => {
  const [emulator, setEmulator] = useState();
  const [emulatorValue, setEmulatorValue] = useState("");
  const [visibleForm, setVisibleForm] = useState(false);
  const [fcmToken  , setFcmToken] = useState("");

  const onEmulatorChange = (e) => {
    !visibleForm && setVisibleForm(true);
    setEmulatorValue(e.target.value);
    // setEmulatorId("");
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token'); 
        console.log("token : ", token);
        const response = await axios.get(EMULATOR_URL, {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });
        // console.log(response.data); // Handle the response data here
        setEmulator(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <Navbar />
      <div className="home_div">
        <div>
          {console.log(emulator)}
          <Dropdown
            onEmulatorChange={onEmulatorChange}
            emulatorValue={emulatorValue}
            emulator={emulator}
            setFcmToken={setFcmToken}
          />
        </div>
        <div className="form_component">
          {visibleForm && <Form fcmToken={fcmToken} />}
        </div>
      </div>
    </>
  );
};

export default GPS;
 