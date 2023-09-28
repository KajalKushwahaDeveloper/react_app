import React, { useState, useEffect } from "react";
import { Device } from "twilio-client";
import Dialler from "./Dialler";
import KeypadButton from "./KeypadButton";
import Incoming from "./Incoming";
import OnCall from "./OnCall";
import "./Phone.css";
import states from "./states";
import FakeState from "./FakeState";

const Phone = ({ token }) => {
  const [state, setState] = useState(states.CONNECTING);
  const [number, setNumber] = useState("");
  const [conn, setConn] = useState(null);
  const [device, setDevice] = useState(null);

  useEffect(() => {
    console.log("device token : ", token);
    const device = new Device();

    device.setup(token, {
      // Set Opus as our preferred codec. Opus generally performs better, requiring less bandwidth and
      // providing better audio quality in restrained network conditions. Opus will be default in 2.0.
      codecPreferences: ["opus", "pcmu"],
      // Use fake DTMF tones client-side. Real tones are still sent to the other end of the call,
      // but the client-side DTMF tones are fake. This prevents the local mic capturing the DTMF tone
      // a second time and sending the tone twice. This will be default in 2.0.
      fakeLocalDTMF: true,
      // Use `enableRingingState` to enable the device to emit the `ringing`
      // state. The TwiML backend also needs to have the attribute
      // `answerOnBridge` also set to true in the `Dial` verb. This option
      // changes the behavior of the SDK to consider a call `ringing` starting
      // from the connection to the TwiML backend to when the recipient of
      // the `Dial` verb answers.
      enableRingingState: true,
      debug: true,
    });

    device.on("ready", () => {
      setDevice(device);
      setState(states.READY);
    });
    device.on("connect", (connection) => {
      console.log("Connect event");
      setConn(connection);
      setState(states.ON_CALL);
    });
    device.on("disconnect", () => {
      setState(states.READY);
      setConn(null);
    });
    device.on("incoming", (connection) => {
      console.log("Incoming call received : ", connection);
      setState(states.INCOMING);
      setConn(connection);
      connection.on("reject", () => {
        setState(states.READY);
        setConn(null);
      });
    });
    device.on("cancel", () => {
      setState(states.READY);
      setConn(null);
    });
    device.on("reject", () => {
      setState(states.READY);
      setConn(null);
    });

    return () => {
      console.log("device destroyed");
      device.destroy();
      setDevice(null);
      setState(states.OFFLINE);
    };
  }, [token]);

  const handleCall = () => {
    if (device) {
      device.connect({ To: number });
    }
  };

  const handleHangup = () => {
    device.disconnectAll();
  };

  let render;
  if (conn) {
    if (state === states.INCOMING) {
      render = <Incoming device={device} connection={conn}></Incoming>;
    } else if (state === states.ON_CALL) {
      render = <OnCall handleHangup={handleHangup} connection={conn}></OnCall>;
    }
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
      {render}
      <p className="status">{state}</p>
    </>
  );
};

export default Phone;
