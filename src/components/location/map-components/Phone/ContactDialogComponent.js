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
  setContactDialogOptions,
}) {
  const selectedDevice = useEmulatorStore((state) => state.selectedDevice);
  const selectDevice = useEmulatorStore((state) => state.selectDevice);
  const { showToast } = useStates();
  const [tabIndexValue, setTabIndexSelected] = useState(0);
  const [historyData, SetHistoryData] = useState([]);
  const [loader, setLoading] = useState(false);

  useEffect(() => {
    const handleHistory = async () => {
      let id = contactDialogOptions.emulatorId;
      let url = MESSAGE_URL;
      if (contactDialogOptions.dialogType === "call") {
        id = selectedDevice?.emulatorId;
        url = CALL_URL;
      }
      setLoading(true);
      const token = localStorage.getItem("token");
      const { success, data, error } = await ApiService.makeApiCall(
        url,
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
        console.error("Error In getting data", error);
      }
    };
    if (contactDialogOptions && contactDialogOptions.open === true) {
      handleHistory();
    }
  }, [contactDialogOptions, selectedDevice?.emulatorId]);

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
              setTabIndexSelected(0);
              selectDevice(null);
              SetHistoryData(null);
              setContactDialogOptions({
                open: false,
                dialogType: "",
                emulatorId: null,
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
                contactDialogOptions.dialogType === "call" ? "Call" : "Message"
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
            {contactDialogOptions.dialogType === "call" ? (
              <Phone setContactDialogOptions={setContactDialogOptions} />
            ) : (
              <ContactForm
                emulatorId={contactDialogOptions.emulatorId}
                showToast={showToast}
              />
            )}
          </TabPanel>
          <TabPanel value={tabIndexValue} index={1} style={{ height: "63%" }}>
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
