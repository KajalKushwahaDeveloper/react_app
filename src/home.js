import React, { useEffect } from "react";
import Navbar from "./components/navbar.js";

import "./scss/home.scss";

const API = "http://64.226.101.239:8080/emulator"; // API server URL

const fetchApiData = async (url) => {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": "track_spot_api_key",
        "Access-Control-Allow-Origin": "http://localhost:3000/login"
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }

    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.log(error);
  }
};

const Home = () => {
  useEffect(() => {
    fetchApiData(API); // Use the proxy server URL instead of the API server URL
  }, []);

 

  return (
    <>
      <Navbar />
      <div className="home_div">
        <button onClick={Home}>click</button>
      </div>
    </>
  );
};

export default Home;
