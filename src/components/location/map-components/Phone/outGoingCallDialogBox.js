import React, { useState } from "react";
import "../../../../scss/calling.scss";
import Phone from "./twilio/Phone";
import { VOICE_GET_TOKEN_URL } from "../../../../constants";
import ApiService from "../../../../ApiService";

import {
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";


const OutGoingCallDialogBox = ({
  data,
  emulatorId,
  showToast,
}) => {

  const [token, setToken] = useState(null);
  const [clicked, setClicked] = useState(false);

  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(false);

  const handleClick = async () => {
    setClicked(true);
  };

  return (
    <div>
      <div>
        {!clicked && <button onClick={handleClick}>Connect to Phone</button>}
        {token ? <Phone token={token} emulatorId={token}></Phone> : <p>Loading...</p>}
      </div>
    </div>
  );
};

export default OutGoingCallDialogBox;
