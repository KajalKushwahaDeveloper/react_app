import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button
} from "@mui/material";

export function DragDialog(props) {
  return (
    <Dialog open={props.openDialog} onClose={props.onClose}>
      <DialogTitle id="alert-dialog-title">{"logbook gps"}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {props.DialogText}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.confirmNewLocation} autoFocus>
          Confim
        </Button>
        <Button onClick={props.onClose} autoFocus>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}
