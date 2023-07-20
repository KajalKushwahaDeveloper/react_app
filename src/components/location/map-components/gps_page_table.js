import React, { useEffect, useState } from "react";

import TablePagination, {
  tablePaginationClasses as classes,
} from "@mui/base/TablePagination";
import { Checkbox } from "@mui/material";
import { styled } from "@mui/system";
import { EMULATOR_URL } from "../../../constants";
import "../../../scss/table.scss";
import "../../../scss/button.scss";

const GpsTable = ({ showToast, setSelectedEmId }) => {
  // State variables
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(3);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(3); // Number of items to display per page
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEmulator, setSelectedEmulator] = useState(1);
  const [isStartedMap, setIsStartedMap] = useState({});

 
  const handleActionButtonClick = (row) => {
  
    setIsStartedMap((prevIsStartedMap) => ({
      ...prevIsStartedMap,
      [row.id]: !prevIsStartedMap[row.id] // Toggle the status for the specific row
    }));
  };

  
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
          setData(deserializedData);
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
    setLoading(true);
    const { success, error } = fetchData();
    if (success) {
      showToast("Fetched Emulators successfully", "success");
    } else {
      showToast(error, "error");
    }
  }, []);
  
  useEffect(() => {
    setLoading(false);
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

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div sx={{ width: "auto", maxWidth: "100%" , fontSize:"1rem"}} className="gps_table_container">
      <table aria-label="custom pagination gps_page_table">
        <thead>
          <tr className="gps_page_tr">
            <th>Status</th>
            <th >ID</th>
            <th>Number</th>
            <th>Address</th>
            <th>Select</th>
            <th>Trip Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {(rowsPerPage > 0
            ? data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            : data
          ).map((row) => (
            <tr key={row.id || "N/A"} className="gps_page_tr">
              <td
               style={{
                background:
                  row.status === "ACTIVE"
                    ? "#16BA00" // Green when ACTIVE
                    : row.status === "INACTIVE"
                    ? "#ff4d4d" // Red when INACTIVE
                    : "#FFFF00", // Yellow when IDLE
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
              <td style={{ width: "auto" }} align="right">
                {row.address || "N/A"}
              </td>
              <td style={{ width: "auto" }} align="right">
                <Checkbox
                  checked={selectedEmulator === row.id}
                  onChange={() => handleEmulatorCheckboxChange(row.id)}
                />
              </td>
              <td style={{ width: "auto" }} align="right">
                {row.tripStatus || "N/A"}
              </td>
              <td style={{ width: 120 }} align="right">
                <button
                  style={{
                    height: "45px",
                    width:"70px",
                    backgroundColor: isStartedMap[row.id] ? "red" : "green",
                    color: "white",
                  }}
                  onClick={() => handleActionButtonClick(row)}
                  >
                    {isStartedMap[row.id] ? "Stop" : "Start"}
                  {/* {row.user === null ? "start" : "stop"} */}
                </button>
              </td>
            </tr>
          ))}

          {emptyRows > 0 && (
            <tr style={{ height: 34 * emptyRows }}>
              <td colSpan={5} />
            </tr>
          )}
        </tbody>

        <tfoot>
          <tr>
            <CustomTablePagination
              rowsPerPageOptions={[3, 5, 10, { label: "All", value: -1 }]}
              colSpan={7}
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
        justify-content:space-arround;
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