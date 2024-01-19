import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import ApiService from "../../../../ApiService";
import { EMULATOR_NOTE_URL } from "../../../../constants";
import { useStates } from "../../../../StateProvider";

const CustomNoteComponent = ({ emulator }) => {
  const { showToast } = useStates();

  const [noteText, setNoteText] = useState(emulator?.note? emulator.note : "");
  const [timerId, setTimerId] = useState(null);
 
  const handleNoteChange = (e) => {
    const newText = e.target.value
    setNoteText(newText);
  
    // Clear the previous timer
    if (timerId) {
      clearTimeout(timerId);
    }
  
    // Set a new timer
    setTimerId(setTimeout(() => {
        handleSaveNote(newText);
    }, 2000));  // Wait for 2 seconds
  };
  
  useEffect(() => {
    return () => {
      // Cleanup the timer when the component is unmounted
      if (timerId) {
        clearTimeout(timerId);
      }
    };
  }, [timerId]);

  const handleSaveNote = async (newText) => {
    showToast(" Saving Note... ", "info");
    const token = localStorage.getItem("token");
    const payload = { noteText: newText, emulatorId: emulator.id };
    const { success } = await ApiService.makeApiCall(
      EMULATOR_NOTE_URL,
      "POST",
      payload,
      token
    );
    if (success) {
      showToast("Note Updated! ", "success");
    } else {
      showToast(" Failed to update Note! ", "error");
    }
  };

  return (
    <TextField
      style={{ width: "100%", padding: "0px 10px" }}
      label={noteText ? "" : "Add Note"}
      variant="outlined"
      value={noteText}
      onChange={handleNoteChange}
      size="small"
    />
  );
};

export default CustomNoteComponent;
