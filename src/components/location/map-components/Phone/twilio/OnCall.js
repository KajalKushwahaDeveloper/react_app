import React, { useState } from "react";
import KeypadButton from "./KeypadButton";
import useLoudness from "./hooks/useLoudness";
import useMuteWarning from "./hooks/useMuteWarning";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import CallEndIcon from "@mui/icons-material/CallEnd";
import "./OnCall.css";

const OnCall = ({ handleHangup, device, conn}) => {
  const [muted, setMuted] = useState(false);
  const [running, setRunning, loudness] = useLoudness();
  const [showMuteWarning] = useMuteWarning(loudness, running);

  const handleMute = () => {
    conn.mute(!muted);
    setMuted(!muted);
    setRunning(!muted);
  };

  const muteIcon = muted ? (
    <MicOffIcon
      style={{
        backgroundColor: "grey",
        borderRadius: "100%",
        padding: "10px",
        fontSize: "3rem",
        color: "white",
        marginTop: "3rem",
      }}
    />
  ) : (
    <MicIcon
      style={{
        backgroundColor: "grey",
        borderRadius: "100%",
        padding: "10px",
        fontSize: "3rem",
        color: "white",
        marginTop: "3rem",
      }}
    />
  );

  const muteWarning = (
    <p className="warning">Are you speaking? You are on mute!</p>
  );

  return (
    <>
      {showMuteWarning && muteWarning}
      <div className="call">
        <div className="buttons-row">
          <div className="call-options">
            <KeypadButton
              handleClick={() => handleMute()}
              className="call-button"
              style={{ backgroundColor: muted ? "red" : "green" }}
            >
              {muteIcon}
            </KeypadButton>
          </div>
          <div className="hang-up">
            <KeypadButton handleClick={() => handleHangup()} className="red">
              <CallEndIcon
                style={{
                  backgroundColor: "red",
                  color: "white",
                  borderRadius: "100%",
                  padding: "10px",
                  fontSize: "3rem",
                  marginTop: "3rem",
                }}
              />
            </KeypadButton>
          </div>
        </div>
      </div>
    </>
  );
};

export default OnCall;
