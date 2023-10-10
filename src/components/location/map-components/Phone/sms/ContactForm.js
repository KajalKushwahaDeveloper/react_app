import React, { useState ,useEffect } from "react";
import { TextField, Button } from "@mui/material";
import ApiService from "../../../../../ApiService";
import { MESSAGE_SEND_MSG } from "../../../../../constants";
import UploadFiles from "./components/upload-files.component.js";

export function ContactForm({
  dialogType,
  emulatorId,
  selectedPhoneNumber,
  showToast,
}) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [message, setMessage] = useState("");
  const [messageError, setMessageError] = useState("");
  const [numberError, setPhoneNumberError] = useState("");

  const [fileNames, setFileNames] = useState([]);

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
      console.log("fileNames",fileNames);
      const extractedNames = fileNames.map(file => file.name);

      const payload = {
        emulatorId: emulatorId,
        message: message,
        number: phoneNumber,
        fileNames: extractedNames,
      };
      const token = localStorage.getItem("token");
      const { success, data, error } = await ApiService.makeApiCall(
        MESSAGE_SEND_MSG,
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
    <div>
      <form onSubmit={handleSubmit}>
        {/* Form inputs */}
        <input
          type="text"
          placeholder="Phone Number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
        <textarea
          placeholder="Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <UploadFiles setFileNames={setFileNames} />

        {/* Submit button */}
        <Button type="submit" variant="contained" color="primary">
          SEND
        </Button>
      </form>
    </div>
  );
}
