import React from "react";
import { styled } from "@mui/system";

const CreateTable = () => {
  return (
    <div>
     <div sx={{ width: "auto", padding: ".5rem", maxWidth: "100%" }}>
  <table aria-label="custom pagination table">
    <thead>
      <tr>
      <th colSpan="2" style={{ width: "100%" }}> Create Trip</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Row 1</td>
        <td>Row 1, column1</td>
      </tr>
      <tr>
        <td>Row 2</td>
        <td>Row 2, Column 2</td>
      </tr>
      <tr>
      <th colSpan="2" style={{ width: "100%", textAlign:"center" }}>Add</th>
      </tr>
    </tbody>
  </table>
</div>
    </div>
  );
};

export default CreateTable;
