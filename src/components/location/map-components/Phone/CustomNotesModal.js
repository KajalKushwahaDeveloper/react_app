import React from 'react';
import Modal from '@material-ui/core/Modal';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContent: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(2),
    outline: 'none',
    maxWidth: '80%',
    minWidth: '300px',
  },
}));

const CustomNotesModal = ({
  open,
  handleClose,
  noteText,
  setNoteText,
  selectedEmulatorIdForNotes,
  setOpenCustomNotesModal,
  setCustomNotes,
}) => {
  const classes = useStyles();

  const handleNoteChange = (e) => {
    // Limit the input length to 25 characters
    const newText = e.target.value.slice(0, 25);
    setNoteText(newText);
    console.log("newText:",newText)
  };

  const handleSaveNote = () => {
    setCustomNotes((prevNotes) => ({
      ...prevNotes,
      [selectedEmulatorIdForNotes]: noteText,
    }));

    setOpenCustomNotesModal(false);
  };
  
  return (
    <Modal
      open={open}
      onClose={handleClose}
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
          style={{marginTop:"1rem", float:"right"}}
        >
          Save Note
        </Button>
      </div>
    </Modal>
  );
};

export default CustomNotesModal;
