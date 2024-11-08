import CloseIcon from '@mui/icons-material/Close';
import { Backdrop, CircularProgress, Dialog, Tab, Tabs } from '@mui/material';
import React, { useEffect, useState } from 'react';
import ApiService from '../../../../ApiService';
import { useStates } from '../../../../StateProvider.js';
import { CALL_MAKE_CALL, CALL_URL, MESSAGE_URL } from '../../../../constants';
import { useEmulatorStore } from '../../../../stores/emulator/store.tsx';
import { ShowHistory } from './ShowHistory';
import { RealNumberMessages } from './RealNumberMessages';
import { TabPanel, a11yProps } from './a11yProps';
import { ContactForm } from './sms/ContactForm';
import Phone from './twilio/Phone';

function ContactDialogComponent({ contactDialogOptions, setContactDialogOptions }) {
  const selectedDevice = useEmulatorStore((state) => state.selectedDevice);
  const selectDevice = useEmulatorStore((state) => state.selectDevice);
  const { showToast } = useStates();
  const [tabIndexValue, setTabIndexSelected] = useState(0);
  const [historyData, setHistoryData] = useState([]);
  const [loader, setLoading] = useState(false);

  useEffect(() => {
    const handleHistory = async () => {
      let id = contactDialogOptions.emulatorId;
      let url = MESSAGE_URL;

      if (contactDialogOptions.dialogType === 'call') {
        id = selectedDevice?.emulatorId;
        url = CALL_URL;
      }
      setLoading(true);
      const token = localStorage.getItem('token');
      const { success, data, error } = await ApiService.makeApiCall(
        url,
        'GET',
        null,
        token,
        id
      );

      if (success) {
        setLoading(false);
        setHistoryData(data);
      } else {
        setLoading(false);
        console.error('Error In getting data:', error || 'Unknown error');
      }
    };
    if (contactDialogOptions && contactDialogOptions.open === true) {
      handleHistory();
    }
  }, [contactDialogOptions, selectedDevice?.emulatorId]);

  const handleTabChange = (event, newValue) => {
    setTabIndexSelected(newValue);
  };

  return (
    <div className="ContactDialogContainer">
      <Dialog open={contactDialogOptions.open} fullWidth>
        <div>
          <CloseIcon
            style={{ float: 'right', cursor: 'pointer' }}
            onClick={() => {
              setTabIndexSelected(0);
              selectDevice(null);
              setHistoryData(null);
              setContactDialogOptions({
                open: false,
                dialogType: '',
                emulatorId: null
              });
            }}
          />
        </div>
        <div>
          <Tabs
            value={tabIndexValue}
            onChange={handleTabChange}
            aria-label="basic tabs example"
            className='messageTabs'
            style={{ position: 'absolute', top: '0rem' }}
          >
            <Tab
              label={
                contactDialogOptions.dialogType === 'call' ? 'Call' : 'Message'
              }
              {...a11yProps(0)}
            />
            <Tab
              label={
                contactDialogOptions.dialogType === 'call'
                  ? 'Call History'
                  : 'Message History'
              }
              {...a11yProps(1)}
            />
          </Tabs>
          <TabPanel value={tabIndexValue} index={0} style={{ zIndex: '1100', marginTop: '1.3rem', height: '83vh', overflowY: 'scroll' }}>
            {contactDialogOptions.dialogType === 'call' ? (
              <Phone setContactDialogOptions={setContactDialogOptions} />
            ) : (
              <ContactForm
                emulatorSsid={contactDialogOptions.emulatorSsid}
                showToast={showToast}
              />
            )}
          </TabPanel>
          <TabPanel value={tabIndexValue} index={1} style={{ marginTop: '2rem', height: '80vh', overflowY: 'scroll' }}>
            <ShowHistory
              dialogType={contactDialogOptions.dialogType}
              data={historyData}
            />
            <Backdrop
              sx={{
                color: '#fff',
                zIndex: (theme) => theme.zIndex.drawer + 1
              }}
              open={loader}
            >
              <CircularProgress color="inherit" />
            </Backdrop>
          </TabPanel>
        </div>
      </Dialog>
    </div>
  );
}

export default ContactDialogComponent;
