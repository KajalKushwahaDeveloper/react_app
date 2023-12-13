import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  FormControl,
  InputLabel,
  Input,
  Select,
  MenuItem,
  OutlinedInput,
} from "@mui/material";

import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { PHONE_GET_AVAILABLE_NUMBERS_URL } from "../constants";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

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
  const { setTwilioUpdatedPhone, alternateNumber, setAlternateNumber ,setSelectedDropdownValue} = props;

  const [phoneNumber, setPhoneNumber] = useState();
  const [twilioPhoneNumber, setTwilioPhoneNumber] = useState([]);
  const [teleError, setTeleError] = useState("");

  useEffect(() => {

    const defaultCountryCode = 'US'; 
    setAlternateNumber(`+${defaultCountryCode}`);
  }, []);

  // Fetch data from API
  const fetchUsers = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(PHONE_GET_AVAILABLE_NUMBERS_URL, {
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
        return { success: true, error: null };
      }
    } catch (error) {
      console.log("User Data Error: " + error);
    }
  };

  const handleChange = (e) => {
    console.log("helloh");
    const {
      target: { value },
    } = e;
    setPhoneNumber(value);
    setTwilioUpdatedPhone(e.target.value);
    setSelectedDropdownValue(value);
  };

  const handleAlternateNumberChange = (value) => {
    if (!value) {
      setTeleError("Please enter your telephone number");
    } else {
      setTeleError(""); // Clear the error if a valid value is entered
    }
    setAlternateNumber(value);
  };

  useEffect(async () => {
    const userData = await fetchUsers();
    console.log("userData111", userData);
  }, []);

  return (
    <div>
      <FormControl sx={{ m: 1, width: 300, margin: "2rem" }}>
        <InputLabel id="tel-number-label" style={{ borderRadius: "2rem" }}>
          Tel. No.
        </InputLabel>
        <Select
          labelId="tel-number-label"
          id="demo-multiple-name"
          value={phoneNumber}
          onChange={handleChange}
          input={<OutlinedInput label="Name" />}
          MenuProps={MenuProps}
        >
          {twilioPhoneNumber?.map((telephone, index) => (
            <MenuItem key={index} value={telephone}>
              {telephone}
            </MenuItem>
          ))}
        </Select>

        <div style={{ marginTop: "2rem" }}>Enter an Alternate Number</div>

        <PhoneInput
          international
          countryCallingCodeEditable={false}
          defaultCountry="US"
          defaultValue={alternateNumber}
          limitMaxLength={10}
          onChange={handleAlternateNumberChange}
          
        />
        {teleError && (
          <p className="ms-4 mb-1" style={{ fontSize: 14, color: "red" }}>
            {teleError}
          </p>
        )}
      </FormControl>
    </div>
  );
};
export default DropDown;
