import React, { useEffect, useState } from "react";
import Modal from "@material-ui/core/Modal";
import TextField from "@material-ui/core/TextField";
import CloseIcon from "@mui/icons-material/Close";
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
  root: {
    // input label when focused
    "& label.Mui-focused": {
      color: "#5A5A5A"
    },
    // focused color for input with variant='standard'
    "& .MuiInput-underline:after": {
      borderBottomColor: "#5A5A5A"
    },
    // focused color for input with variant='filled'
    "& .MuiFilledInput-underline:after": {
      borderBottomColor: "#5A5A5A"
    },
  }
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

const closeCustomNotesModal = () => {
  setOpenCustomNotesModal(false);
  setNoteText("");
}

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
      console.log("selectedEmulatorIdForNotes:", selectedEmulatorIdForNotes)
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
      setNoteText("");
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
      <CloseIcon
          style={{ float: "right", cursor: "pointer" ,color:"#5A5A5A"}}
          onClick={closeCustomNotesModal}
        />
        <TextField
          label="Custom Note::"
          multiline
          rows={1}
          variant="standard"
          fullWidth
          value={noteText}
          onChange={handleNoteChange}
          maxLength={12}
          className={classes.root}
        />
        <button
          variant="contained"
          color="primary"
          onClick={handleSaveNote}
          style={{ marginTop: "1rem", float: "right" }}
        >
          Save Note
        </button>
      </div>
    </Modal>
      );
    };
    
    export default CustomNotesModal;