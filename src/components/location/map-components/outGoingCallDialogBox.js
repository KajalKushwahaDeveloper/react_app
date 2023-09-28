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
  emulatorId,
  selectedPhoneNumber,
  open,
  handleCallingDetails,
}) => {

  const [token, setToken] = useState(null);
  const [clicked, setClicked] = useState(false);

  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(false);

  const handleClick = async () => {
    setClicked(true);
    const token = localStorage.getItem("token");
    console.log("selectedPhoneNumber : ", selectedPhoneNumber);
    const { success, data, error } = await ApiService.makeApiCall(
      VOICE_GET_TOKEN_URL,
      "GET",
      null,
      token,
      selectedPhoneNumber
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
      <DialogTitle>{contactName} CALL </DialogTitle>
      <DialogContent>
        {!clicked && <button onClick={handleClick}>Connect to Phone</button>}
        {token ? <Phone token={token} emulatorId={token}></Phone> : <p>Loading...</p>}
      </DialogContent>
    </Dialog>
  );
};

export default OutGoingCallDialogBox;
