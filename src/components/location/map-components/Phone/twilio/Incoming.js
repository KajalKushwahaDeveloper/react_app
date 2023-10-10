import React from "react";
import "./incoming.css";
import CallEndIcon from '@mui/icons-material/CallEnd';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';

const Incoming = ({ callerName, acceptConnection, rejectConnection }) => {
  const callerNameFinal = callerName?.parameters?.From ?? "N/A";
 
  return (
    <div className="incoming-container">
      <div className="caller-name">{callerNameFinal}</div>
      <div className="incoming-buttons">
        <button className="accept-button" onClick={acceptConnection}>
        <LocalPhoneIcon/>
        </button>
        <button className="reject-button" onClick={rejectConnection}>
        <CallEndIcon/>
        </button>
      </div>
    </div>
  );
};

export default Incoming;
