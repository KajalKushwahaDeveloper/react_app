import React, { useState, useEffect} from "react";
import "../../../../scss/calling.scss";
import { VOICE_GET_TOKEN_URL } from "../../../../constants";
import ApiService from "../../../../ApiService";

import {
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";


const OutGoingCallDialogBox = ({
  selectedDevice,
  devices,
  showToast,
}) => {

  useEffect(() => {
    console.log("devices : ", devices);
  }, [devices]);

  useEffect(() => {
    console.log("selectedDevice : ", selectedDevice);
  }, [selectedDevice]);


  return (
    <div>
      <div>
      </div>
    </div>
  );
};

export default OutGoingCallDialogBox;
