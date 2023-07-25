import * as React from "react";
import PropTypes from "prop-types";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import TextField from "@material-ui/core/TextField";
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";
import RoomIcon from "@mui/icons-material/Room";
import {
  createStyles,
  Theme,
  withStyles,
  makeStyles,
} from "@material-ui/core/styles";

const CssTextField = withStyles({
  root: {
    "& label.Mui-focused": {
      color: "#363636",
    },
    "& .MuiInput-underline:after": {
      borderBottomColor: "#363636",
    },
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "#363636",
      },
      "&:hover fieldset": {
        borderColor: "#363636",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#363636",
      },
    },
  },
})(TextField);

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

function BootstrapDialogTitle(props) {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 0,
            top: 0,
            color: (theme) => theme.palette.blue,
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
}

BootstrapDialogTitle.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
};

export default function CreateTripDialogBox(props) {
  const { isTableVisible, setIsTableVisible } = props;

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setIsTableVisible(false);
  };

  React.useEffect(() => {
    setOpen(isTableVisible);
  }, [isTableVisible]);


  return (
    <div>
      <BootstrapDialog
        // onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <BootstrapDialogTitle
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontWeight: "100px",
          }}
          id="customized-dialog-title"
          onClose={handleClose}
        >
          Creat Trip
        </BootstrapDialogTitle>
        <DialogContent
          style={{ display: "flex", flexDirection: "column", margin: "1rem" }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "1rem",
              marginTop: "0.3rem",
            }}
          >
            <RadioButtonCheckedIcon  />
            <CssTextField
              style={{
                marginLeft: "1rem",
                // borderColor: "#00FF00",
                width: "300px",
              }}
              
              id="outlined-basic-1"
              label="Search Location"
              variant="outlined"
            />
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <RoomIcon  />
            <CssTextField
             
              style={{
                marginLeft: "1rem",
                // borderColor: "#2196F3",
                width: "300px",
              }}
              id="outlined-basic-2"
              label="Search Location"
              variant="outlined"
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button
            autoFocus
            style={{
              color: "#ffffff",
              background: "#007dc6",
              width: "100%",
              borderRadius: "1rem",
            }}
          >
            Add
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </div>
  );
}
