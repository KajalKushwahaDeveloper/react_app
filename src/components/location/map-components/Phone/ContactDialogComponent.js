import React, { useEffect, useState } from "react";
import { Dialog, Tabs, Tab, Backdrop, CircularProgress } from "@mui/material";
import ApiService from "../../../../ApiService";
import CloseIcon from "@mui/icons-material/Close";
import { CALL_URL, MESSAGE_URL } from "../../../../constants";
import { a11yProps, TabPanel } from "./a11yProps";
import { ShowHistory } from "./ShowHistory";
import { Device } from "twilio-client";

import { VOICE_GET_TOKEN_URL } from "../../../../constants";
import states from "./twilio/states";
import Phone from "./twilio/Phone";
import { ContactForm } from "./sms/ContactForm";

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

  const [phoneState, setPhoneState] = useState(states.READY);

  useEffect(() => {
    const handleContactData = async (id) => {
      console.log("selectedDevice", selectedDevice);
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
        setLoading(false);
        SetHistoryData(data);
      } else {
        setLoading(false);
        console.log("Error In getting data", "error");
      }
    };

    if (
      selectedDevice &&
      selectedDevice.emulatorId &&
      selectedDevice.emulatorId !== undefined
    ) {
      handleContactData(selectedDevice.emulatorId);
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
      deviceDataModels.push(deviceDataModel)
    });
    setDevicesData(deviceDataModels);
    emulators.map(async (emulator, index) => {
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
          debug: false,
        });
        device.on("ready", () => {
          console.log("device ready");
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
          console.log("device connect", connection);
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
          console.log("device disconnect");
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
          setPhoneState(states.READY)
        });
        device.on("incoming", (connection) => {
          console.log("device Incoming call received : ", connection);
          state = states.INCOMING;
          conn = connection;
          const deviceDataModel = {
            emulatorId: emulator.id,
            token: data,
            state: state,
            conn: conn,
            device: device,
            number: emulator.telephone,
          };
          updateDeviceState(deviceDataModel);
          setPhoneState(states.INCOMING)
          setSelectedDevice((prevState) => ({
            ...prevState,
            open: true,
            dialogType: "call",
            emulatorId: emulator.id,
            index: index,
          }));

          connection.on("reject", () => {
            console.log("device call rejected");
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
            setPhoneState(states.READY)
            setSelectedDevice((prevState) => ({
              ...prevState,
              open: false,
              dialogType: "call",
              emulatorId: emulator.id,
              index: index,
            }));
          });
          
        });
        device.on("cancel", () => {
          console.log("device call cancel");
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
      } else {
        console.log("Error getting token : ", error);
        return null;
      }
    });
  }, [deviceLoader, emulators, selectedDevice, setSelectedDevice, token]);

  const updateDeviceState = (updatedDevice) => {
    setDevicesData((prevDevices) => {
      return prevDevices.map((device) => {
        if (device.emulatorId === updatedDevice.emulatorId) {
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
        {selectedDevice && selectedDevice.emulatorId && (
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
            <TabPanel value={value} index={0} style={{ height: "63%" }}>
            {selectedDevice && selectedDevice.dialogType === "call" ? (
              <Phone
                devices={devices}
                selectedDevice={selectedDevice}
                phoneState = {phoneState}
                setPhoneState = {setPhoneState}
                showToast={showToast}
                />
            ) : (
              <ContactForm
                emulatorId = {selectedDevice.emulatorId}
                showToast = { showToast }
              />
            )}

            </TabPanel>
            <TabPanel
              value={value}
              index={1}
              style={{ height: "63%" }}
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
