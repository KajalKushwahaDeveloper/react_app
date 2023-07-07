import React, { useEffect, useState } from "react";
import SearchBar from "./location/SearchBar.js";
import { CREATE_TRIP_URL } from "../constants.js";

const CreateTripTable = ({ showToast,selectedEmId }) => {
  const [fromLat, setFromLat] = useState();
  const [fromLong, setFromLong] = useState();
  const [toLat, setToLat] = useState();
  const [toLong, setToLong] = useState();

  const handleAddClick = async () => {
    console.log("selectedEmId:", selectedEmId);
    const token = localStorage.getItem("token");
    const payload = {
      startLat: fromLat,
      startLong: fromLong,
      endLat: toLat,
      endLong: toLong,
      tripTime: 7200,
      emulatorDetailsId:selectedEmId,
    };
    console.log("payload create trip: " , payload )
  
    try {
      const response = await fetch(CREATE_TRIP_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });


      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.message || "An error occurred";
        console.error("API Error:", errorMessage);
        showToast(errorMessage, "error");
      } else {
        showToast("Added successfully", "success");
      }
    } catch (error) {
      console.log("API Error: " + error);
      showToast("An error occurred", "error");
      console.log("Response:", error.response); 
    }
   
  };

  return (
    <div>
      <div sx={{ width: "auto", padding: ".5rem", maxWidth: "100%" }}>
        <table aria-label="custom pagination table">
          <thead>
            <tr>
              <th colSpan="2" style={{ width: "100%" }}>
                Create Trip
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <div className="container">
                  <SearchBar setLat={setFromLat} setLong={setFromLong} />
                </div>
              </td>
            </tr>
            <tr>
              <td>
                <div className="container">
                  <SearchBar setLat={setToLat} setLong={setToLong} />
                </div>
              </td>
            </tr>
            <tr>
              <th
                onClick={handleAddClick}
                colSpan="2"
                style={{
                  cursor: "pointer",
                  width: "100%",
                  textAlign: "center",
                }}
              >
                Add
              </th>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CreateTripTable;
