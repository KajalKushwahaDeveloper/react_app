import React, { useEffect, useState } from "react";

import TablePagination, {
  tablePaginationClasses as classes,
} from "@mui/base/TablePagination";
import { Checkbox, Hidden } from "@mui/material";
import { styled } from "@mui/system";
import {
  EMULATOR_NOTIFICATION_URL,
  TRIP_HISTORY,
  TRIP_TOGGLE,
} from "../../../constants";
//scss
import "../../../scss/table.scss";
import "../../../scss/button.scss";
import ColumnResize from "react-table-column-resizer";

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

const GpsTable = ({
  showToast,
  setSelectedEmId,
  selectedEmId,
  emulators,
  setSelectedEmulator,
  selectedEmulator,
  setAssignedTelephoneNumber,
  AssignedTelephoneNumber,
}) => {
  // State variables
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(3);
  const [emptyRows, setEmptyRows] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(3); // Number of items to display per page
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDevice, setSelectedDevice] = useState({
    open: false,
    dialogType: "",
    emulatorId: null,
    index: null,
  });

  const [openEmulatorHistoryPopUp, setOpenEmulatorHistoryPopUp] =
    useState(false);
  const [selectedEmulatorForHistoryData, setSelectedEmulatorForHistoryData] =
    useState(null);

  const handleClose = (id) => {
    setOpenEmulatorHistoryPopUp(false);
    setSelectedEmulatorForHistoryData(null);
  };

  const handleContactDetails = (dialogType, emulator, emulatorIndex) => {
    console.log("handleContactDetails", dialogType);
    console.log("handleContactDetails", emulator);
    console.log("handleContactDetails", emulatorIndex);
    setSelectedDevice((prevState) => ({
      ...prevState,
      open: !prevState.open,
      dialogType: dialogType,
      emulatorId: emulator && emulator.id !== undefined ? emulator.id : null,
      index: emulatorIndex,
    }));
  };

  useEffect(() => {
    if (emulators != null) {
      setEmptyRows(
        rowsPerPage -
          Math.min(rowsPerPage, emulators.length - page * rowsPerPage)
      );
      if (selectedEmulator == null && selectedEmId != null) {
        setSelectedEmulator(emulators[0]?.id);
        setSelectedEmId(emulators[0]?.id);
      }
      setLoading(false);
    } else {
      setLoading(true);
    }
    if (selectedEmId != null && selectedEmulator != null) {
      if (selectedEmId !== selectedEmulator) {
        setSelectedEmulator(selectedEmId);
        const selectedEmIndex = emulators.findIndex(
          (item) => item.id === selectedEmId
        );
        // Calculate the new active page based on the selected checkbox index and rowsPerPage
        if (selectedEmIndex !== -1) {
          const newActivePage = Math.floor(selectedEmIndex / rowsPerPage);
          setPage(newActivePage);
        }
      }
    }
  }, [
    emulators,
    page,
    rowsPerPage,
    selectedEmId,
    selectedEmulator,
    setSelectedEmId,
    setSelectedEmulator,
  ]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleEmulatorCheckboxChange = (id, telephone) => {
    setAssignedTelephoneNumber(telephone);

    if (selectedEmulator === id) {
      // If the clicked checkbox is already selected, unselect it
      setSelectedEmulator(null);
      setSelectedEmId(null);
    } else {
      // Otherwise, select the clicked checkbox
      setSelectedEmulator(id);
      setSelectedEmId(id);
    }
  };

  const handleHistoryButtonClick = async (emulatorForHistory) => {
    console.log("selected Emulator to Show It's history :", emulatorForHistory);
    const token = localStorage.getItem("token");
    console.log("token : ", token);
    const { success, data, error } = await ApiService.makeApiCall(
      TRIP_HISTORY + "/" + emulatorForHistory.id,
      "GET",
      null,
      token
    );
    if (success) {
      setSelectedEmulatorForHistoryData(data);
      setOpenEmulatorHistoryPopUp(true);
    } else {
      showToast("Error Fetching History", "error");
    }
  };

  const handleRestartButtonClick = async (row) => {
    console.log("emulator notification :", row);
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
    console.log("token : ", token);
    const { success, data, error } = await ApiService.makeApiCall(
      TRIP_TOGGLE + "/" + row.id,
      "GET",
      null,
      token
    );
    if (success) {
      console.log(`CHANGED TRIP STATUS : ${data.tripStatus}`);
      showToast("CHANGED TRIP STATUS", "success");
    } else {
      console.log(`Error CHANGING TRIP STATUS : ${error}`);
      showToast("Error CHANGING TRIP STATUS", "error");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="table-responsive tableBox" gps_table_container>
      <table
        aria-label="custom pagination table"
        className="table-responsive table shadow mb-0 n="
      >
        <thead>
          <tr>
            <th>Status</th>
            <th>ID / History</th>
            <ColumnResize
              id={1}
              resizeEnd={(width) => console.log("resize end", width)}
              resizeStart={() => console.log("resize start")}
              className="columnResizer"
            />
            <th>Number</th>
            <ColumnResize
              id={2}
              resizeEnd={(width) => console.log("resize end", width)}
              resizeStart={() => console.log("resize start")}
              className="columnResizer"
            />
            <th>Address</th>
            <ColumnResize
              id={3}
              resizeEnd={(width) => console.log("resize end", width)}
              resizeStart={() => console.log("resize start")}
              className="columnResizer"
            />
            <th>Select</th>
            <th>Trip/Action</th>
          </tr>
        </thead>

        <tbody>
          {(rowsPerPage > 0
            ? emulators.slice(
                page * rowsPerPage,
                page * rowsPerPage + rowsPerPage
              )
            : emulators
          ).map((row, index) => (
            <tr key={row.id || "N/A"}>
              <td
                style={{
                  background:
                    row.status === "ACTIVE"
                      ? "#16BA00"
                      : row.status === "INACTIVE"
                      ? "#FFA500"
                      : "#ff4d4d",
                  display: "flex",
                  alignItems: "center",
                  padding: "1rem .1rem",
                }}
              >
                {row.status || "N/A"}
                {/* Restart/Reset Button */}
                <RestartAltIcon onClick={() => handleRestartButtonClick(row)} />
              </td>

              {/* ID/HISTORY */}
              <td style={{ maxWidth: "120px" }}>
                <Tooltip
                  style={{ display: "flex", alignItems: "center" }}
                  title={row.emulatorSsid || "N/A"}
                  placement="top"
                  alignItems="center"
                  display="flex"
                >
                  <div
                    style={{
                      textOverflow: "ellipsis",
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {row.emulatorSsid || "N/A"}
                  </div>
                  {/* Show History */}
                  <IconButton>
                    <HistoryIcon
                      onClick={() => handleHistoryButtonClick(row)}
                    />
                  </IconButton>
                </Tooltip>
              </td>
              <td className="column_resizer_body" />

              {/* TELEPHONE */}
              <td style={{ maxWidth: "120px" }}>
                <Tooltip
                  style={{ display: "flex", alignItems: "center" }}
                  title={row.telephone || "N/A"}
                  placement="top"
                >
                  <div
                    style={{
                      textOverflow: "ellipsis",
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                      flexGrow: 1,
                    }}
                  >
                    {row.telephone || "N/A"}
                  </div>

                  {/* Icons */}
                  <div style={{ display: "flex", maxWidth: "100px" }}>
                    {/* calling icon */}
                    <IconButton
                      onClick={() => handleContactDetails("call", row, index)}
                    >
                      <CallRoundedIcon />
                    </IconButton>

                    {/* message icon */}
                    <IconButton
                      onClick={() =>
                        handleContactDetails("messages", row, index)
                      }
                    >
                      <MessageRoundedIcon />
                    </IconButton>
                  </div>
                </Tooltip>
              </td>
              <td className="column_resizer_body" />

              {/* ADDRESS */}

              <td style={{ maxWidth: "100px" }}>
                <Tooltip title={row.address || "N/A"} placement="top">
                  <div
                    style={{
                      textOverflow: "ellipsis",
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {row.address || "N/A"}
                  </div>
                </Tooltip>
              </td>
              <td className="column_resizer_body" />

              <td style={{ width: "auto" }} align="right">
                <Checkbox
                  checked={selectedEmulator === row.id}
                  onChange={() =>
                    handleEmulatorCheckboxChange(row.id, row.telephone)
                  }
                />
              </td>
              <td style={{ width: "auto" }} align="right">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  {/* Trip Status */}
                  <p style={{ marginTop: "0", marginBottom: "0" }}>
                    {row.tripStatus}
                  </p>
                  {/* Trip Status Action */}
                  <IconButton>
                    {row.tripStatus === "RUNNING" && (
                      <PauseCircleOutlineIcon
                        onClick={() => handleActionButtonClick(row)}
                      />
                    )}
                    {row.tripStatus === "PAUSED" && (
                      <PlayCircleOutlineIcon
                        onClick={() => handleActionButtonClick(row)}
                      />
                    )}
                    {row.tripStatus === "STOP" && (
                      <PlayCircleOutlineIcon
                        onClick={() => handleActionButtonClick(row)}
                      />
                    )}
                    {row.tripStatus === "RESTING" && (
                      <PlayCircleOutlineIcon
                        onClick={() => handleActionButtonClick(row)}
                      />
                    )}
                    {row.tripStatus === "FINISHED" && (
                      <CheckCircleOutlineIcon />
                    )}
                  </IconButton>
                </div>
              </td>
            </tr>
          ))}
        </tbody>

        <tfoot className="table_footer">
          <tr>
            <CustomTablePagination
              rowsPerPageOptions={[3, 5, 10, { label: "All", value: -1 }]}
              colSpan={6}
              count={emulators.length}
              rowsPerPage={rowsPerPage}
              page={page}
              SelectProps={{
                inputProps: { "aria-label": "rows per page" },
                native: true,
              }}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </tr>
        </tfoot>
      </table>
      <PopUpEmulatorHistory
        showToast={showToast}
        handleClose={handleClose}
        open={openEmulatorHistoryPopUp}
        emulatorHistory={selectedEmulatorForHistoryData}
      />
      <ContactDialogComponent
        emulators={emulators}
        selectedDevice={selectedDevice}
        setSelectedDevice={setSelectedDevice}
        handleContactDialog={handleContactDetails}
        showToast={showToast}
      />
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
      /* Remove the spacer element */
      & .${classes.spacer} {
        display: none;
      }
    
      /* Update the toolbar styles */
      & .${classes.toolbar} {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content:space-around;
        gap: 10px;
      }
    
      /* Update the select label styles */
      & .${classes.selectLabel} {
        margin: 0;
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
    
      /* Update the actions styles */
      .${classes.actions} {
        padding: 2px;
        border-radius: 50px;
        text-align: center;
        display: flex;
      }
    
      /* Update the displayed rows styles */
      & .${classes.displayedRows} {
        margin-left: 2rem;
      }
      `
);
