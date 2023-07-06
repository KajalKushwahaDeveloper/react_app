import React, { useEffect, useState } from "react";
import SearchBar from "./location/SearchBar.js";

const CreateTripTable = () => {
  const [fromLat, setFromLat] = useState();
  const [fromLong, setFromLong] = useState();
  const [toLat, setToLat] = useState();
  const [toLong, setToLong] = useState();

  useEffect(() => {
    if (fromLat != null || fromLat != undefined) {
      setFromLat(fromLat);
    }
    if (fromLong != null || fromLong != undefined) {
      setFromLong(fromLong);
    }
    if (toLat != null || toLat != undefined) {
      setToLat(toLat);
    }
    if (toLong != null || toLong != undefined) {
      setToLong(toLong);
    }
  }, [fromLat, fromLong, toLat, toLong]);

  const handleAddClick = () => {
    
    setFromLat(fromLat);
    setFromLong(fromLong);
    setToLat(toLat);
    setToLong(toLong);
    
    // console.log("create trip fromLat :" + fromLat)
    // console.log("create trip  fromLong:" + fromLong)
    // console.log("create trip fromLat :" + toLat)
    // console.log("create trip  fromLong:" + toLong)
  }

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
              <th onClick = {handleAddClick} colSpan="2" style={{ cursor:"pointer", width: "100%", textAlign: "center" }}>
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
