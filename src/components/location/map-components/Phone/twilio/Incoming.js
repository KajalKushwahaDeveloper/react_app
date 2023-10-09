import React from "react";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import CallEndIcon from "@mui/icons-material/CallEnd";

const Incoming = ({ device }) => {
  const acceptConnection = () => {
    // Make sure that 'device.conn' and 'accept' method are properly defined and functional
    if (device.conn && device.conn.accept) {
      device.conn.accept();
    }
  };

  const rejectConnection = () => {
    // Make sure that 'device.conn' and 'reject' method are properly defined and functional
    if (device.conn && device.conn.reject) {
      device.conn.reject();
    }
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-around",
      }}
    >
      <button
        style={{ backgroundColor: "transparent" }}
        onClick={acceptConnection}
      >
        <LocalPhoneIcon
          style={{
            display: "flex",
            borderRadius: "100%",
            backgroundColor: "green",
            color: "white",
            padding: "5px",
            fontSize: "40px",
          }}
        />
      </button>
      <button
        style={{ backgroundColor: "transparent" }}
        onClick={rejectConnection}
      >
        <CallEndIcon
          style={{
            display: "flex",
            borderRadius: "100%",
            backgroundColor: "red",
            color: "white",
            padding: "5px",
            fontSize: "40px",
          }}
        />
      </button>
    </div>
  );
};

export default Incoming;
