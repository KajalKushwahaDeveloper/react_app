import React, { useEffect, useState } from "react";
import { useTheme } from "@mui/material/styles";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Dialog from "@mui/material/Dialog";
import PropTypes from "prop-types";
import { styled } from "@mui/material/styles";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { GetEmulatorApi } from "../components/api/emulator";
import { PHONE_GET_AVAILABLE_NUMBERS_URL } from "../constants";

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

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const DropDown = (props) => {
  const { showToast, open, close, setTwilioUpdatedPhone } = props;
  const theme = useTheme();

  const [phoneNumber, setPhoneNumber] = useState("");
  const [twilioPhoneNumber, setTwilioPhoneNumber] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { success, data, error } = await GetEmulatorApi();

      if (success) {
        setTwilioPhoneNumber(data);
        setLoading(false);
      } else {
        setError(error);
        setLoading(false);
      }
    } catch (error) {
      console.log("Error fetching data: ", error);
      setError(error.message);
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const {
      target: { value },
    } = e;
    console.log("number", value);
    setPhoneNumber(value);

    // Store the selected phone number in localStorage
    localStorage.setItem("selectedPhoneNumber", value);
  };

  useEffect(() => {
    console.log("open::12", open);
    fetchUsers();

    // Retrieve the selected phone number from localStorage
    const storedPhoneNumber = localStorage.getItem("selectedPhoneNumber");

    if (storedPhoneNumber) {
      setPhoneNumber(storedPhoneNumber);
    }

    // Set phoneNumber to the first number in the list when twilioPhoneNumber updates
    if (twilioPhoneNumber.length > 0) {
      setPhoneNumber(twilioPhoneNumber[0].telephone);
    }
  }, [open]);

  return (
    <div>
      <FormControl sx={{ m: 1, width: 300, margin: "2rem" }}>
        <InputLabel
          id="demo-multiple-name-label"
          style={{ borderRadius: "2rem" }}
        >
          Tel. No.
        </InputLabel>
        <Select
          labelId="demo-multiple-name-label"
          id="demo-multiple-name"
          value={phoneNumber}
          onChange={handleChange}
          input={<OutlinedInput label="Name" />}
          MenuProps={MenuProps}
        >
          {twilioPhoneNumber?.map((currentData, index) => (
            <MenuItem
              key={index}
              value={currentData?.telephone}
            >
              {currentData?.telephone}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
};

export default DropDown;
