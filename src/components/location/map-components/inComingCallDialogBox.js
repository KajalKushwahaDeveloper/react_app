import React, { useState } from "react";
import "../../../scss/calling.scss";
import { Dialog, DialogTitle, DialogContent } from "@mui/material";
import CallEndIcon from "@mui/icons-material/CallEnd";


const InComingCallDialogBox = ({
  contactName,
  setIsCalling,
  open,
  handleCallingDetails,
}) => {


  const endCall = () => {
    setIsCalling(false);
  };

  return (
    <Dialog
    open={open}
    maxWidth="sm"
    fullWidth
    PaperProps={{
      style: {
        position: 'fixed',
        top: 0,
        left: '47%',
        transform: 'translateX(-50%)',
        zIndex: 9999, 
        width: "auto",
        height:"auto",
        padding:"0 2rem",
        borderRadius:"1rem",
      },
    }}
  >
      
      <div className="outgoing_header">

        <DialogTitle>{contactName} kajal kushwaha </DialogTitle>

        <div className="CenterImage">
          <h3>KK</h3>
        </div>

      </div>
      <DialogContent>
        
        <div style={{ color: "black" }} className="calling_text">
          Incoming call...
        </div>

        <div className="call-controls">
          <div className="call-buttons">
          <div>
              <button
                className="incoming_call_buttons"
                style={{ backgroundColor: "red", color: "#ffffff" }}
                onClick={endCall}
              >
                 <CallEndIcon /> 
              </button>
            </div>
            <div>
              <button
                className="incoming_call_buttons"
                // onClick={() => setIsSpeakerOn(!isSpeakerOn)}
                style={{
                  color: "#ffffff",
                  backgroundColor: "green",
                }}
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

export default InComingCallDialogBox;
