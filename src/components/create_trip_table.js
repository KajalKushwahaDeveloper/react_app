import React, { useEffect, useState } from "react";
import SearchBar from "./location/SearchBar.js";
import { CREATE_TRIP_URL } from "../constants.js";
import CloseIcon from "@mui/icons-material/Close";
import "../scss/map.scss";

const CreateTripTable = ({ showToast, selectedEmId, setIsTableVisible }) => {
  const [fromLat, setFromLat] = useState();
  const [fromLong, setFromLong] = useState();
  const [toLat, setToLat] = useState();
  const [toLong, setToLong] = useState();
  const [fromAddress, setFromAddress] = useState();
  const [toAddress, setToAddress] = useState();
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState("");

  const handleTableClose = () => {
    setIsTableVisible(false);
  };

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleAddClick = async () => {
    if (inputValue.trim() === "") {
      setError("Please enter a value in the text field.");
      console.log("Please enter a value in the text field.");
    } else {
      setError("");
      console.log("Text field value:", inputValue);
    }

    console.log("selectedEmId:", selectedEmId);
    const token = localStorage.getItem("token");

    const payload = {
      startLat: fromLat,
      startLong: fromLong,
      endLat: toLat,
      endLong: toLong,
      fromAddress: fromAddress,
      toAddress: toAddress,
      speed: 60,
      emulatorDetailsId: selectedEmId,
    };
    console.log("payload create trip: ", payload);

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
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const errorData = await response.json();
          const errorMessage = errorData.message || "An error occurred";
          console.error("API Error:", errorMessage);
          showToast(errorMessage, "error");
        } else {
          const errorMessage = "Non-JSON error response";
          console.error("API Error:", errorMessage);
          showToast(errorMessage, "error");
        }
      } else {
        showToast("Added successfully", "success");
      }
    } catch (error) {
      console.log("API Error: " + error);
      showToast("An error occurred: " + error.message, "error");
    }
  };

  return (
    <div style={{ width: "40%" }}>
      <div style={{ width: "100%", padding: ".5rem", maxWidth: "100%" }}>
        <table aria-label="custom pagination table">
          <thead>
            <tr>
              <th
                colSpan="2"
                style={{
                  width: "auto",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                Create Trip
                <CloseIcon onClick={handleTableClose} />
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <div className="container" style={{ width: "auto" }}>
                  <SearchBar
                    setLat={setFromLat}
                    setLong={setFromLong}
                    setAddress={setFromAddress}
                    inputValue={inputValue}
                    setInputValue={setInputValue}
                    handleInputChange={handleInputChange}
                  />
                </div>
              </td>
            </tr>
            <tr>
              <td>
                <div className="container" style={{ width: "auto" }}>
                  <SearchBar
                    setLat={setToLat}
                    setLong={setToLong}
                    setAddress={setToAddress}
                    inputValue={inputValue}
                    setInputValue={setInputValue}
                    handleInputChange={handleInputChange}
                  />
                </div>
              </td>
            </tr>
            <tr>
              <td colSpan="2" style={{ textAlign: "center" }}>
                {error && <p className="error">{error}</p>}
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
