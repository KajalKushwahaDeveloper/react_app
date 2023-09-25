import React, { useState } from "react";
import CallEndIcon from "@mui/icons-material/CallEnd";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import MicOffIcon from "@mui/icons-material/MicOff";
import MicIcon from "@mui/icons-material/Mic";
import "../../../scss/calling.scss";
import Phone from "./twilio/Phone";
import { VOICE_GET_TOKEN_URL } from "../../../constants";
import ApiService from "../../../ApiService";

import {
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";


const OutGoingCallDialogBox = ({
  contactName,
  setIsCalling,
  open,
  handleCallingDetails,
}) => {

  const [token, setToken] = useState(null);
  const [clicked, setClicked] = useState(false);
  const identity = "saurabh";

  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(false);

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
    <Dialog open={open} maxWidth="sm" fullWidth>
      
      <DialogTitle>{contactName} kajal kushwaha </DialogTitle>
      <DialogContent>
        {!clicked && <button onClick={handleClick}>Connect to Phone</button>}
        {token ? <Phone token={token}></Phone> : <p>Loading...</p>}

        <div style={{ color: "black" }} className="calling_text">
          Calling...
        </div>

        <div className="outgoing_CenterImage">
          <h3 style={{ color: "white", fontWeight: "900" }}>KK</h3>
        </div>
        <div className="call-controls">
          <div className="call-buttons">
            <div>
              <button
                className="call_buttons"
                onClick={() => setIsMuted(!isMuted)}
                style={{
                  color: "#808080",
                  backgroundColor: isMuted ? "#E9E8E8" : "#ffffff",
                }}
              >
                {isMuted ? <MicOffIcon /> : <MicIcon />}
              </button>
            </div>
            <div>
              <button
                className="call_buttons"
                onClick={() => setIsSpeakerOn(!isSpeakerOn)}
                style={{
                  color: "#808080",
                  backgroundColor: isSpeakerOn ? "#E9E8E8" : "#ffffff",
                }}
              >
                {isSpeakerOn ? <VolumeOffIcon /> : <VolumeUpIcon />}
              </button>
            </div>
            <div>
              <button
                className="call_buttons"
                style={{ backgroundColor: "red" }}
                onClick={endCall}
              >
                <CallEndIcon />
              </button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OutGoingCallDialogBox;
