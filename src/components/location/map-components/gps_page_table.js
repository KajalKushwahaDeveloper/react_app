import React, { useEffect, useState } from "react";
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import { Checkbox } from "@mui/material";
import { styled } from "@mui/system";
import { EMULATOR_URL } from "../../../constants";
import "../../../scss/table.scss";
import "../../../scss/button.scss";

const columns = [
  { id: 'status', label: 'Status' },
  { id: 'emulatorSsid', label: 'ID', minWidth: 80 },
  { id: 'telephone', label: 'Number', minWidth: 20 },
  { id: 'address', label: 'Address', minWidth: 80 },
  { id: 'select', label: 'Select', minWidth: 40 },
  { id: 'tripStatus', label: 'Trip Status', minWidth: 60 },
  { id: 'action', label: 'Action', minWidth: 60 },
];

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
    <div sx={{ width: "auto", maxWidth: "100%", fontSize: "1rem" }} className="gps_table_container">
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {(rowsPerPage > 0
                ? data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                : data
              ).map((row) => (
                <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                  {columns.map((column) => {
                    const value = row[column.id];
                    return (
                      <TableCell key={column.id} align={column.align}>
                        {column.format && typeof value === "number"
                          ? column.format(value)
                          : column.id === "select" ? (
                            <Checkbox
                              checked={selectedEmulator === row.id}
                              onChange={() => handleEmulatorCheckboxChange(row.id)}
                            />
                          ) : column.id === "status" ? (
                            <div
                              style={{
                                padding:".5rem 1rem",
                                background:
                                  row.status === "ACTIVE"
                                    ? "#16BA00" // Green when ACTIVE
                                    : row.status === "INACTIVE"
                                      ? "#ff4d4d" // Red when INACTIVE
                                      : "#FFFF00", // Yellow when IDLE
                              }}
                            >
                              {row.status || "N/A"}
                            </div>
                          ) : column.id === "action" ? (
                            <button
                              style={{
                                height: "35px",
                                width: "70px",
                                backgroundColor: isStartedMap[row.id] ? "red" : "green",
                                color: "white",
                              }}
                              onClick={() => handleActionButtonClick(row)}
                            >
                              {isStartedMap[row.id] ? "Stop" : "Start"}
                            </button>
                          ) : (
                            value
                          )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}

              {emptyRows > 0 && (
                <TableRow style={{ height: 34 * emptyRows }}>
                  <TableCell colSpan={7} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
        rowsPerPageOptions={[3]}
        component="div"
        count={data.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
    </div>
  );
}

export default GpsTable;