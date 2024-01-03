import React, { useEffect, useState } from "react";
import TextField from "@material-ui/core/TextField";
import ApiService from "../../../../ApiService";
import { EMULATOR_NOTE_URL } from "../../../../constants";
import { useStates } from "../../../../StateProvider";
import IconButton from "@material-ui/core/IconButton";
import { InputAdornment } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";

const CustomNoteComponent = ({ emulator }) => {
  console.log("CustomNoteComponent emulator Refreshed");
  const { showToast } = useStates();

  const [noteText, setNoteText] = useState("");

  useEffect(() => {
    setNoteText(emulator?.note);
  }, [emulator]);

  const handleNoteChange = (e) => {
    // Limit the input length to 25 characters
    const newText = e.target.value.slice(0, 25);
    setNoteText(newText);
    console.log("newText:", newText);
  };

  const handleSaveNote = async () => {
    showToast(" Saving Note... ", "info");
    const token = localStorage.getItem("token");
    const payload = { noteText, emulatorId: emulator.id };
    const { success, data, error } = await ApiService.makeApiCall(
      EMULATOR_NOTE_URL,
      "POST",
      payload,
      token
    );
    if (success) {
      showToast(" Note Updated! ", "success");
    } else {
      console.log("Failed to update Note! error:", error);
      showToast(" Failed to update Note! ", "error");
    }
  };

  return (
    <TextField
      label={noteText ? "" : "Add Note"}
      style={{ width: "100%", fontSize: "12px" }}
      value={noteText}
      onChange={handleNoteChange}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton onClick={handleSaveNote}>
              <SaveIcon />
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
};

export default CustomNoteComponent;
