import React, { useEffect, useState } from "react";
import Dialler from "./Dialler";
import KeypadButton from "./KeypadButton";
import Incoming from "./Incoming";
import OnCall from "./OnCall";
import "./Phone.css";
import states from "./states";
import { useEmulatorStore } from "../../../../../stores/emulator/store.tsx";
import { useStates } from "../../../../../StateProvider.js";

const Phone = ({setContactDialogOptions}) => {
  const selectedDevice = useEmulatorStore((state) => state.selectedDevice);


  useEffect(() => {
    if (selectedDevice === null) {
      setContactDialogOptions({
        open: false,
        dialogType: "",
        emulatorId: null,
      });
    }}, [selectedDevice, setContactDialogOptions]);

  const { showToast } = useStates();

  const [number, setNumber] = useState("");
  const acceptConnection = () => {
    if (selectedDevice !== null && selectedDevice.index !== null) {
      selectedDevice.conn.accept();
    }
  };

  const rejectConnection = () => {
    if (selectedDevice !== null && selectedDevice.index !== null) {
      selectedDevice.conn.reject();
    }
  };

  const handleHangup = () => {
    if (selectedDevice !== null && selectedDevice.index !== null) {
      selectedDevice.device.disconnectAll();
    }
  };

  const handleCall = () => {
    if (selectedDevice !== null && selectedDevice.index !== null) {
      selectedDevice.device.connect({ To: number });
    }
  };

  let render;

  if (selectedDevice === null) {
    render = <p>Something went wrong</p>;
  } else if (selectedDevice?.state === states.INCOMING) {
    render = (
      <Incoming
        callerName={selectedDevice.conn}
        acceptConnection={acceptConnection}
        rejectConnection={rejectConnection}
      ></Incoming>
    );
  } else if (selectedDevice?.state === states.ON_CALL) {
    render = (
      <OnCall
        handleHangup={handleHangup}
        device={selectedDevice.device}
        conn={selectedDevice.conn}
        showToast={showToast}
      ></OnCall>
    );
  } else {
    render = (
      <>
        <Dialler number={number} setNumber={setNumber} />
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
      <p className="status">
        {selectedDevice?.number + " : " + selectedDevice?.state}
      </p>
      {render}
    </>
  );
};

export default Phone;
