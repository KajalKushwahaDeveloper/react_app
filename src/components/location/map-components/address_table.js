import React from "react";

const AddressTable = ({ createTripData }) => {
  const fromAddress = createTripData?.fromAddress[1]?.long_name || "N/A";
  const toAddress = createTripData?.toAddress[0]?.long_name || "N/A";
  const speed = createTripData?.speed || "N/A";

  return (
    <div style={{ width: "auto", maxWidth: "100%" }}>
      <table aria-label="custom pagination table">
        <thead>
          <tr>
            <th>From Address</th>
            <th>To Address</th>
            <th>Speed</th>
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
            <td style={{ width: "auto" }} align="right">
              {speed}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default AddressTable;
