import React, { useEffect, useState } from "react";
import { Dialog, Tabs, Tab, Backdrop, CircularProgress } from "@mui/material";
import ApiService from "../../../../ApiService";
import CloseIcon from "@mui/icons-material/Close";
import { CALL_URL, MESSAGE_URL } from "../../../../constants";
import { a11yProps, TabPanel } from "./a11yProps";
import { ShowHistory } from "./ShowHistory";

import Phone from "./twilio/Phone";
import { ContactForm } from "./sms/ContactForm";
import { useEmulatorStore } from "../../../../stores/emulator/store.tsx";
import { useStates } from "../../../../StateProvider.js";

function ContactDialogComponent({
  contactDialogOptions,
  setIsContactDialogOpen
}) {
  const devices = useEmulatorStore((state) => state.devices);
  const selectedDevice = useEmulatorStore((state) => state.selectedDevice);
  const createDevices = useEmulatorStore((state) => state.createDevices);

  const { staticEmulators, showToast } = useStates();

  useEffect(() => {
    if(staticEmulators !== null) {
      createDevices(staticEmulators);
    }
  }, [createDevices, staticEmulators]);

  useEffect(() => {
    console.log("devices", devices);
    console.log("selectedDevice", selectedDevice);
  }, [devices, selectedDevice]);

  const [tabIndexValue, setTabIndexSelected] = useState(0);
  const [historyData, SetHistoryData] = useState([]);
  const [loader, setLoading] = useState(false);

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

  const handleTabChange = (event, newValue) => {
    setTabIndexSelected(newValue);
  };

  return (
    <div className="ContactDialogContainer">
      <Dialog open={contactDialogOptions.open} fullWidth>
        <div>
          <CloseIcon
            style={{ float: "right", cursor: "pointer" }}
            onClick={() => {
              setIsContactDialogOpen({
                open: false,
                dialogType: ""
              });
            }}
          />
        </div>
        <div>
          <Tabs
            value={tabIndexValue}
            onChange={handleTabChange}
            aria-label="basic tabs example"
          >
            <Tab
              label={
                contactDialogOptions.dialogType === "call"
                  ? "Call"
                  : "Message"
              }
              {...a11yProps(0)}
            />
            <Tab
              label={
                contactDialogOptions.dialogType === "call"
                  ? "Call History"
                  : "Message History"
              }
              {...a11yProps(1)}
            />
          </Tabs>
          <TabPanel value={tabIndexValue} index={0} style={{ height: "63%" }}>
          { contactDialogOptions.dialogType === "call" ? (
            <Phone />
          ) : (
            <ContactForm
              emulatorId = {contactDialogOptions.emulatorId}
              showToast = { showToast }
            />
          )}

          </TabPanel>
          <TabPanel
            value={tabIndexValue}
            index={1}
            style={{ height: "63%" }}
          >
            <ShowHistory
              dialogType={contactDialogOptions.dialogType}
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
      </Dialog>
    </div>
  );
}

export default ContactDialogComponent;
