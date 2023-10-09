import React, { useState, useEffect } from "react";
import { Device } from "twilio-client";
import Dialler from "./Dialler";
import KeypadButton from "./KeypadButton";
import Incoming from "./Incoming";
import OnCall from "./OnCall";
import "./Phone.css";
import states from "./states";
import FakeState from "./FakeState";

const Phone = ({
  devices,
  selectedDevice,
  incomingDevice,
  setIncomingDevice,
  onCallDevice,
  setOnCallDevice,
}) => {
  const [state, setState] = useState(states.CONNECTING);
  const [number, setNumber] = useState("");
  const [conn, setConn] = useState(null);

  const handleHangup = (device) => {
    device.disconnectAll();
    setOnCallDevice(null);
    setIncomingDevice(null);
  };


  const handleCall = (device) => {
    if (device) {
      device.connect({ To: number });
      setOnCallDevice(device)
      setIncomingDevice(null)
    }
  };

  let render;
  
  if (incomingDevice) {
    render = <Incoming device={incomingDevice}></Incoming>;
  } else if (onCallDevice) {
    render = (
      <OnCall handleHangup={handleHangup} device={onCallDevice}></OnCall>
    );
  } else {
    render = (
      <>
        <Dialler number={number} setNumber={setNumber}></Dialler>
        <div className="call">
          <KeypadButton handleClick={handleCall} color="green">
            Call
          </KeypadButton>
        </div>
      </>
    );
  }
  return (
    <>
      <p className="status">{state}</p>
      {render}
    </>
  );
};

export default Phone;
