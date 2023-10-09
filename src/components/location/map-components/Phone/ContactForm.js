import React, { useState } from "react";
import {
  TextField,
  Button
} from "@mui/material";
import ApiService from "../../../../ApiService";
import {
  MESSAGE_SEND_MSG,
  CALL_MAKE_CALL
} from "../../../../constants";
import OutGoingCallDialogBox from "../outGoingCallDialogBox";

export function ContactForm({ dialogType, emulatorId, selectedPhoneNumber, showToast }) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [message, setMessage] = useState("");
  const [phoneNumberError, setPhoneNumberError] = useState("");
  const [messageError, setMessageError] = useState("");

  const [showCallingDialog, setShowCallingDialog] = useState(false);

  const handleCallButtonClick = () => {
    setShowCallingDialog(true);
  };

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

  const handleCallingDetails = (emulatorId) => {
    setShowCallingDialog(false);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div
          style={{
            marginTop: "1rem",
            display: "flex",
            gap: "1rem",
            float: "right",
          }}
        >
          <Button
            type="Submit"
            style={{
              backgroundColor: "#007dc6",
              color: "white",
            }}
          >
            Submit
          </Button>

          <div className="call-controls">
            <Button
              onClick={handleCallButtonClick}
              type="button"
              style={{
                backgroundColor: "green",
                color: "white",
              }}
            >
              Call
            </Button>
          </div>
        </div>
      </form>

      {/* outgoing ui */}
      {showCallingDialog && (
        <OutGoingCallDialogBox
          open={setShowCallingDialog}
          selectedPhoneNumber={selectedPhoneNumber}
          emulatorId={emulatorId}
          handleCallingDetails={handleCallingDetails} />
      )}
    </div>
  );
}
