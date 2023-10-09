import React, { useState, useEffect } from "react";
import Dialler from "./Dialler";
import KeypadButton from "./KeypadButton";
import Incoming from "./Incoming";
import OnCall from "./OnCall";
import "./Phone.css";
import states from "./states";
import FakeState from "./FakeState";

const Phone = ({ showToast, devices, selectedDevice, phoneState, setPhoneState }) => {
  const [number, setNumber] = useState("");
  const [selectedDeviceToCallWith, setSelectedDeviceToCallWith] = useState(0);
  const acceptConnection = () => {
    if (
      devices !== null &&
      selectedDevice !== null &&
      selectedDevice.index !== null
    ) {
      devices[selectedDevice.index].conn.accept();
      setPhoneState(states.ON_CALL);
    }
  };

  const rejectConnection = () => {
    if (
      devices !== null &&
      selectedDevice !== null &&
      selectedDevice.index !== null
    ) {
      devices[selectedDevice.index].conn.reject();
      setPhoneState(states.READY);
    }
  };

  const handleHangup = () => {
    if (
      devices !== null &&
      selectedDevice !== null &&
      selectedDevice.index !== null
    ) {
      devices[selectedDevice.index].device.disconnectAll();
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
      setPhoneState(states.ON_CALL);
    }
  };

  let render;

  if (phoneState === states.INCOMING) {
    render = (
      <Incoming
        callerName={devices[selectedDevice.index].conn}
        acceptConnection={acceptConnection}
        rejectConnection={rejectConnection}
      ></Incoming>
    );
  } else if (phoneState === states.ON_CALL) {
    render = (
      <OnCall
        handleHangup={handleHangup}
        device={devices[selectedDevice.index].device}
        conn={devices[selectedDevice.index].conn}
      ></OnCall>
    );
  } else {
    render = (
      <>
        <Dialler 
          showToast={showToast} 
          devices={devices} 
          number={number} 
          setNumber={setNumber}
          selectedDeviceToCallWith={selectedDeviceToCallWith}
          setSelectedDeviceToCallWith={setSelectedDeviceToCallWith}
        ></Dialler>
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
      <p className="status">{phoneState}</p>
      {render}
    </>
  );
};

export default Phone;
