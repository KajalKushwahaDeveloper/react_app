import React, { useState } from "react";
import "../../../scss/calling.scss";
import { Dialog, DialogTitle, DialogContent } from "@mui/material";
import CallEndIcon from "@mui/icons-material/CallEnd";

import Phone from "./twilio/Phone";
import { VOICE_GET_TOKEN_URL } from "../../../constants";
import ApiService from "../../../ApiService";

const InComingCallDialogBox = ({
  contactName,
  setIsCalling,
  open,
  handleCallingDetails,
}) => {

  const [token, setToken] = useState(null);
  const [clicked, setClicked] = useState(false);
  const identity = "saurabh";


  const handleClick = async () => {
    setClicked(true);
    const token = localStorage.getItem("token");
    const { success, data, error } = await ApiService.makeApiCall(
      VOICE_GET_TOKEN_URL,
      "GET",
      null,
      token,
      identity
    );

    if (success) {
      setToken(data)
    } else {
      console.log("Error getting token : ", error);
      // showToast("Error getting token : " + error, "error");
    }
  };

  const endCall = () => {
    setIsCalling(false);
  };

  return (
    <Dialog
    open={open}
    maxWidth="md"
    fullWidth
    PaperProps={{
      style: {
        position: 'fixed',
        top: 0,
        left: '47%',
        transform: 'translateX(-50%)',
        zIndex: 9999, 
        width: "auto",
        height:"auto",
        padding:"0 2rem",
        borderRadius:"1rem",
      },
    }}
  >
      <div className="outgoing_header">
        <DialogTitle>{contactName} kajal kushwaha </DialogTitle>
          <div className="CenterImage">
            <h3>KK</h3>
          </div>
      </div>
      <DialogContent>
        <div style={{ color: "black" }} className="calling_text">
          Incoming call...
        </div>
        <div className="call-controls">
          <div className="call-buttons">
          <div>
            <button
              className="incoming_call_buttons"
              style={{ backgroundColor: "red", color: "#ffffff" }}
              onClick={endCall}
            >
            <CallEndIcon /> 
            </button>
          </div>
          <div>
            <button
              className="incoming_call_buttons"
              // onClick={() => setIsSpeakerOn(!isSpeakerOn)}
              style={{
                color: "#ffffff",
                backgroundColor: "green",
              }}
            >
              <CallEndIcon /> 
            </button>
          </div>
        </div>
      </div>
      {!clicked && <button onClick={handleClick}>Connect to Phone</button>}
      {token ? <Phone token={token}></Phone> : <p>Loading...</p>}
      </DialogContent>
    </Dialog>
  );
};

export default InComingCallDialogBox;
