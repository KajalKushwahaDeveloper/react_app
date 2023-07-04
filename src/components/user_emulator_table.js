import React from "react";
import SearchBar from './location/SearchBar.js';
import { styled, TextField } from "@mui/material";

const CreateTable = () => {
  return (
    <div>
      <div sx={{ width: "auto", padding: ".5rem", maxWidth: "100%" }}>
        <table aria-label="custom pagination table">
          <thead>
            <tr>
              <th colSpan="2" style={{ width: "100%" }}>
                {" "}
                Create Trip
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>
                <div className="container">
                  <SearchBar />
                </div>
              </td>
            </tr>
            <tr>
              <td>2</td>
              <td>
                <div className="container">
                  <SearchBar />
                </div>
              </td>
            </tr>
            <tr>
              <th colSpan="2" style={{ width: "100%", textAlign: "center" }}>
                Add
              </th>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CreateTable;
