import React, { useState } from 'react';
import CallIcon from '@mui/icons-material/Call';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import MicOffIcon from '@mui/icons-material/MicOff';
import MicIcon from '@mui/icons-material/Mic';
import "../../../scss/calling.scss";

const CallingDialogeComponent = ({ contactName ,setIsCalling}) => {

  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(false);

  const endCall = () => {
    setIsCalling(false);

  };

  return (
    <div className="dialogue-box">
      <div className="call_header">
        {contactName} kajal kushwaha
      </div>
      <div style={{color:"black"}} className="calling_text">
         Calling...
      </div>
      <div className="call-controls">
   
          <div className="call-buttons">
            <button
            className="call_buttons"
              onClick={() => setIsMuted(!isMuted)}
              style={{color:"#808080", backgroundColor: isMuted ? '#E9E8E8' : '#ffffff' }}
            >
              {isMuted ? <MicOffIcon/> : <MicIcon/>}
            </button>
            <button
              className="call_buttons"
              onClick={() => setIsSpeakerOn(!isSpeakerOn)}
              style={{ color:"#808080", backgroundColor: isSpeakerOn ? '#E9E8E8' : '#ffffff' }}
            >
              {isSpeakerOn ? <VolumeOffIcon/> : <VolumeUpIcon/>}
            </button>
            <button className="call_buttons" style={{backgroundColor:"red"}} onClick={endCall}><CallIcon/></button>
          </div>
        
      </div>
    </div>
  );

};

export default CallingDialogeComponent;
