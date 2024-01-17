import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import ApiService from "../../../../ApiService";
import { EMULATOR_NOTE_URL } from "../../../../constants";
import { useStates } from "../../../../StateProvider";

const CustomNoteComponent = ({ emulator }) => {
  const { showToast } = useStates();

  const [noteText, setNoteText] = useState(emulator?.note);

  // FIXME: not updating notes correctly.
  const handleNoteChange = (e) => {
    // Limit the input length to 25 characters
    const newText = e.target.value.slice(0, 25);
    setNoteText(newText);
    if (newText !== emulator.note) {
      handleSaveNote(newText);
    }
  };

  const handleSaveNote = async (noteTextParam) => {
    //showToast(" Saving Note... ", "info");
    const token = localStorage.getItem("token");
    const payload = { noteText: noteTextParam, emulatorId: emulator.id };
    const { success, data, error } = await ApiService.makeApiCall(
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
