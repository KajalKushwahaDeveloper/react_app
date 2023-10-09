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
import states from "./states";

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

const PhoneDropDown = (props) => {
  const { showToast, devices, selectedDeviceToCallWith, setSelectedDeviceToCallWith} = props;

  const handleChange = (e) => {
    const {
      target: { value },
    } = e;
    if(devices[value] && devices[value].state !== states.CONNECTING && devices[value].device !== null) {
      setSelectedDeviceToCallWith(value);
    } else {
      showToast("The number is not setup properly", "error")
    }
  };

  // Get the selected device based on selectedDeviceToCallWith
  var selectedDevice = "N/A"
  if(devices[selectedDeviceToCallWith] && devices[selectedDeviceToCallWith].state !== states.CONNECTING && devices[selectedDeviceToCallWith].device !== null) {
    selectedDevice = devices[selectedDeviceToCallWith].number;
  }

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
          value={selectedDevice ? selectedDevice.number : 'N/A'}
          onChange={handleChange}
          input={<OutlinedInput label="Name" />}
          MenuProps={MenuProps}
        >
          {devices?.map((device, index) => (
            <MenuItem
              key={index}
              value={index}
            >
              {device.number}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
};

export default PhoneDropDown;
