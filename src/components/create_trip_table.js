import React from "react";
import SearchBar from './location/SearchBar.js';


const CreateTripTable = () => {
  // const [lat, setLat] = useState();
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
              
              <td>
                <div className="container">
                  <SearchBar />
                </div>
              </td>
            </tr>
            <tr>
          
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

export default CreateTripTable;
