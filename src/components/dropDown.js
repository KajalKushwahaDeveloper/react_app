import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import "../scss/dropDown.scss";


const  DropDown = (props) => {
  const { emulator, onEmulatorChange, emulatorValue , setFcmToken} = props
  // console.log("props", emulator)

  const Token = (fcmToken) =>{
    setFcmToken(fcmToken)
    console.log('fcm id', fcmToken);
  }
 

  return (
    <div>
      <FormControl variant="filled" className='form' sx={{ m: 1, minWidth: 220, background: "", color: "yellow" }}>
        <InputLabel id="demo-simple-select-filled-label" sx={{ color: "green" }}>Emulators</InputLabel>
        <Select
          labelId="demo-simple-select-filled-label"
          id="demo-simple-select-filled"
          value={emulatorValue}
          onChange={onEmulatorChange}
          sx={{ color: "green" }}
        >
          <MenuItem value="" sx={{ color: "green" }}>
            <em>None</em>
          </MenuItem>

          {emulator?.map((currentData) => (
            <MenuItem onClick = {() => Token(currentData.fcmToken)} key={currentData.id} value={currentData.id}>
              {currentData.emulatorName}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}

 export default DropDown;