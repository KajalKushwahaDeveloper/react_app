import React, { useEffect, useState } from "react";
import Modal from "@material-ui/core/Modal";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import ApiService from "../../../../ApiService";
import { EMULATOR_NOTE_URL, EMULATOR_URL } from "../../../../constants";
import { useStates } from "../../../../StateProvider";
import CloseIcon from "@mui/icons-material/Close";
import { inputLabelClasses } from "@mui/material/InputLabel";

import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";

const CustomNotesModal = ({
  open,
  selectedEmulatorIdForNotes,
  setOpenCustomNotesModal,
  setSelectedEmulatorIdForNotes,
}) => {
  const { showToast } = useStates();

  const [noteText, setNoteText] = useState("");

  /*  const classes = useStyles(); */

  useEffect(() => {
    const getNote = async () => {
      const token = localStorage.getItem("token");
      const { success, data, error } = await ApiService.makeApiCall(
        EMULATOR_URL,
        "GET",
        null,
        token,
        selectedEmulatorIdForNotes
      );
      if (success) {
        console.log("NOTE data:", data);
        console.log("NOTE data:", data.note);
        setNoteText(data.note);
      } else {
        console.log("Failed to get Note! error:", error);
      }
    };

    if (
      selectedEmulatorIdForNotes != null &&
      selectedEmulatorIdForNotes !== undefined
    ) {
      getNote();
    }
  }, [selectedEmulatorIdForNotes]);

  const handleNoteChange = (e) => {
    // Limit the input length to 25 characters
    const newText = e.target.value.slice(0, 25);
    setNoteText(newText);
    console.log("newText:", newText);
  };

  const handleSaveNote = async () => {
    const token = localStorage.getItem("token");
    const payload = { noteText, emulatorId: selectedEmulatorIdForNotes };
    const { success, data, error } = await ApiService.makeApiCall(
      EMULATOR_NOTE_URL,
      "POST",
      payload,
      token
    );
    if (success) {
      showToast(" Note Updated! ", "success");
      setOpenCustomNotesModal(false);
    } else {
      console.log("Failed to update Note! error:", error);
      showToast(" Failed to update Note! ", "error");
    }
  };

  return (
    <Dialog open={open} /* onClose={()=>setOpenCustomNotesModal(false)} */>
      <div>
        <CloseIcon
          style={{ float: "right", cursor: "pointer" }}
          onClick={() => setOpenCustomNotesModal(false)}
        />
      </div>
      <div>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Custom Note"
            type="text"
            fullWidth
            variant="standard"
            color="primary"
            InputLabelProps={{
              sx: {
                color: "#007dc6",
                [`&.${inputLabelClasses.shrink}`]: {
                  color: "#007dc6",
                },
              },
            }}
          />
        </DialogContent>
      </div>
      <div>
        <button
          style={{
            float: "right",
            marginBottom: "15px",
            padding: "5px 12px 5px 12px",
            borderRadius: "8px",
          }}>
          {" "}
          Save Note{" "}
        </button>
      </div>
    </Dialog>
  );
};

export default CustomNotesModal;
