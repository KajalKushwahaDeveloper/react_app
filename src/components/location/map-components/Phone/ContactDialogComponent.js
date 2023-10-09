import React, { useEffect, useState } from "react";
import {
  Dialog,
  Tabs,
  Tab,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import ApiService from "../../../../ApiService";
import CloseIcon from "@mui/icons-material/Close";
import {
  CALL_URL,
  MESSAGE_URL,
} from "../../../../constants";
import { a11yProps, TabPanel } from "./a11yProps";
import OutGoingCallDialogBox from "./outGoingCallDialogBox";
import { ShowHistory } from "./ShowHistory";
import { Device } from "twilio-client";

import { VOICE_GET_TOKEN_URL } from "../../../../constants";
import states from "./twilio/states";
import FakeState from "./twilio/FakeState";

function ContactDialogComponent({
  emulators,
  selectedDevice,
  handleContactDialog,
  showToast,
}) {
  const [value, setValue] = useState(0);
  const [historyData, SetHistoryData] = useState([]);
  const [loader, setLoading] = useState(false);

  // const [state, setState] = useState(states.CONNECTING);
  // const [number, setNumber] = useState("");
  // const [conn, setConn] = useState(null);
  // const [device, setDevice] = useState(null);

  const [devices, setDevicesData] = useState([]);

  useEffect(() => {
    console.log("emulators :: ", emulators);
  }, [emulators]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleContactData = async (id) => {
    setLoading(true);
    SetHistoryData([]);
    const token = localStorage.getItem("token");
    const { success, data, error } = await ApiService.makeApiCall(
      selectedDevice.dialogType === "messages" ? MESSAGE_URL : CALL_URL,
      "GET",
      null,
      token,
      id
    );
    if (success) {
      console.log("Data get successfully", data);
      setLoading(false);
      SetHistoryData(data);
    } else {
      setLoading(false);
      console.log("Error In getting data", "error");
    }
  };

  useEffect(() => {
    console.log("selectedDevice : ", selectedDevice);
    selectedDevice && selectedDevice.emulator && selectedDevice.emulator.id !== undefined && handleContactData(selectedDevice.emulator.id);
  }, [selectedDevice]);

  
useEffect(() => {
  if (emulators === null || emulators === undefined) {
    return;
  }

  // Check if devicesData is present and has the same array size as emulators
  if (
   loader
  ) {
    return;
  }
  setLoading(true);

  const token = localStorage.getItem("token");

  // Create an array to store the token data models
  const deviceDataModels = [];

  // Use Promise.all to wait for all API calls to complete
  Promise.all(
    emulators.map(async (emulator) => {
      if (emulator.telephone === null || emulator.telephone === undefined) {
        return null; // Return null for emulators without telephone data
      }
      const { success, data, error } = await ApiService.makeApiCall(
        VOICE_GET_TOKEN_URL,
        "GET",
        null,
        token,
        emulator.telephone
      );

      if (success) {
        var state = states.CONNECTING;
        var conn = null;
        var device = new Device();

        device.setup(data, {
          codecPreferences: ["opus", "pcmu"],
          fakeLocalDTMF: true,
          enableRingingState: true,
          debug: true,
        });

        device.on("ready", () => {
          device = device;
          state = states.READY;
        });

        device.on("connect", (connection) => {
          conn = connection;
          state = states.ON_CALL;
        });
        device.on("disconnect", () => {
          state = states.READY;
          conn = null;
        });
        device.on("incoming", (connection) => {
          console.log("Incoming call received : ", connection);
          state = states.INCOMING;
          conn = connection;
          connection.on("reject", () => {
            state = states.READY;
            conn = null;
          });
        });
        device.on("cancel", () => {
          state = states.READY;
          conn = null;
        });
        device.on("reject", () => {
          state = states.READY;
          conn = null;
        });

        const deviceDataModel = {
          emulatorId: emulator.id,
          token: data,
          state: state, // Replace with the actual state value
          conn: conn, // Replace with the actual state value
          device: device, // Replace with the actual device value
          number: emulator.telephone, // Replace with the actual number value
        };
        deviceDataModels.push(deviceDataModel);
      } else {
        console.log("Error getting token : ", error);
        return null; // Return null for failed calls
      }
    })
  ).then(() => {
    // Update the devicesData state with the array of token data models
    setDevicesData(deviceDataModels);
    console.log("DevicesData", devices);
  });
}, [emulators, selectedDevice]);


  return (
    <div className="ContactDialogContainer">
      <Dialog
        open={selectedDevice.open}
        fullWidth
      >
        <div>
          <CloseIcon
            style={{ float: "right", cursor: "pointer" }}
            onClick={() => handleContactDialog(selectedDevice.dialogType)}
          />
        </div>
        {selectedDevice && selectedDevice.emulator && selectedDevice.emulator.id && (
          <div>
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="basic tabs example"
            >
              <Tab
                label={
                  handleContactDialog && selectedDevice.dialogType === "call"
                    ? "Call"
                    : "Message"
                }
                {...a11yProps(0)}
              />
              <Tab
                label={
                  handleContactDialog && selectedDevice.dialogType === "call"
                    ? "Call History"
                    : "Message History"
                }
                {...a11yProps(1)}
              />
            </Tabs>
            <TabPanel value={value} index={0} style={{ height: "20rem" }}>
              <OutGoingCallDialogBox
                data={selectedDevice}
                emulatorId={selectedDevice.emulator.id}
                showToast={showToast} />

            </TabPanel>
            <TabPanel
              value={value}
              index={1}
              style={{ height: "20rem", overflow: "auto" }}
            >
              <ShowHistory dialogType={selectedDevice.dialogType} data={historyData} />
              <Backdrop
                sx={{
                  color: "#fff",
                  zIndex: (theme) => theme.zIndex.drawer + 1,
                }}
                open={loader}
              >
                <CircularProgress color="inherit" />
              </Backdrop>
            </TabPanel>
          </div>
        )}
      </Dialog>
    </div>
  );
}

export default ContactDialogComponent;
