import React, { useEffect, useState } from "react";
import Navbar from "./components/navbar.js";
import axios from "axios";
import "./scss/home.scss";
import Dropdown from "./components/dropDown.js";
import Form from "./components/form.js";
// import Map from "./components/map.js";

const API = "http://64.226.101.239:8080/emulator"; // API server URL

const Home = () => {
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
        const response = await axios.get(API, {
          headers: {
            "Content-Type": "application/json",
            "X-API-KEY": "track_spot_api_key",
            // 'Access-Control-Allow-Origin': '*'
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

export default Home;
 