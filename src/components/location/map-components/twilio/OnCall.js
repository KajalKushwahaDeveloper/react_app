import React, { useState } from "react";
import KeypadButton from "./KeypadButton";
import useLoudness from "./hooks/useLoudness";
import useMuteWarning from "./hooks/useMuteWarning";
import CallEndIcon from "@mui/icons-material/CallEnd";
import MicOffIcon from "@mui/icons-material/MicOff";
import MicIcon from "@mui/icons-material/Mic";
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import "./OnCall.css";

const OnCall = ({ handleHangup, connection }) => {
  const [muted, setMuted] = useState(false);
  const [running, setRunning, loudness] = useLoudness();
  const [showMuteWarning] = useMuteWarning(loudness, running);

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
        <div className="call_buttons">
          <KeypadButton handleClick={handleMute} color={muted ? "red" : ""}>
            {muted ? <MicOffIcon /> : <MicIcon />}
          </KeypadButton>
        </div>

        <div className="hang-up">
          <KeypadButton handleClick={handleHangup} color="red">
            <CallEndIcon />
          </KeypadButton>
        </div>
      </div>
    </>
  );
};

export default OnCall;
