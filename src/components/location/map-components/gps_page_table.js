import React, { useEffect, useState } from "react";

import TablePagination, {
  tablePaginationClasses as classes,
} from "@mui/base/TablePagination";
import { Checkbox, Hidden } from "@mui/material";
import { styled } from "@mui/system";
import { EMULATOR_URL, TRIP_TOGGLE, USER_URL } from "../../../constants";
import "../../../scss/table.scss";
import "../../../scss/button.scss";

import ApiService from "../../../ApiService";

const GpsTable = ({ showToast, setSelectedEmId, data }) => {
  // State variables
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(3);
  const [emptyRows, setEmptyRows] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(3); // Number of items to display per page
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEmulator, setSelectedEmulator] = useState(1);

  // Fetch data from API
  const fetchData = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(EMULATOR_URL, {
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
        if (deserializedData != null) {
          console.log("useFetch Sending ID : ", deserializedData[0].id);
          setSelectedEmId(deserializedData[0].id);
        }
        setLoading(false);
        return { success: true, error: null };
      }
    } catch (error) {
      console.log("Data Error: " + error);
      setError(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("Data : THIS RAN");
    if(data!=null){
      console.log("Data : ", data);
      setEmptyRows(rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage));
    setLoading(false);
    }else{
      setLoading(true);
    }
  }, [data]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleEmulatorCheckboxChange = (id) => {
    setSelectedEmulator(id);
    setSelectedEmId(id);
  };

  const handleActionButtonClick = async (row) => {
    if (row.tripStatus === "RESTING") {
      showToast("Cannot resume trip of resting emulator!", "error");
      return;
    }
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
      <div style = {{height:'90%',width:"100%"}}> 
      <table aria-label="custom pagination table">
        <thead>
          <tr>
            <th>Status</th>
            <th>ID</th>
            <th>Number</th>
            <th style={{maxWidth:'300px'}}>Address</th>
            <th>Select</th>
            <th>
              TripStatus/
              <br />
              Action
            </th>
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
                  // : row.status === "inactive"
                  // ? "green"
                  // : row.status === "idle"
                  // ? "yellow"
                  // : "",
                }}
              >
                {row.status || "N/A"}
              </td>
              <td style={{ width: "auto" }} align="right">
                {row.emulatorSsid || "N/A"}
              </td>
              <td style={{ width: "auto" }} align="right">
                {row.telephone || "N/A"}
              </td>
              <td>
                <div 
                style={{
                  maxwidth:"15%",
                  maxHeight:"5rem",
                 overflowY:'auto',
                }}
                align="left">
                {row.address || "N/A"}
              
                </div>
                </td>
              <td style={{ width: "auto" }} align="right">
                <Checkbox
                  checked={selectedEmulator === row.id}
                  onChange={() => handleEmulatorCheckboxChange(row.id)}
                />
              </td>
              <td style={{maxHeight:"50px", width: "auto" }} align="right">
                <p>{row.tripStatus}</p>
                <button
                  style={{
                    height: "auto",
                    backgroundColor:
                      row.tripStatus === "RUNNING"
                        ? "#440000"
                        : row.tripStatus === "PAUSED"
                        ? "#909000"
                        : row.tripStatus === "STOP"
                        ? "#118811"
                        : row.tripStatus === "RESTING"
                        ? "#444444"
                        : "N/A",
                    color: "white",
                  }}
                  onClick={() => handleActionButtonClick(row)}
                >
                  {row.tripStatus === "RUNNING"
                    ? "PAUSE"
                    : row.tripStatus === "PAUSED"
                    ? "RESUME"
                    : row.tripStatus === "STOP"
                    ? "START"
                    : row.tripStatus === "RESTING"
                    ? "RESUME"
                    : row.tripStatus === "FINISHED"
                    ? ""
                    : "N/A"}
                </button>
              </td>
            </tr>
          ))}

          {emptyRows!= null && emptyRows > 0 && (
            <tr style={{ height: 35 * emptyRows }}>
              <td colSpan={5} />
            </tr>
          )}
        </tbody>

        <tfoot>
          <tr>
            <CustomTablePagination
              rowsPerPageOptions={[3, 5, 10, { label: "All", value: -1 }]}
              colSpan={5}
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
