import React from "react";
import "../scss/map.scss";
const CurrentLocation = () => {
  return (
    <div>
      <div sx={{ width: "auto",padding:".5rem" ,  maxWidth: "100%" }}>
        <table aria-label="custom pagination table">
          <thead>
            <tr >
              <th>Current Location</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>225 w ADAMS ST, CHICAGO, IL 60608</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CurrentLocation;
