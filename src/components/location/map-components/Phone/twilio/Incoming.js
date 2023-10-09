import React from "react";
import "./incoming.css";

const Incoming = ({ callerName, acceptConnection, rejectConnection }) => {
  const callerNameFinal = callerName?.parameters?.From ?? "N/A";
 
  return (
    <div className="incoming-container">
      <div className="caller-name">{callerNameFinal}</div>
      <div className="incoming-buttons">
        <button className="accept-button" onClick={acceptConnection}>
          Accept
        </button>
        <button className="reject-button" onClick={rejectConnection}>
          Reject
        </button>
      </div>
    </div>
  );
};

export default Incoming;
