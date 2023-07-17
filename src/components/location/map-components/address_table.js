import React from "react";

const AddressTable = ({ tripData }) => {
  const fromAddress = tripData?.fromAddress[0]?.long_name + " " + 
  tripData?.fromAddress[1]?.long_name+ " " +  
  tripData?.fromAddress[2]?.long_name + " " + 
  tripData?.fromAddress[3]?.long_name 
  || "N/A";
  const toAddress = tripData?.toAddress[0]?.long_name + " " + 
  tripData?.toAddress[1]?.long_name+ " " +  
  tripData?.toAddress[2]?.long_name + " " + 
  tripData?.toAddress[3]?.long_name 
  || "N/A";

  return (
    <div style={{ width: "auto", maxWidth: "100%" }}>
      <table aria-label="custom pagination table">
        <thead>
          <tr>
            <th>From Address</th>
            <th>To Address</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ width: "auto" }} align="right">
              {fromAddress}
            </td>
            <td style={{ width: "auto" }} align="right">
              {toAddress}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default AddressTable;
