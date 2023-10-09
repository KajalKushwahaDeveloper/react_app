import React, { useState } from "react";
import KeypadButton from "./KeypadButton";
import useLoudness from "./hooks/useLoudness";
import useMuteWarning from "./hooks/useMuteWarning";
import CallEndIcon from "@mui/icons-material/CallEnd";
import MicOffIcon from "@mui/icons-material/MicOff";
import MicIcon from "@mui/icons-material/Mic";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import "./OnCall.css";

const OnCall = ({ handleHangup, device }) => {
  const [muted, setMuted] = useState(false);
  const [running, setRunning, loudness] = useLoudness();
  const [showMuteWarning] = useMuteWarning(loudness, running);
  const [isSpeakerOn, setIsSpeakerOn] = useState(false);

  const handleMute = () => {
    if (device) {
      device.mute(!muted); // Toggle mute state
      setMuted(!muted);
      setRunning(!muted);
    }
  };

  const handleSpeakerToggle = () => {
    // Toggle the speaker state
    setIsSpeakerOn(!isSpeakerOn);
    // Add code to switch between speaker and regular phone audio output (e.g., through Twilio)
    if (device) {
      if (isSpeakerOn) {
        // Turn off speaker
        device.source = "default"; // You may need to use the correct audio source
      } else {
        // Turn on speaker
        device.source = "speaker"; // You may need to use the correct audio source
      }
    }
  };

  const muteWarning = (
    <p className="warning">Are you speaking? You are on mute!</p>
  );

  const declineCall = () => {
    if (device) {
      device.disconnect();
    }
    if (typeof handleHangup === "function") {
      handleHangup();
    }
  };

  return (
    <>
      {showMuteWarning && muteWarning}
      <div className="call">
        <div className="buttons-row">
          <div>
            <button
              className="call_buttons"
              onClick={handleMute}
              style={{
                backgroundColor: muted ? "#E9E8E8" : "#ffffff",
                marginRight: "100px",
              }}
            >
              {muted ? <MicOffIcon /> : <MicIcon />}
            </button>
          </div>
          <div>
            <KeypadButton handleClick={handleMute} color="red">
              <CallEndIcon onClick={declineCall} />
            </KeypadButton>
          </div>
          <div>
            <button
              className="call_buttons"
              onClick={handleSpeakerToggle}
              style={{
                backgroundColor: isSpeakerOn ? "#E9E8E8" : "#ffffff",
                marginLeft: "100px",
              }}
            >
              {isSpeakerOn ? <VolumeOffIcon /> : <VolumeUpIcon />}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default OnCall;