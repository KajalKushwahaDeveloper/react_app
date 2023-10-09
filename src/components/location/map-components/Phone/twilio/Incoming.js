import React from "react";

const Incoming = ({ device }) => {
  const acceptConnection = () => {
    device.conn.accept();
  };
  const rejectConnection = () => {
    device.conn.reject();
  };
  return (
    <>
      <button onClick={acceptConnection}>Accept</button>
      <button onClick={rejectConnection}>Reject</button>
    </>
  );
};

export default Incoming;
