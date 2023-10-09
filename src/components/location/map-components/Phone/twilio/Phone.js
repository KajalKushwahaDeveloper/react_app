import React, { useState, useEffect } from "react";
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
  const [phoneState, setPhoneState] = useState(states.READY);
  const [number, setNumber] = useState("");

  var clicked = 0;

  const acceptConnection = () => {
    if (
      devices !== null &&
      selectedDevice !== null &&
      selectedDevice.index !== null
    ) {
      devices[selectedDevice.index].conn.accept();
      setOnCallDevice(devices[selectedDevice.index].device);
      setIncomingDevice(null);
      setPhoneState(states.ON_CALL);
    }
  };

  const rejectConnection = () => {
    console.log("rejectConnection devices : ", devices);
    console.log("rejectConnection selectedDevice : ", selectedDevice);
    if (
      devices !== null &&
      selectedDevice !== null &&
      selectedDevice.index !== null
    ) {
      devices[selectedDevice.index].device.conn.reject();
      setOnCallDevice(null);
      setIncomingDevice(null);
      setPhoneState(states.READY);
    }
  };

  const handleHangup = () => {
    if (clicked < 1) {
      clicked = clicked + 1;
      return;
    }
    if (
      devices !== null &&
      selectedDevice !== null &&
      selectedDevice.index !== null
    ) {
      devices[selectedDevice.index].device.disconnectAll();
      setOnCallDevice(null);
      setIncomingDevice(null);
      setPhoneState(states.READY);
    }
  };

  const handleCall = () => {
    if (
      devices !== null &&
      selectedDevice !== null &&
      selectedDevice.index !== null
    ) {
      devices[selectedDevice.index].device.connect({ To: number });
      setOnCallDevice(devices[selectedDevice.index]);
      setIncomingDevice(null);
      setPhoneState(states.ON_CALL);
    }
  };

  let render;

  if (incomingDevice) {
    render = (
      <Incoming
        device={devices[selectedDevice.index].device}
        acceptConnection={acceptConnection}
        rejectConnection={rejectConnection}
      ></Incoming>
    );
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
      {/* <FakeState
        currentState={state}
        setState={setState}
        setConn={setConn}
      ></FakeState> */}
      {render}
      <p className="status">{phoneState}</p>
    </>
  );
};

export default Phone;
