import React, { useEffect, useState } from "react";
import Modal from "@material-ui/core/Modal";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import ApiService from "../../../../ApiService";
import { EMULATOR_NOTE_URL, EMULATOR_URL } from "../../../../constants";
import { useStates } from "../../../../StateProvider";

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  modalContent: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(2),
    outline: "none",
    maxWidth: "80%",
    minWidth: "300px",
  },
}));

const CustomNotesModal = ({
  open,
  selectedEmulatorIdForNotes,
  setOpenCustomNotesModal,
  setSelectedEmulatorIdForNotes,
}) => {
  const { showToast } = useStates();

  const [noteText, setNoteText] = useState("");

  const classes = useStyles();

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

    if(selectedEmulatorIdForNotes != null && selectedEmulatorIdForNotes !== undefined) {
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
    <Modal
      open={open}
      onClose={() => {
        setSelectedEmulatorIdForNotes(null);
        setOpenCustomNotesModal(false);
        setNoteText("");
      }}
      className={classes.modal}
    >
      <div className={classes.modalContent}>
        <TextField
          label="Custom Note::"
          multiline
          rows={1}
          variant="standard"
          fullWidth
          value={noteText}
          onChange={handleNoteChange}
          maxLength={12}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSaveNote}
          style={{ marginTop: "1rem", float: "right" }}
        >
          Save Note
        </Button>
      </div>
    </Modal>
  );
};

export default CustomNotesModal;
