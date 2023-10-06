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

const OnCall = ({ handleHangup, connection }) => {
  const [muted, setMuted] = useState(false);
  const [running, setRunning, loudness] = useLoudness();
  const [showMuteWarning] = useMuteWarning(loudness, running);
  const [isSpeakerOn, setIsSpeakerOn] = useState(null);
  const [isMuted, setIsMuted] = useState(null);

  const handleMute = () => {
    // connection.mute(!muted);
    setMuted(!muted);
    setRunning(!muted);
  };

  const muteWarning = (
    <p className="warning">Are you speaking? You are on mute!</p>
  );

  return (
    <>
      {showMuteWarning && muteWarning}
      <div className="call">
        <div className="buttons-row">
          <div>
            <button
              className="call_buttons"
              onClick={() => setIsMuted(!isMuted)}
              style={{
                backgroundColor: isMuted ? "#E9E8E8" : "#ffffff",
                marginRight: "100px", // Add margin-right for space
              }}
            >
              {isMuted ? <MicOffIcon /> : <MicIcon />}
            </button>
          </div>
          <div>
            <KeypadButton handleClick={handleMute} color="red">
              <CallEndIcon />
            </KeypadButton>
          </div>
          <div>
            <button
              className="call_buttons"
              onClick={() => setIsSpeakerOn(!isSpeakerOn)}
              style={{
                backgroundColor: isSpeakerOn ? "#E9E8E8" : "#ffffff",
                marginLeft: "100px", // Add margin-left for space
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
