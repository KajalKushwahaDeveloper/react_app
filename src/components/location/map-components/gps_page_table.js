import React, { useEffect, useState } from 'react'

import SearchIcon from '@mui/icons-material/Search'
import {
  Backdrop,
  CircularProgress,
  InputAdornment,
  TextField,
  Tooltip
} from '@mui/material'
import TablePagination, {
  tablePaginationClasses as classes
} from '@mui/material/TablePagination'
import { styled } from '@mui/system'
import {
  EMULATOR_NOTIFICATION_URL,
  TRIP_HISTORY,
  TRIP_TOGGLE
} from '../../../constants'

import {
  MAXIMUM_VELOCITY_METERS_PER_MILLISECONDS,
  MINIMUM_VELOCITY_METERS_PER_MILLISECONDS
} from '../../../MetricsConstants.js'

// icons
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import HistoryIcon from '@mui/icons-material/History'
import MessageRoundedIcon from '@mui/icons-material/MessageRounded'
import PauseCircleOutlineIcon from '@mui/icons-material/PauseCircleOutline'
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline'
import RestartAltIcon from '@mui/icons-material/RestartAlt'
import IconButton from '@mui/material/IconButton'

// components
import ContactDialogComponent from './Phone/ContactDialogComponent'

import ApiService from '../../../ApiService'
import PopUpEmulatorHistory from './popup_emulator_history'

import OptimizedFilter from 'react-optimized-filter'
import { useStates } from '../../../StateProvider'
import { useViewPort } from '../../../ViewportProvider'
import '../../../css/emulator_list_row.css'
import { compareSelectedDeviceForDialog } from '../../../stores/call/storeCall.tsx'
import { useEmulatorStore } from '../../../stores/emulator/store.tsx'
import PhoneComponent from './GpsEmulatorList/PhoneComponent.js'
import CustomNoteComponent from './Phone/CustomNoteComponent.js'

const GpsTable = () => {
  // FIXME: fix table rerendering.
  const fetchEmulators = useEmulatorStore((state) => state.fetchEmulators)
  const [searchInput, setSearchInput] = useState('')

  const emulators = useEmulatorStore(
    (state) => state.emulators
  )

  const selectedEmulator = useEmulatorStore(
    (state) => state.selectedEmulator
  )

  const selectEmulator = useEmulatorStore((state) => state.selectEmulator)

  const selectDevice = useEmulatorStore((state) => state.selectDevice)

  const devices = useEmulatorStore((state) => state.devices)

  const hoveredEmulator = useEmulatorStore((state) => state.hoveredEmulator)

  // State variables
  const { staticEmulators, showToast } = useStates()

  const { width, height } = useViewPort()
  const breakpoint = 620

  const isMobile = width < breakpoint

  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(1)
  const [messageLoading, setMessageLoading] = useState(false)

  const [openEmulatorHistoryPopUp, setOpenEmulatorHistoryPopUp] =
    useState(false)

  const [selectedEmulatorForHistoryData, setSelectedEmulatorForHistoryData] =
    useState(null)

  const handleHistoryClose = () => {
    setOpenEmulatorHistoryPopUp(false)
    setSelectedEmulatorForHistoryData(null)
  }

  const [contactDialogOptions, setContactDialogOptions] = useState({
    open: false,
    dialogType: '',
    emulatorId: null
  })

  const selectedDevice = useEmulatorStore(
    (state) => state.selectedDevice,
    (oldSelectedDevice, newSelectedDevice) =>
      compareSelectedDeviceForDialog(oldSelectedDevice, newSelectedDevice)
  )

  useEffect(() => {
    // When call comes/ ends.
    if (selectedDevice === null || selectedDevice.state === null) {
      setContactDialogOptions({
        open: false,
        dialogType: '',
        emulatorId: null
      })
    } else if (selectedDevice.state === 'Incoming') {
      setContactDialogOptions({
        open: true,
        dialogType: 'call',
        emulatorId: null
      })
    } else if (selectedDevice.state === 'On call') {
      setContactDialogOptions({
        open: true,
        dialogType: 'call',
        emulatorId: null
      })
    } else if (
      selectedDevice.state === 'Offline' ||
      selectedDevice.state === 'Ready'
    ) {
      setContactDialogOptions({
        open: false,
        dialogType: '',
        emulatorId: null
      })
    }
  }, [selectedDevice])

  const handleCallIconClicked = (emulator) => {
    const device = devices.find((device) => device.emulatorId === emulator.id)
    selectDevice(device)
    setContactDialogOptions({
      open: true,
      dialogType: 'call',
      emulatorId: null
    })
  }

  const handleMessageIconClicked = (row) => {
    setContactDialogOptions({
      open: true,
      dialogType: 'message',
      emulatorId: row.id
    })
  }

  useEffect(() => {
    if (hoveredEmulator !== null) {
      console.log('current Page', page)
      const selectedEmIndex = emulators.findIndex(
        (emulator) => emulator.id === hoveredEmulator.id
      )
      // Calculate the new active page based on the selected checkbox index and rowsPerPage
      if (selectedEmIndex !== -1) {
        const newActivePage = Math.floor(selectedEmIndex / rowsPerPage)
        setPage(newActivePage)
      }
    } else if (selectedEmulator !== null) {
      const selectedEmIndex = emulators.findIndex(
        (emulator) => emulator.id === selectedEmulator.id
      )
      console.log('selectedEmIndex', selectedEmIndex)
      // Calculate the new active page based on the selected checkbox index and rowsPerPage
      if (selectedEmIndex !== -1) {
        const newActivePage = Math.floor(selectedEmIndex / rowsPerPage)
        setPage(newActivePage)
      }
    }
    console.log('updated Page', page)
  }, [emulators, rowsPerPage, selectedEmulator, hoveredEmulator])

  // page changed from arrows
  useEffect(() => {
    if (tablePaginationRef.current) {
      tablePaginationRef.current.setPage(page)
    }
  }, [page])

  const tablePaginationRef = React.useRef(null)
  // get max rows we can get within the screen height - 128px(navbar) - 55px(search) - 50px(footer/pagination)
  useEffect(() => {
    const maxRowsPerPage = Math.floor((height - 128 - 55 - 50) / 80)
    tablePaginationRef.current?.setRowsPerPage(maxRowsPerPage)
    setRowsPerPage(maxRowsPerPage)
  }, [height])

  const handleEmulatorCheckboxChange = (emulatorRow) => {
    if (selectedEmulator?.id !== emulatorRow.id) {
      selectEmulator(emulatorRow)
    } else {
      selectEmulator(null)
    }
  }

  const handleHistoryButtonClick = async (emulatorForHistory) => {
    setMessageLoading(true)
    const token = localStorage.getItem('token')
    const { success, data, error } = await ApiService.makeApiCall(
      TRIP_HISTORY + '/' + emulatorForHistory.id,
      'GET',
      null,
      token
    )
    if (success) {
      setMessageLoading(false)
      setSelectedEmulatorForHistoryData(data)
      setOpenEmulatorHistoryPopUp(true)
    } else {
      console.error(`Error Fetching History : ${error}`)
      showToast('Error Fetching History', 'error')
    }
  }

  const handleRestartButtonClick = async (row) => {
    const token = localStorage.getItem('token')
    const { success, error } = await ApiService.makeApiCall(
      EMULATOR_NOTIFICATION_URL + '/' + row.id,
      'POST',
      null,
      token
    )
    if (success) {
      showToast('Notification send', 'success')
    } else {
      console.error(`Error sending notification : ${error}`)
      showToast('Error', 'error')
    }
  }

  const handleActionButtonClick = async (row) => {
    if (row.tripStatus === 'FINISHED') {
      showToast('Trip already Finished!', 'error')
      return
    }
    const token = localStorage.getItem('token')
    const { success, error } = await ApiService.makeApiCall(
      TRIP_TOGGLE + '/' + row.id,
      'GET',
      null,
      token
    )
    if (success) {
      showToast('CHANGED TRIP STATUS', 'success')
      fetchEmulators()
    } else {
      console.error(`Error CHANGING TRIP STATUS : ${error}`)
      showToast('Error CHANGING TRIP STATUS', 'error')
    }
  }

  const isVelocityOutOfRange = (velocity) =>
    velocity < MINIMUM_VELOCITY_METERS_PER_MILLISECONDS ||
    velocity > MAXIMUM_VELOCITY_METERS_PER_MILLISECONDS

  const isSelectedEmulator = (emulatorId, selectedEmulator) =>
    emulatorId === selectedEmulator?.id

  const isHoveredEmulator = (emulatorId, hoveredEmulator) =>
    emulatorId === hoveredEmulator?.id

  const getBlinkClass = (emulator, selectedEmulator, hoveredEmulator) => {
    if (
      !isSelectedEmulator(emulator.id, selectedEmulator) &&
      !emulator.startLat
    ) {
      return ''
    }
    if (isVelocityOutOfRange(emulator.velocity)) {
      if (isSelectedEmulator(emulator.id, selectedEmulator)) {
        return 'blink-selected'
      }
      if (isHoveredEmulator(emulator.id, hoveredEmulator)) {
        return 'blink-hovered'
      }
      return 'blink'
    }
    return ''
  }

  useEffect(() => {
    emulators.filter((emulator) => {
      return (
        emulator.emulatorSsid.includes(searchInput) ||
                (emulator.telephone &&
                  emulator.telephone.includes(searchInput)) ||
                (emulator.note &&
                  emulator.note
                    .toLowerCase()
                    .includes(searchInput.toLowerCase()))
      )
    })
    setPage(0)
    setRowsPerPage(8)
  }, [searchInput, emulators, searchInput, setPage])

  return (
    <div>
      <Backdrop color="primary" style={{ zIndex: 4 }} open={messageLoading}>
        <CircularProgress color="primary" />
      </Backdrop>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          position: isMobile ? 'static' : 'absolute',
          top: isMobile ? '0px' : '128px',
          width: '320px'
        }}
      >
        <>
          <TextField
            style={{
              height: isMobile ? 'auto' : '55px',
              minHeight: isMobile ? 'auto' : '55px',
              maxHeight: isMobile ? 'auto' : '55px',
              margin: '0'
            }}
            placeholder="Search by Number/Note/Ssid"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              )
            }}
          />
          <OptimizedFilter
            items={emulators}
            predicate={(emulator, index, predicateArg) => {
              // Determine if item should be included in filtered list... checking ssid and note
              return (
                emulator.emulatorSsid.includes(predicateArg) ||
                (emulator.telephone &&
                  emulator.telephone.includes(predicateArg)) ||
                (emulator.note &&
                  emulator.note
                    .toLowerCase()
                    .includes(predicateArg.toLowerCase()))
              )
            }}
            predicateArg={searchInput}
            render={(emulators) => (
              // Render filtered items...
              <table style={{ width: '100%' }}>
                <tbody>
                  {(rowsPerPage > 0
                    ? emulators.slice(
                      page * rowsPerPage,
                      page * rowsPerPage + rowsPerPage
                    )
                    : emulators
                  )?.map((emulator, index) => (
                    <tr
                      key={emulator.id || 'N/A'}
                      style={{
                        height: isMobile ? 'auto' : '80px',
                        minHeight: isMobile ? 'auto' : '80px',
                        maxHeight: isMobile ? 'auto' : '80px',
                        border: '2px solid #E6E6E6'
                      }}
                      className={`${getBlinkClass(
                        emulator,
                        selectedEmulator,
                        hoveredEmulator
                      )} ${
                        isSelectedEmulator(emulator.id, selectedEmulator)
                          ? 'selected'
                          : ''
                      } ${
                        isHoveredEmulator(emulator.id, hoveredEmulator)
                          ? 'hovered'
                          : ''
                      }`}
                      onClick={() => handleEmulatorCheckboxChange(emulator)}
                    >
                      <td
                        style={{
                          background:
                            emulator.status === 'ACTIVE'
                              ? '#16BA00'
                              : emulator.status === 'INACTIVE'
                                ? '#FFA500'
                                : '#ff4d4d',
                          textAlign: 'center'
                        }}
                      >
                        {/* Restart/Reset Button */}
                        <RestartAltIcon
                          fontSize="small"
                          onClick={() => handleRestartButtonClick(emulator)}
                        />
                      </td>

                      {/* TELEPHONE */}
                      <td>
                        <div
                          style={{
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center'
                          }}
                        >
                          <Tooltip
                            title={emulator.telephone || 'N/A'}
                            placement="top"
                          >
                            <div
                              style={{ display: 'flex', alignItems: 'center' }}
                            >
                              <div>{emulator.telephone || 'N/A'}</div>
                              {/* Icons */}
                              <div style={{ display: 'flex' }}>
                                {/* calling icon */}
                                {PhoneComponent(
                                  devices,
                                  emulator,
                                  handleCallIconClicked
                                )}
                                {/* message icon */}
                                <IconButton
                                  size="small"
                                  disabled={!emulator?.telephone}
                                  onClick={() =>
                                    handleMessageIconClicked(emulator)
                                  }
                                >
                                  <MessageRoundedIcon fontSize="small" />
                                </IconButton>

                                {/* message icon */}
                                <IconButton
                                  size="small"
                                  onClick={() =>
                                    handleHistoryButtonClick(emulator)
                                  }
                                >
                                  <HistoryIcon fontSize="small" />
                                </IconButton>
                              </div>
                            </div>
                          </Tooltip>
                          {/* custom notes */}
                          <div style={{ marginBottom: '0.2rem' }}>
                            <CustomNoteComponent emulator={emulator} />
                          </div>
                        </div>
                      </td>
                      <td align="right">
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            maxWidth: 85
                          }}
                        >
                          {/* Trip Status Action */}
                          {emulator.startLat !== null &&
                            emulator.startLat !== undefined &&
                            emulator.startLat !== 0 && (
                              <IconButton
                                size="small"
                                onClick={() =>
                                  handleActionButtonClick(emulator)
                                }
                              >
                                <Tooltip title={emulator.tripStatus}>
                                  <div style={{ width: 20, height: 20 }}>
                                    {emulator.tripStatus === 'RUNNING' && (
                                      <PauseCircleOutlineIcon fontSize="small" />
                                    )}
                                    {emulator.tripStatus === 'PAUSED' && (
                                      <PlayCircleOutlineIcon fontSize="small" />
                                    )}
                                    {emulator.tripStatus === 'STOP' && (
                                      <PlayCircleOutlineIcon fontSize="small" />
                                    )}
                                    {emulator.tripStatus === 'RESTING' && (
                                      <PlayCircleOutlineIcon fontSize="small" />
                                    )}
                                    {emulator.tripStatus === 'FINISHED' && (
                                      <CheckCircleOutlineIcon fontSize="small" />
                                    )}
                                  </div>
                                </Tooltip>
                              </IconButton>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          />

          <PopUpEmulatorHistory
            showToast={showToast}
            handleClose={handleHistoryClose}
            open={openEmulatorHistoryPopUp}
            emulatorHistory={selectedEmulatorForHistoryData}
          />

          <ContactDialogComponent
            contactDialogOptions={contactDialogOptions}
            setContactDialogOptions={setContactDialogOptions}
            emulators={staticEmulators}
            showToast={showToast}
          />
        </>
      </div>
      <CustomTablePagination
        onLoad={(ref) => {
          tablePaginationRef.current = ref
        }}
        rowsPerPageOptions={[1]}
        colSpan={6}
        count={emulators.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(event, newPage) => setPage(newPage)}
        labelRowsPerPage={null}
        style={{
          overflow: 'hidden',
          borderTop: '1px solid #C8C8C8',
          position: isMobile ? 'static' : 'absolute',
          bottom: 0,
          backgroundColor: '#fff',
          zIndex: 2,
          height: '50px',
          width: isMobile ? '100vw' : '320px'
        }}
      />
    </div>
  )
}

export default GpsTable

const blue = {
  200: '#A5D8FF',
  400: '#3399FF'
}

const grey = {
  50: '#F3F6F9',
  100: '#E7EBF0',
  200: '#E0E3E7',
  300: '#CDD2D7',
  400: '#B2BAC2',
  500: '#A0AAB4',
  600: '#6F7E8C',
  700: '#3E5060',
  800: '#2D3843',
  900: '#1A2027'
}

const CustomTablePagination = styled(TablePagination)(
  ({ theme }) => `
  & .${classes.toolbar} {
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    // justify-content:space-around;
    gap: 0px;
    margin: 0 5px;
  }
  
  /* Update the select label styles */
  & .${classes.displayedRows} {
    margin: 0;
  }
  
  /* Additional styles to hide "Rows per page" label and dropdown */
  & .MuiTablePagination-actions {
    justify-content: flex-end;
  }

  & .MuiTypography-caption {
    display: none; // Hide the "Rows per page" label
  }

  & .MuiSelect-select {
    display: none; // Hide the dropdown
  }

  & .MuiTablePagination-select {
    display: none; // Hide the select wrapper
  }

  /* Update the select styles */
  & .${classes.select} {
    padding: 2px;
    border: 1px solid ${theme.palette.mode === 'dark' ? grey[800] : grey[200]};
    border-radius: 50px;
    background-color: transparent;
    
    &:hover {
      background-color: ${theme.palette.mode === 'dark' ? grey[800] : grey[50]};
    }
    
    &:focus {
      outline: 1px solid ${
        theme.palette.mode === 'dark' ? blue[400] : blue[200]
      };
    }
  }
  
  /* Update the displayed rows styles */
  & .${classes.displayedRows} {
    // margin-left: 2rem;
  }
  `
)
