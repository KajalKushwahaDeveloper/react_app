import React, { useEffect, useState } from "react";

import TablePagination, {
  tablePaginationClasses as classes,
} from "@mui/material/TablePagination";
import { Backdrop, CircularProgress } from "@mui/material";
import { styled } from "@mui/system";
import {
  EMULATOR_NOTIFICATION_URL,
  TRIP_HISTORY,
  TRIP_TOGGLE,
} from "../../../constants";

//scss
import "../../../scss/map.scss";
import "../../../scss/button.scss";
import "../../../scss/global.scss";

//icons
import IconButton from "@mui/material/IconButton";
import HistoryIcon from "@mui/icons-material/History";
import PauseCircleOutlineIcon from "@mui/icons-material/PauseCircleOutline";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CallRoundedIcon from "@mui/icons-material/CallRounded";
import MessageRoundedIcon from "@mui/icons-material/MessageRounded";
import RestartAltIcon from "@mui/icons-material/RestartAlt";

//components
import ContactDialogComponent from "./Phone/ContactDialogComponent";

import ApiService from "../../../ApiService";
import PopUpEmulatorHistory from "./popup_emulator_history";
import { Tooltip } from "@mui/material";
import { useViewPort } from "../../../ViewportProvider";
import { useStates } from "../../../StateProvider";
import { useEmulatorStore } from "../../../stores/emulator/store.tsx";
import {
  compareEmulatorsCompletely,
  compareSelectedEmulator,
} from "../../../stores/emulator/types_maps.tsx";
import { compareSelectedDeviceForDialog } from "../../../stores/call/storeCall.tsx";
import CustomNoteComponent from "./Phone/CustomNoteComponent.js";



const GpsTable = () => {
  const fetchEmulators = useEmulatorStore((state) => state.fetchEmulators);

  const emulators = useEmulatorStore(
    (state) => state.emulators,
    (oldEmulators, newEmulators) => {
      compareEmulatorsCompletely(oldEmulators, newEmulators);
    }
  );

  const selectedEmulator = useEmulatorStore(
    (state) => state.selectedEmulator,
    (oldEmulators, newEmulators) => {
      compareSelectedEmulator(oldEmulators, newEmulators);
    }
  );

  const selectEmulator = useEmulatorStore((state) => state.selectEmulator);

  const selectDevice = useEmulatorStore((state) => state.selectDevice);

  const devices = useEmulatorStore((state) => state.devices);

  const hoveredEmulator = useEmulatorStore((state) => state.hoveredEmulator);

  // State variables
  const { staticEmulators, showToast } = useStates();

  const { width } = useViewPort();
  const breakpoint = 620;
  const breakpointThreeTwenty = 320;
  const breakpointTab = 992;
  const isTabBreakpoint = width < breakpointTab;

  const isMobile = width < breakpoint;
  const isMobileThreeTwenty = width <= breakpointThreeTwenty;

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [loading, setLoading] = useState(true);
  const [messageLoading, setMessageLoading] = useState(false);

  const [openEmulatorHistoryPopUp, setOpenEmulatorHistoryPopUp] =
    useState(false);

  const [selectedEmulatorForHistoryData, setSelectedEmulatorForHistoryData] =
    useState(null);

  const handleHistoryClose = () => {
    setOpenEmulatorHistoryPopUp(false);
    setSelectedEmulatorForHistoryData(null);
  };

  const [contactDialogOptions, setContactDialogOptions] = useState({
    open: false,
    dialogType: "",
    emulatorId: null,
  });

  const selectedDevice = useEmulatorStore(
    (state) => state.selectedDevice,
    (oldSelectedDevice, newSelectedDevice) =>
      compareSelectedDeviceForDialog(oldSelectedDevice, newSelectedDevice)
  );

  useEffect(() => {
    // When call comes/ ends.
    if (selectedDevice === null || selectedDevice.state === null) {
      setContactDialogOptions({
        open: false,
        dialogType: "",
        emulatorId: null,
      });
      return;
    } else if (selectedDevice.state === "Incoming") {
      setContactDialogOptions({
        open: true,
        dialogType: "call",
        emulatorId: null,
      });
    } else if (selectedDevice.state === "On call") {
      setContactDialogOptions({
        open: true,
        dialogType: "call",
        emulatorId: null,
      });
    } else if (
      selectedDevice.state === "Offline" ||
      selectedDevice.state === "Ready"
    ) {
      setContactDialogOptions({
        open: false,
        dialogType: "",
        emulatorId: null,
      });
    }
  }, [selectedDevice]);

  const handleCallIconClicked = (emulator) => {
    const device = devices.find((device) => device.emulatorId === emulator.id);
    selectDevice(device);
    setContactDialogOptions({
      open: true,
      dialogType: "call",
      emulatorId: null,
    });
  };

  const handleMessageIconClicked = (row) => {
    setContactDialogOptions({
      open: true,
      dialogType: "message",
      emulatorId: row.id,
    });
  };

  useEffect(() => {
    if (emulators != null) {
      setLoading(false);
    } else {
      setLoading(true);
    }
    if (hoveredEmulator !== null) {
      const selectedEmIndex = emulators.findIndex(
        (emulator) => emulator.id === hoveredEmulator.id
      );
      // Calculate the new active page based on the selected checkbox index and rowsPerPage
      if (selectedEmIndex !== -1) {
        const newActivePage = Math.floor(selectedEmIndex / rowsPerPage);
        setPage(newActivePage);
      }
    }
    if (selectedEmulator !== null) {
      const selectedEmIndex = emulators.findIndex(
        (emulator) => emulator === selectedEmulator
      );
      // Calculate the new active page based on the selected checkbox index and rowsPerPage
      if (selectedEmIndex !== -1) {
        const newActivePage = Math.floor(selectedEmIndex / rowsPerPage);
        setPage(newActivePage);
      }
    }
  }, [emulators, page, rowsPerPage, selectedEmulator, hoveredEmulator]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 20));
    setPage(0);
  };

  const handleEmulatorCheckboxChange = (emulatorRow) => {
    if (selectedEmulator?.id !== emulatorRow.id) {
      selectEmulator(emulatorRow);
    } else {
      selectEmulator(null);
    }
  };

  const handleHistoryButtonClick = async (emulatorForHistory) => {
    setMessageLoading(true);
    const token = localStorage.getItem("token");
    const { success, data, error } = await ApiService.makeApiCall(
      TRIP_HISTORY + "/" + emulatorForHistory.id,
      "GET",
      null,
      token
    );
    if (success) {
      setMessageLoading(false);
      setSelectedEmulatorForHistoryData(data);
      setOpenEmulatorHistoryPopUp(true);
    } else {
      showToast("Error Fetching History", "error");
    }
  };

  const handleRestartButtonClick = async (row) => {
    const token = localStorage.getItem("token");
    const { success, data, error } = await ApiService.makeApiCall(
      EMULATOR_NOTIFICATION_URL + "/" + row.id,
      "POST",
      null,
      token
    );
    if (success) {
      showToast("Notification send", "success");
    } else {
      showToast("Error", "error");
    }
  };

  const handleActionButtonClick = async (row) => {
    if (row.tripStatus === "FINISHED") {
      showToast("Trip already Finished!", "error");
      return;
    }
    if (row.tripStatus === "STOP") {
      showToast("No Trip Created yet!", "error");
      return;
    }
    const token = localStorage.getItem("token");
    const { success, data, error } = await ApiService.makeApiCall(
      TRIP_TOGGLE + "/" + row.id,
      "GET",
      null,
      token
    );
    if (success) {
      showToast("CHANGED TRIP STATUS", "success");
      fetchEmulators();
    } else {
      console.error(`Error CHANGING TRIP STATUS : ${error}`);
      showToast("Error CHANGING TRIP STATUS", "error");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ position: "relative" }}>
      <Backdrop color="primary" style={{ zIndex: 4 }} open={messageLoading}>
        <CircularProgress color="primary" />
      </Backdrop>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          position: isMobile ? "static" : "absolute",
          marginTop: isMobile ? "1px" : "0",
          top: isMobile ? "0px" : isTabBreakpoint ? "143px" : "125px",
          paddingRight: isMobile && "0px",
          paddingLeft: isMobile && "0px",
        }}
      >
        <div
          className={
            isMobile === true
              ? "table-responsive-mobile tableBox"
              : "table-responsive"
          }
        >
          <>
            <table
              aria-label="custom pagination table"
              className=" shadow mb-0 n="
            >
              <tbody>
                {(rowsPerPage > 0
                  ? emulators.slice(
                      page * rowsPerPage,
                      page * rowsPerPage + rowsPerPage
                    )
                  : emulators
                )?.map((emulator, index) => (
                  <tr
                    key={emulator.id || "N/A"}
                    style={{
                      background:
                        selectedEmulator?.id === emulator.id
                          ? "lightblue"
                          : hoveredEmulator?.id === emulator.id
                          ? "lightpink"
                          : "white",
                    }}
                    onClick={() => handleEmulatorCheckboxChange(emulator)}
                  >
                    <td
                      style={{
                        background:
                          emulator.status === "ACTIVE"
                            ? "#16BA00"
                            : emulator.status === "INACTIVE"
                            ? "#FFA500"
                            : "#ff4d4d",
                        textAlign: "center",
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
                      <div style={{ width: "100%" }}>
                        <Tooltip
                          title={emulator.telephone || "N/A"}
                          placement="top"
                        >
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <div>{emulator.telephone || "N/A"}</div>
                            {/* Icons */}
                            <div style={{ display: "flex" }}>
                              {/* calling icon */}
                              <IconButton
                                size="small"
                                onClick={() => handleCallIconClicked(emulator)}
                              >
                                <CallRoundedIcon fontSize="small" />
                              </IconButton>

                              {/* message icon */}
                              <IconButton
                                size="small"
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
                        <CustomNoteComponent emulator={emulator} />
                      </div>
                    </td>
                    <td align="right">
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          maxWidth: 85,
                        }}
                      >
                        {/* Trip Status Action */}
                        <IconButton
                          size="small"
                          onClick={() => handleActionButtonClick(emulator)}
                        >
                          <Tooltip title={emulator.tripStatus}>
                            {emulator.tripStatus === "RUNNING" && (
                              <PauseCircleOutlineIcon fontSize="small" />
                            )}
                            {emulator.tripStatus === "PAUSED" && (
                              <PlayCircleOutlineIcon fontSize="small" />
                            )}
                            {emulator.tripStatus === "STOP" && (
                              <PlayCircleOutlineIcon fontSize="small" />
                            )}
                            {emulator.tripStatus === "RESTING" && (
                              <PlayCircleOutlineIcon fontSize="small" />
                            )}
                            {emulator.tripStatus === "FINISHED" && (
                              <CheckCircleOutlineIcon fontSize="small" />
                            )}
                          </Tooltip>
                        </IconButton>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="table_footer">
                <tr>
                  <CustomTablePagination
                    rowsPerPageOptions={[
                      20,
                      40,
                      60,
                      { label: "All", value: -1 },
                    ]}
                    colSpan={6}
                    count={emulators.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                     style={{overflow:"hidden"}}
                  />
                </tr>
              </tfoot>
            </table>

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
        <div></div>
      </div>
    </div>
  );
};

export default GpsTable;

const blue = {
  200: "#A5D8FF",
  400: "#3399FF",
};

const grey = {
  50: "#F3F6F9",
  100: "#E7EBF0",
  200: "#E0E3E7",
  300: "#CDD2D7",
  400: "#B2BAC2",
  500: "#A0AAB4",
  600: "#6F7E8C",
  700: "#3E5060",
  800: "#2D3843",
  900: "#1A2027",
};

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
  /* Update the select label styles */
  & .${classes.selectLabel} {
    margin: 0;
    @media (max-width: 425px) {
      flex-shrink: 1;
    }

    @media (min-width: 426px) {
      flex-shrink: 0;
    }
  }
  
  /* Update the select styles */
  & .${classes.select} {
    padding: 2px;
    border: 1px solid ${
      theme.palette.mode === "dark" ? grey[800] : grey[200]
    };
    border-radius: 50px;
    background-color: transparent;
    
    &:hover {
      background-color: ${
        theme.palette.mode === "dark" ? grey[800] : grey[50]
      };
    }
    
    &:focus {
      outline: 1px solid ${
        theme.palette.mode === "dark" ? blue[400] : blue[200]
      };
    }
  }
  
  /* Update the displayed rows styles */
  & .${classes.displayedRows} {
    // margin-left: 2rem;
  }
  `
);

