import React, { useEffect, useState } from "react";

import TablePagination, {
  tablePaginationClasses as classes,
} from "@mui/base/TablePagination";
import { Checkbox, Hidden } from "@mui/material";
import { styled } from "@mui/system";
import {
  EMULATOR_NOTIFICATION_URL,
  EMULATOR_URL,
  TRIP_HISTORY,
  TRIP_TOGGLE,
  USER_URL,
} from "../../../constants";
//scss
import "../../../scss/table.scss";
import "../../../scss/button.scss";

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
import ContactDialogComponent from "./ContactDialogComponent";

import ApiService from "../../../ApiService";
import PopUpEmulatorHistory from "./popup_emulator_history";
import { Tooltip } from "@mui/material";

const GpsTable = ({ showToast, setSelectedEmId, selectedEmId, data, setSelectedEmulator, selectedEmulator,setAssignedTelephoneNumber,AssignedTelephoneNumber }) => {
  // State variables
  const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(3);
  const [emptyRows, setEmptyRows] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(3); // Number of items to display per page
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [contactDialog, setContactDialog] = useState({
    open: false,
    dialogType: "",
  });

  const [openEmulatorHistoryPopUp, setOpenEmulatorHistoryPopUp] =
    useState(false);
  const [selectedEmulatorForHistoryData, setSelectedEmulatorForHistoryData] =
    useState(null);

  const handleClose = (id) => {
    setOpenEmulatorHistoryPopUp(false);
    setSelectedEmulatorForHistoryData(null);
  };

  const handleContactDetails = (dialogType, emulatorId) => {
    setContactDialog((state) => ({
      dialogType,
      emulatorId,
      open: !state.open,
    }));
  };

  useEffect(() => {
 
    if (data != null) {
      setEmptyRows(
        rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage)
      );
      if (selectedEmulator == null && selectedEmId != null) {
        setSelectedEmulator(data[0]?.id);
        setSelectedEmId(data[0]?.id);
      }
      setLoading(false);
    } else {
      setLoading(true);
    }
    if(selectedEmId != null && selectedEmulator != null){
      if (selectedEmId !== selectedEmulator) {
        setSelectedEmulator(selectedEmId);
        const selectedEmIndex = data.findIndex(
          (item) => item.id === selectedEmId
        );
        // Calculate the new active page based on the selected checkbox index and rowsPerPage
        if (selectedEmIndex !== -1) {
          const newActivePage = Math.floor(selectedEmIndex / rowsPerPage);
          setPage(newActivePage);
        }
      }
    }
  }, [data, page, rowsPerPage, selectedEmId, selectedEmulator, setSelectedEmId]);

   const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleEmulatorCheckboxChange = (id,telephone) => {
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
    console.log("row data in emulator_page:", row);
    const token = localStorage.getItem("token");
    console.log("token : ", token);
    const { success, data, error } = await ApiService.makeApiCall(
      TRIP_TOGGLE + "/" + row.id,
      "GET",
      null,
      token
    );
    if (success) {
      showToast("CHANGED TRIP STATUS", "success");
    } else {
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
    <div sx={{ width: "auto", maxWidth: "100%" }} gps_table_container>
      <div style={{ height: "90%", width: "100%" }}>
        <table aria-label="custom pagination table">
          <thead>
            <tr>
              <th>Status</th>
              <th>ID / History</th>
              <th>Number</th>
              <th style={{ maxWidth: "300px" }}>Address</th>
              <th>Select</th>
              <th>Trip/Action</th>
            </tr>
          </thead>

          <tbody>
            {(rowsPerPage > 0
              ? data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              : data
            ).map((row) => (
              <tr key={row.id || "N/A"}>
                <td
                  style={{
                    background: row.status === "ACTIVE" ? "#16BA00" : "#ff4d4d",
                    display: "flex",
                    alignItems: "center",
                    padding: ".5rem",
                  }}
                >
                  {row.status || "N/A"}

                  {/* Restart/Reset Button */}

                  <RestartAltIcon
                    onClick={() => handleRestartButtonClick(row)}
                  />

                  {/* Restart/Reset Button */}
                </td>

                <td
                  style={{ width: "auto", alignItems: "center" }}
                  align="right"
                >
                  <div style={{ display: "flex", maxWidth: "150px" }}>
                    <Tooltip
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
                          maxWidth: "150px",
                          textAlign: "center",
                          marginTop: ".7rem",
                        }}
                        align="right"
                      >
                        {row.emulatorSsid || "N/A"}
                      </div>
                    </Tooltip>

                    {/* Show History */}
                    <IconButton>
                      <HistoryIcon
                        onClick={() => handleHistoryButtonClick(row)}
                      />
                    </IconButton>
                  </div>
                  
                </td>
                <td
                  style={{
                    display: "flex",
                    width: "auto",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                  align="right"
                >
                  {row.telephone || "N/A"}
                  <IconButton
                    onClick={() => handleContactDetails("call", row.id)}
                  >
                    <CallRoundedIcon />
                  </IconButton>

                  <IconButton
                    onClick={() => handleContactDetails("messages", row.id)}
                  >
                    <MessageRoundedIcon />
                  </IconButton>
                </td>
                <td style={{ maxWidth: "150px" }}>
                  <Tooltip title={row.address || "N/A"} placement="top">
                    <div
                      style={{
                        textOverflow: "ellipsis",
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                      }}
                      align="right"
                    >
                      {row.address || "N/A"}
                    </div>
                  </Tooltip>
                </td>
                <td style={{ width: "auto" }} align="right">
                  <Checkbox
                    checked={selectedEmulator === row.id}
                    onChange={() => handleEmulatorCheckboxChange(row.id,row.telephone)}
                  />
                </td>
                <td style={{ width: "auto" }} align="right">
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    {/* Trip Status */}
                    <p style={{ textAlign: "center" }}>{row.tripStatus}</p>
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
                      {row.tripStatus === "STOP" && <PlayCircleOutlineIcon />}
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
                count={data.length}
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
          dialogType={contactDialog.dialogType}
          open={contactDialog.open}
          emulatorId={contactDialog.emulatorId}
          handleContactDialog={handleContactDetails}
          showToast={showToast}
        />
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
