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
import { TWILIO_PHONE_URL } from "../constants";

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
  const {
    showToast,
    open,
    close,
    setTwilioUpdatedPhone
  } = props;
  const theme = useTheme();
  
  const [phoneNumber, setPhoneNumber] = React.useState();
  const [twilioPhoneNumber, setTwilioPhoneNumber] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUserId, SetSelectedUserId] = useState();

 

  // Fetch data from API
  const fetchUsers = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(TWILIO_PHONE_URL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok || response.status !== 200) {
        return { success: false, error: "Invalid credentials" };
      } else {
        const responseData = await response.text();

        const deserializedData = JSON.parse(responseData);
        console.log("response11:::", deserializedData);

        setTwilioPhoneNumber(deserializedData);
        setLoading(false);
        return { success: true, error: null };
      }
    } catch (error) {
      console.log("User Data Error: " + error);
      setError(error.message);
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    console.log("helloh");
    const {
      target: { value },
    } = e;
    
  
    SetSelectedUserId(value);
    setPhoneNumber(value);
    setTwilioUpdatedPhone(e.target.value);
  };


  useEffect(async () => {
    console.log("open::12", open);
    //  setLoading(true);
    const userData = await fetchUsers();
    console.log("userData111", userData);
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
              {console.log("users23:", twilioPhoneNumber)}

              {twilioPhoneNumber?.map((telephone, index) => (
                
                <MenuItem key={index} value={telephone}  onChange={() => handleChange()}>
               {telephone}
              
                </MenuItem>
              ))}
            </Select>
          
          </FormControl>
 
    </div>
  );
}
export default DropDown;