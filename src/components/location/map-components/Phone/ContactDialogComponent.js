import React, { useEffect, useState } from "react";
import { Dialog, Tabs, Tab, Backdrop, CircularProgress } from "@mui/material";
import ApiService from "../../../../ApiService";
import CloseIcon from "@mui/icons-material/Close";
import { CALL_URL, MESSAGE_URL } from "../../../../constants";
import { a11yProps, TabPanel } from "./a11yProps";
import ShowHistory from "./ShowHistory.js";
import { Device } from "twilio-client";

import { VOICE_GET_TOKEN_URL } from "../../../../constants";
import states from "./twilio/states";
import Phone from "./twilio/Phone";

function ContactDialogComponent({
  emulators,
  selectedDevice,
  setSelectedDevice,
  handleContactDialog,
  showToast,
}) {
  const [value, setValue] = useState(0);
  const [historyData, SetHistoryData] = useState([]);
  const [loader, setLoading] = useState(false);
  const [deviceLoader, setDeviceLoader] = useState(false);

  const [devices, setDevicesData] = useState([]);

  const token = localStorage.getItem("token");

  const [incomingDevice, setIncomingDevice] = useState(null);
  const [onCallDevice, setOnCallDevice] = useState(null);

  useEffect(() => {
    if (devices !== null || devices !== undefined)
      devices.forEach((device) => {
        if (device.state === states.INCOMING) {
          setIncomingDevice(device);
          const incomingEmulatorIndex = emulators.findIndex(
            (emulator) => emulator.id === device.emulatorId
          );
          setSelectedDevice((prevState) => ({
            ...prevState,
            open: !prevState.open,
            emulator: emulators[incomingEmulatorIndex],
            index: incomingEmulatorIndex,
          }));
          return;
        }
      });
  }, [devices, emulators, setSelectedDevice]);

  useEffect(() => {
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

    console.log("selectedDevice : ", selectedDevice);
    if (
      selectedDevice &&
      selectedDevice.emulator &&
      selectedDevice.emulator.id !== undefined
    ) {
      handleContactData(selectedDevice.emulator.id);
    }
  }, [selectedDevice]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    if (emulators === null || emulators === undefined) {
      return;
    }
    if (deviceLoader) {
      return;
    }
    setDeviceLoader(true);
    const deviceDataModels = [];
    emulators.forEach((emulator) => {
      const deviceDataModel = {
        emulatorId: emulator.id,
        token: "",
        state: states.CONNECTING,
        conn: null,
        device: null,
        number: emulator.telephone,
      };
    });
    setDevicesData(deviceDataModels);
    emulators.map(async (emulator) => {
      var state = states.CONNECTING;
      var conn = null;
      var device = new Device();

      if (emulator.telephone === null || emulator.telephone === undefined) {
        return null;
      }
      const { success, data, error } = await ApiService.makeApiCall(
        VOICE_GET_TOKEN_URL,
        "GET",
        null,
        token,
        emulator.telephone
      );

      if (success) {
        device.setup(data, {
          codecPreferences: ["opus", "pcmu"],
          fakeLocalDTMF: true,
          enableRingingState: true,
          debug: true,
        });
        device.on("ready", () => {
          state = states.READY;
          const deviceDataModel = {
            emulatorId: emulator.id,
            token: data,
            state: state,
            conn: conn,
            device: device,
            number: emulator.telephone,
          };
          updateDeviceState(deviceDataModel);
        });
        device.on("connect", (connection) => {
          conn = connection;
          state = states.ON_CALL;
          const deviceDataModel = {
            emulatorId: emulator.id,
            token: data,
            state: state,
            conn: conn,
            device: device,
            number: emulator.telephone,
          };
          updateDeviceState(deviceDataModel);
        });
        device.on("disconnect", () => {
          state = states.READY;
          conn = null;
          const deviceDataModel = {
            emulatorId: emulator.id,
            token: data,
            state: state,
            conn: conn,
            device: device,
            number: emulator.telephone,
          };
          updateDeviceState(deviceDataModel);
        });
        device.on("incoming", (connection) => {
          console.log("Incoming call received : ", connection);
          state = states.INCOMING;
          conn = connection;
          connection.on("reject", () => {
            state = states.READY;
            conn = null;
          });
          const deviceDataModel = {
            emulatorId: emulator.id,
            token: data,
            state: state,
            conn: conn,
            device: device,
            number: emulator.telephone,
          };
          updateDeviceState(deviceDataModel);
        });
        device.on("cancel", () => {
          state = states.READY;
          conn = null;
          const deviceDataModel = {
            emulatorId: emulator.id,
            token: data,
            state: state,
            conn: conn,
            device: device,
            number: emulator.telephone,
          };
          updateDeviceState(deviceDataModel);
        });
        device.on("reject", () => {
          state = states.READY;
          conn = null;
          const deviceDataModel = {
            emulatorId: emulator.id,
            token: data,
            state: state,
            conn: conn,
            device: device,
            number: emulator.telephone,
          };
          updateDeviceState(deviceDataModel);
        });
        const deviceDataModel = {
          emulatorId: emulator.id,
          token: data,
          state: state,
          conn: conn,
          device: device,
          number: emulator.telephone,
        };
        deviceDataModels.push(deviceDataModel);
      } else {
        console.log("Error getting token : ", error);
        return null;
      }
    });
  }, [deviceLoader, emulators, selectedDevice, token]);

  const updateDeviceState = (updatedDevice) => {
    setDevicesData((prevDevices) => {
      return prevDevices.map((device) => {
        console.log("updating device states 1 ", device);
        console.log("updating device states 2 ", updatedDevice);
        if (device.emulatorId === updatedDevice.emulatorId) {
          // Update the state of the matching device
          return { ...device, ...updatedDevice };
        }
        return device;
      });
    });
  };

  return (
    <div className="ContactDialogContainer">
      <Dialog open={selectedDevice.open} fullWidth>
        <div>
          <CloseIcon
            style={{ float: "right", cursor: "pointer" }}
            onClick={() => handleContactDialog(selectedDevice.dialogType)}
          />
        </div>
        {selectedDevice &&
          selectedDevice.emulator &&
          selectedDevice.emulator.id && (
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
              <TabPanel value={value} index={0} style={{ height:"100vh"}}>
                <Phone
                  devices={devices}
                  selectedDevice={selectedDevice}
                  incomingDevice={incomingDevice}
                  setIncomingDevice={setIncomingDevice}
                  onCallDevice={onCallDevice}
                  setOnCallDevice={setOnCallDevice}
                ></Phone>
              </TabPanel>
              <TabPanel
                value={value}
                index={1}
                style={{ height: "auto"}}
              >
                <ShowHistory
                  dialogType={selectedDevice.dialogType}
                  data={historyData}
                />
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
