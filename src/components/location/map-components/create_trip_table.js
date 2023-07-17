import React, { useEffect, useState } from "react";
import SearchBar from "../SearchBar.js";
import { CREATE_TRIP_URL } from "../../../constants.js";
import CloseIcon from "@mui/icons-material/Close";
import ApiService from "../../../ApiService.js";
import { Login } from "@mui/icons-material";


const CreateTripTable = ({ showToast, selectedEmId, setIsTableVisible,setUpdatedTripPath, setSelectedEmId }) => {
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
    
    if ((!fromLat && !fromLong) || (!toLat && !toLong)) {
      setError("Please fill both locations.");
      return;
    }
  
    setError("");

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

    const { success, data, error } = await ApiService.makeApiCall(
      CREATE_TRIP_URL,
      "POST",
      payload,
      token
    );
    if (success) {
      showToast("Added successfully // TODO HANDLE CHANGES TO MAP", "success");
      setSelectedEmId(0);
      setSelectedEmId(selectedEmId);
    } else {
      showToast(error, "error");
    }

    setIsTableVisible(false);
  };
console.log("selectedEmId......:", selectedEmId);
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
                    {error && <p className="error">{error}</p>}
                </div>
              </td>
            </tr>
            <tr>
              <td colSpan="2" style={{ textAlign: "center" }}>
              
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
