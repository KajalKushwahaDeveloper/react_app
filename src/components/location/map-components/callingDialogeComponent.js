import React, { useState } from "react";
import CallEndIcon from "@mui/icons-material/CallEnd";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import MicOffIcon from "@mui/icons-material/MicOff";
import MicIcon from "@mui/icons-material/Mic";
import "../../../scss/calling.scss";
import {
  Dialog,
  Button,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const CallingDialogeComponent = ({
  contactName,
  setIsCalling,
  open,
  handleCallingDetails,
}) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(false);

  const endCall = () => {
    setIsCalling(false);
  };

  return (
    <Dialog open={open} maxWidth="sm" fullWidth>
      <div>
        <CloseIcon
          style={{ float: "right", cursor: "pointer" }}
          onClick={handleCallingDetails}
        />
      </div>
      <DialogTitle>{contactName} kajal kushwaha </DialogTitle>
      <DialogContent>
        <div style={{ color: "black" }} className="calling_text">
          Calling...
        </div>

        <div className="CenterImage">
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

export default CallingDialogeComponent;
