import React, { useState } from 'react';
import {
  Dialog,
  Tabs,
  Tab,
  Typography,
  Box,
  TextField,
  Button,
} from '@mui/material';
import PropTypes from 'prop-types';

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}


TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function ContactForm() {
  const handleSubmit = () => {

  };
  return (
    <form onSubmit={handleSubmit}>
      <TextField
        label="Phone Number"
        variant="outlined"
        fullWidth
        margin="normal"
        type='number'
      />
      <TextField
        id="outlined-multiline-static"
        label="Message"
        multiline
        rows={4}
        fullWidth
      />
      <div style={{ marginTop: '1rem' }}>
        <Button type="Submit" variant="contained" fullWidth>Submit</Button>
      </div>
    </form>
  );
}

function ContactDialogComponent({handleCall, handleMessage}) {
    const [open, setOpen] = useState(true); 
    const [value, setValue] = React.useState(0);
   

    const handleClose = () => {
        setOpen(false);
    }

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

  return(
    <div className='ContactDialogContainer'>
    <Dialog 
      open={open}
      onClose={handleClose}
      fullWidth
    >
      {(handleCall || handleMessage) && (
        <div>
          <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
            <Tab label={handleCall && !handleMessage ? 'Call Details' : 'Meassage Details'} {...a11yProps(0)} />
            <Tab label={handleCall && !handleMessage ? 'Call History': 'Message History'} {...a11yProps(1)} />
          </Tabs>
          <TabPanel value={value} index={0}>
            <ContactForm />
          </TabPanel>
          <TabPanel value={value} index={1}>
            Item Two
          </TabPanel>
        </div>
      )}
    </Dialog>
  </div>
  )
}

export default ContactDialogComponent