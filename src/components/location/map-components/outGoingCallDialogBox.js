import React, { useState } from "react";
import "../../../scss/calling.scss";
import Phone from "./twilio/Phone";


import {
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";


const OutGoingCallDialogBox = ({
  token,
  contactName,
  open,
}) => {



  return (
    <Dialog open={open} maxWidth="sm" fullWidth >
      <DialogTitle>{contactName} CALL </DialogTitle>
      <DialogContent>
        {token ? <Phone token={token} emulatorId={token}></Phone> : <p>Loading...</p>}
      </DialogContent>
    </Dialog>
  );
};

export default OutGoingCallDialogBox;
