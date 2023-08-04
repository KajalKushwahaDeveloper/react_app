import React from "react";

const AddressTable = ({ tripData }) => {
 
  const fromAddress =
    tripData?.fromAddress[0]?.long_name +
    ", " +
    tripData?.fromAddress[1]?.long_name +
    ", " +
    tripData?.fromAddress[2]?.long_name +
    ", " +
    tripData?.fromAddress[3]?.long_name ||
    "N/A";
  const toAddress =
    tripData?.toAddress[0]?.long_name +
    ", " +
    tripData?.toAddress[1]?.long_name +
    ", " +
    tripData?.toAddress[2]?.long_name +
    " ," +
    tripData?.toAddress[3]?.long_name ||
    "N/A";
    const timeInHours = tripData?.distance / tripData?.velocity;
    const hours = Math.floor(timeInHours);
    const minutes = Math.round((timeInHours - hours) * 60);
    const totalTime = `~${hours} hours and ${minutes} minutes`;
    
  return (
    <div style={{ width: "20%", maxWidth: "70%",position:"fixed",bottom:"0"}}>
      <table aria-label="custom pagination table">
        <thead>
          <tr>
            <th>From Address</th>
            <th>To Address</th>
            <th>Total Time</th>
          </tr>
        </thead>
        <tbody style={{ width: "auto" }}>
          <tr>
            <td align="right" style={{ wordWrap: "break-word" }}>
              {fromAddress}
            </td>
            <td align="right" style={{ wordWrap: "break-word" }}>
              {toAddress}
            </td>
            <td align="right" style={{ wordWrap: "break-word" }}>
             {totalTime}
    
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default AddressTable;