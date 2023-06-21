import React, { useEffect, useState } from "react";
import Navbar from "./components/navbar.js";
import axios from "axios";
import "./scss/home.scss";
import Dropdown from "./components/dropDown.js";
import Form from "./components/form.js";
import LicenseTable from "./components/table.js";
import PopUp from "./components/popup.js";
import AddUser from "./components/add_user.js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { EMULATOR_URL } from "./constants.js";
import Table2 from "./components/table2.js";

const Home = () => {
  const [emulator, setEmulator] = useState();
  const [emulatorValue, setEmulatorValue] = useState("");
  const [visibleForm, setVisibleForm] = useState(false);
  const [fcmToken, setFcmToken] = useState("");

  // const onEmulatorChange = (e) => {
  //   !visibleForm && setVisibleForm(true);
  //   setEmulatorValue(e.target.value);
  //   // setEmulatorId("");
  // };

  // Define the method to be called
  const showToast = (message, type) => {
    // Your toast logic here
    console.log("Showing toast...");
    toast[type](message); // Use the 'type' argument to determine the toast type
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        console.log("token : ", token);
        const response = await axios.get(EMULATOR_URL, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
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
    <ToastContainer style={{zIndex:3}}/>
      <Navbar />
      <div className="home_div">
        {/* <div>
          {console.log(emulator)}
          <Dropdown
            onEmulatorChange={onEmulatorChange}
            emulatorValue={emulatorValue}
            emulator={emulator}
            setFcmToken={setFcmToken}
          />
        </div> */}

        <div>
          <Table2 showToast={showToast} />
        </div>
        <div className="form_component">
          {visibleForm && <Form fcmToken={fcmToken} />}
        </div>
        <div>
          <PopUp showToast={showToast} />
        </div>
        <div>
          <AddUser />
        </div>
        {/* <div className="add_items">
      <button onClick={onEmulatorChange}>click</button>
      </div> */}
      </div>
    </>
  );
};

export default Home;
