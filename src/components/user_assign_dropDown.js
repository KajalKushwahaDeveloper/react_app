import React,{useEffect, useState} from "react";
import { useTheme } from "@mui/material/styles";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Dialog from "@mui/material/Dialog";
import Button from '@mui/material/Button';
import PropTypes from "prop-types";
import { styled } from "@mui/material/styles";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { USER_URL, USER_ASSIGN_EMULATOR_URL } from "../constants";



  
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

const names = [
  "Oliver Hansen",
  "Van Henry",
  "April Tucker",
  "Ralph Hubbard",
  "Omar Alexander",
  "Carlos Abbott",
  "Miriam Wagner",
  "Bradley Wilkerson",
  "Virginia Andrews",
  "Kelly Snyder",
];



export default function UserAssignDropDown(props) {
  const theme = useTheme();
  const [personName, setPersonName] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [users, setUsers] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  // Fetch data from API
  const fetchUsers = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(USER_URL, {
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
        console.log("response:::", deserializedData);


        setUsers(deserializedData);
        setLoading(false);
        return { success: true, error: null};
      }
    } catch (error) {
      console.log("User Data Error: " + error);
      setError(error.message);
      setLoading(false);
    }
  };


  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    // setPersonName(
    //   typeof value === "string" ? value.split(",") : value
    // );
    setPersonName(value)
  };
  useEffect(async () => {
    // setLoading(true);
    const userData = await fetchUsers();
    console.log("userData111", userData)
    
  }, [props.open]);
  return (
    <div>
    
      <BootstrapDialog 
        onClose={props.close}
        aria-labelledby="customized-dialog-title"
        open={props.open}
      >
        <BootstrapDialogTitle
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontWeight:"100px",
          }}
          id="customized-dialog-title"
          onClose={props.close}
        >
          Select User:
        </BootstrapDialogTitle>
        <DialogContent dividers>

        <FormControl sx={{ m: 1, width: 300 , margin:"2rem"}}>
          <InputLabel id="demo-multiple-name-label" style={{borderRadius:"2rem"}}>Users</InputLabel>
          <Select
            labelId="demo-multiple-name-label"
            id="demo-multiple-name"
         
            value={personName}
            onChange={handleChange}
            input={<OutlinedInput label="Name" />}
            MenuProps={MenuProps}
          >{
            console.log("users23:", users)
          }
            {users?.map((name) => (
              <MenuItem
                key={name}
                value={name}
               
              >
                {name.lastModifiedBy}
              </MenuItem>
            ))}
          </Select>
          <Button variant="contained">Add</Button>
        </FormControl>
        </DialogContent>
      </BootstrapDialog>
    </div>
  );
}
