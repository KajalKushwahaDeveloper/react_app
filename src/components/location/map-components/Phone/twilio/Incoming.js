import React from "react";

const Incoming = ({ device , acceptConnection, rejectConnection}) => {
  return (
    <>
      <button onClick={acceptConnection}>Accept</button>
      <button onClick={rejectConnection}>Reject</button>
    </>
  );
};

export default Incoming;
