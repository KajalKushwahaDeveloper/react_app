import React, { useEffect, useState } from "react";
import {
  Dialog,
  Tabs,
  Tab,
  Typography,
  Box,
  TextField,
  Button,
  List,
  Grid,
  Card,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import PropTypes from "prop-types";
import ApiService from "../../../ApiService";
import {
  CALL_URL,
  MESSAGE_URL,
  MESSAGE_SEND_MSG,
  CALL_MAKE_CALL,
} from "../../../constants";

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function ContactForm({ dialogType, emulatorId, showToast }) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [message, setMessage] = useState("");
  const [phoneNumberError, setPhoneNumberError] = useState("");
  const [messageError, setMessageError] = useState("");

  const validatePhoneNumber = (number) => {
    if (!number) {
      setPhoneNumberError("Phone number is required.");
      return false;
    }

    if (number.replace(/\D/g, "").length > 13) {
      setPhoneNumberError("Phone number is too long.");
      return false;
    }

    setPhoneNumberError("");
    return true;
  };

  const validateMessage = (text) => {
    if (!text) {
      setMessageError("Message is required.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validatePhoneNumber(phoneNumber) && validateMessage(message)) {
      const payload = {
        emulatorId: emulatorId,
        message: message,
        number: phoneNumber,
      };
      const token = localStorage.getItem("token");
      const { success, data, error } = await ApiService.makeApiCall(
        dialogType === "messages" ? MESSAGE_SEND_MSG : CALL_MAKE_CALL,
        "POST",
        payload,
        token,
        null
      );
      if (success) {
        setPhoneNumber("");
        setMessage("");
        setPhoneNumberError("");
        setMessageError("");
        showToast("Data submit Successfully", "success");
      } else if (error) {
        showToast(`error: ${error.message}`, "error");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        label="Phone Number"
        variant="outlined"
        fullWidth
        margin="normal"
        type="number"
        value={phoneNumber}
        onChange={(event) => {
          setPhoneNumber(event.target.value);
          setPhoneNumberError("");
        }}
        error={!!phoneNumberError}
        helperText={phoneNumberError}
      />
      <TextField
        id="outlined-multiline-static"
        label="Message"
        multiline
        rows={4}
        fullWidth
        value={message}
        onChange={(event) => {
          setMessage(event.target.value);
          setMessageError("");
        }}
        error={!!messageError}
        helperText={messageError}
      />
      <div style={{ marginTop: "1rem" }}>
        <Button type="Submit" variant="contained" fullWidth>
          Submit
        </Button>
      </div>
    </form>
  );
}

function ShowHistory({ dialogType, data }) {
  console.log("check ShowHistory", dialogType, data);
  return (
    <div>
      {data.length ? (
        dialogType === "call" ? (
          data.map((callData) => {
            return (
              <List style={{ paddingTop: "5px", paddingBottom: "5px" }}>
                <Card
                  style={{ padding: "0.5rem", boxShadow: "0px 0px 8px -4px" }}
                >
                  <Grid container>
                    <Grid
                      item
                      xs={6}
                      display={"flex"}
                      direction={"row"}
                      gap={1}
                    >
                      <Typography fontWeight={800}>From:</Typography>
                      <Typography fontWeight={400}>{callData.from}</Typography>
                    </Grid>
                    <Grid
                      item
                      xs={6}
                      display={"flex"}
                      direction={"row"}
                      gap={1}
                    >
                      <Typography fontWeight={800}>To:</Typography>
                      <Typography fontWeight={400}>{callData.to}</Typography>
                    </Grid>
                  </Grid>
                  <Grid container>
                    <Grid
                      item
                      xs={6}
                      display={"flex"}
                      direction={"row"}
                      gap={1}
                    >
                      <Typography fontWeight={800}>Start Time:</Typography>
                      <Typography fontWeight={400}>
                        {new Date(callData.startTime).toLocaleTimeString()}
                      </Typography>
                    </Grid>
                    <Grid
                      item
                      xs={6}
                      display={"flex"}
                      direction={"row"}
                      gap={1}
                    >
                      <Typography fontWeight={800}>End Time:</Typography>
                      <Typography fontWeight={400}>
                        {new Date(callData.endTime).toLocaleTimeString()}
                      </Typography>
                    </Grid>
                  </Grid>
                  <Grid container>
                    <Grid
                      item
                      xs={6}
                      display={"flex"}
                      direction={"row"}
                      gap={1}
                    >
                      <Typography fontWeight={800}>Duration:</Typography>
                      <Typography fontWeight={400}>
                        {callData.duration}
                      </Typography>
                    </Grid>
                    <Grid
                      item
                      xs={6}
                      display={"flex"}
                      direction={"row"}
                      gap={1}
                    >
                      <Typography fontWeight={800}>Status:</Typography>
                      <Typography fontWeight={400}>
                        {callData.status}
                      </Typography>
                    </Grid>
                  </Grid>
                  <Grid container>
                    <Grid
                      item
                      xs={6}
                      display={"flex"}
                      direction={"row"}
                      gap={1}
                    >
                      <Typography fontWeight={800}>AnsweredBy:</Typography>
                      <Typography fontWeight={400}>
                        {callData.answeredBy === null
                          ? "N/A"
                          : callData.answeredBy}
                      </Typography>
                    </Grid>
                    <Grid
                      item
                      xs={6}
                      display={"flex"}
                      direction={"row"}
                      gap={1}
                    >
                      <Typography fontWeight={800}>Price:</Typography>
                      <Typography fontWeight={400}>
                        {callData.price + "" + callData.priceUnit}
                      </Typography>
                    </Grid>
                  </Grid>
                  <Grid container>
                    <Grid
                      item
                      xs={6}
                      display={"flex"}
                      direction={"row"}
                      gap={1}
                    >
                      <Typography fontWeight={800}>Direction:</Typography>
                      <Typography fontWeight={400}>
                        {callData.direction}
                      </Typography>
                    </Grid>
                    <Grid
                      item
                      xs={6}
                      display={"flex"}
                      direction={"row"}
                      gap={1}
                    >
                      <Typography fontWeight={800}>Caller Name:</Typography>
                      <Typography fontWeight={400}>
                        {callData.callerName === null || callData.callerName === ""  ? "N/A" : callData.callerName}
                      </Typography>
                    </Grid>
                  </Grid>
                </Card>
              </List>
            );
          })
        ) : dialogType === "messages" ? (
          data.map((msgData) => {
            return (
              <List style={{ paddingTop: "5px", paddingBottom: "5px" }}>
                <Card
                  style={{ padding: "0.5rem", boxShadow: "0px 0px 8px -4px" }}
                >
                  <Grid container>
                    <Grid
                      item
                      xs={6}
                      display={"flex"}
                      direction={"row"}
                      gap={1}
                    >
                      <Typography fontWeight={800}>From:</Typography>
                      <Typography fontWeight={400}>{msgData.from}</Typography>
                    </Grid>
                    <Grid
                      item
                      xs={6}
                      display={"flex"}
                      direction={"row"}
                      gap={1}
                    >
                      <Typography fontWeight={800}>To:</Typography>
                      <Typography fontWeight={400}>{msgData.to}</Typography>
                    </Grid>
                  </Grid>
                  <Grid container>
                    <Grid
                      item
                      xs={6}
                      display={"flex"}
                      direction={"row"}
                      gap={1}
                    >
                      <Typography fontWeight={800}>Sent Date:</Typography>
                      <Typography fontWeight={400}>
                        {new Date(msgData.dateSent).toLocaleTimeString()}
                      </Typography>
                    </Grid>
                    <Grid
                      item
                      xs={6}
                      display={"flex"}
                      direction={"row"}
                      gap={1}
                    >
                      <Typography fontWeight={800}>Sent Time:</Typography>
                      <Typography fontWeight={400}>
                        {new Date(msgData.dateSent).toLocaleDateString()}
                      </Typography>
                    </Grid>
                  </Grid>
                  <Grid container>
                    <Grid
                      item
                      xs={6}
                      display={"flex"}
                      direction={"row"}
                      gap={1}
                    >
                      <Typography fontWeight={800}>Status:</Typography>
                      <Typography fontWeight={400}>{msgData.status}</Typography>
                    </Grid>
                    <Grid
                      item
                      xs={6}
                      display={"flex"}
                      direction={"row"}
                      gap={1}
                    >
                      <Typography fontWeight={800}>Durations:</Typography>
                      <Typography fontWeight={400}>
                        {msgData.direction}
                      </Typography>
                    </Grid>
                  </Grid>
                  <Grid container>
                    <Grid
                      item
                      xs={6}
                      display={"flex"}
                      direction={"row"}
                      gap={1}
                    >
                      <Typography fontWeight={800}>Price:</Typography>
                      <Typography fontWeight={400}>
                        {msgData.price + "" + msgData.priceUnit}
                      </Typography>
                    </Grid>
                  </Grid>
                  <Grid container>
                    <Grid item xs={12} display={"flex"} gap={1}>
                      <Typography fontWeight={800}>Message:</Typography>
                      <Typography fontWeight={400}>{msgData.body}</Typography>
                    </Grid>
                  </Grid>
                </Card>
              </List>
            );
          })
        ) : null
      ) : (
        <Typography fontSize={20} display={"flex"} justifyContent={"center"}>
          No history found at present.
        </Typography>
      )}
    </div>
  );
}

function ContactDialogComponent({
  handleContactDialog,
  dialogType,
  open,
  emulatorId,
  showToast,
}) {
  const [value, setValue] = useState(0);
  const [data, SetData] = useState([]);
  const [loader, setLoading] = useState(false);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleContactData = async (id) => {
    setLoading(true);
    SetData([]);
    const token = localStorage.getItem("token");
    const { success, data, error } = await ApiService.makeApiCall(
      dialogType === "messages" ? MESSAGE_URL : CALL_URL,
      "GET",
      null,
      token,
      id
    );
    if (success) {
      console.log("Data get successfully", data);
      setLoading(false);
      SetData(data);
    } else {
      setLoading(false);
      console.log("Error In getting data", "error");
    }
  };

  useEffect(() => {
    emulatorId !== undefined && handleContactData(emulatorId);
  }, [emulatorId]);

  return (
    <div className="ContactDialogContainer">
      <Dialog
        open={open}
        onClose={() => handleContactDialog(dialogType)}
        fullWidth
      >
        {handleContactDialog && (
          <div>
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="basic tabs example"
            >
              <Tab
                label={
                  handleContactDialog && dialogType === "call"
                    ? "Call"
                    : "Message"
                }
                {...a11yProps(0)}
              />
              <Tab
                label={
                  handleContactDialog && dialogType === "call"
                    ? "Call History"
                    : "Message History"
                }
                {...a11yProps(1)}
              />
            </Tabs>
            <TabPanel value={value} index={0} style={{ height: "20rem" }}>
              <ContactForm
                dialogType={dialogType}
                emulatorId={emulatorId}
                showToast={showToast}
              />
            </TabPanel>
            <TabPanel
              value={value}
              index={1}
              style={{ height: "20rem", overflow: "auto" }}
            >
              <ShowHistory dialogType={dialogType} data={data} />
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
