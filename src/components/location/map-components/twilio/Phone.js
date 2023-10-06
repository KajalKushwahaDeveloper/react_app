import React, { useState, useEffect } from "react";
import { Device } from "twilio-client";
import Dialler from "./Dialler";
import KeypadButton from "./KeypadButton";
import Incoming from "./Incoming";
import OnCall from "./OnCall";
import "./Phone.scss";
import states from "./states";
import FakeState from "./FakeState";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import MicOffIcon from "@mui/icons-material/MicOff";
import MicIcon from "@mui/icons-material/Mic";
import DialpadIcon from "@mui/icons-material/Dialpad";

const Phone = ({ token }) => {
  const [state, setState] = useState(states.CONNECTING);
  const [number, setNumber] = useState("");
  const [conn, setConn] = useState(null);
  const [isMuted, setIsMuted] = useState(null);
  const [isSpeakerOn, setIsSpeakerOn] = useState(null);
  const [isDialler, setIsDialler] = useState(false);
  const [device, setDevice] = useState(null);

  useEffect(() => {
    console.log("device token : ", token);
    const device = new Device();
    console.log("device", device);

    device.setup(token, {
      codecPreferences: ["opus", "pcmu"],

      fakeLocalDTMF: true,

      enableRingingState: true,
      debug: true,
    });

    device.on("ready", () => {
      // setDevice(device);
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
      // setDevice(null);
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

  const diallerHandler = () => {
    setIsDialler(!isDialler);
    console.log("dialler");
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
        {isDialler && <Dialler number={number} setNumber={setNumber} handleCall={handleCall}/>}
    
        <div class="twilio_calling">
          <div>
            <button
              className="call_buttons"
              onClick={() => setIsMuted(!isMuted)}
              style={{
                backgroundColor: isMuted ? "#E9E8E8" : "#ffffff",
              }}
            >
              {isMuted ? <MicOffIcon /> : <MicIcon />}
            </button>
          </div>
          <div>
            <button
              className="call_buttons"
              onClick={() => diallerHandler()}
              style={{
                backgroundColor: "#E9E8E8",
              }}
            >
              <DialpadIcon />
            </button>
          </div>
          <div>
            <button
              className="call_buttons"
              onClick={() => setIsSpeakerOn(!isSpeakerOn)}
              style={{
                backgroundColor: isSpeakerOn ? "#E9E8E8" : "#ffffff",
              }}
            >
              {isSpeakerOn ? <VolumeOffIcon /> : <VolumeUpIcon />}
            </button>
          </div>
        </div>
      </>
    );
  }
  return (
    <>
    {/* <Dialler/> */}
      <p className="status">{state}</p>
      {render}
      {/* <OnCall/> */}
      {/* <FakeState
        currentState={state}
        setState={setState}
        setConn={setConn}
      ></FakeState> */}
    </>
  );
};

export default Phone;
