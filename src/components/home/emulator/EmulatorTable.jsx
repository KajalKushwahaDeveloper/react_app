import * as React from "react";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { CircularProgress } from "@mui/material";
import {
  stableSort,
  getComparator,
  EnhancedTableToolbar,
  EnhancedTableHead,
} from "./stableSort";

import {
  EMULATOR_URL,
  USER_ASSIGN_EMULATOR_URL,
  EMULATOR_DELETE_URL,
} from "../../../constants";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ApiService from "./../../../ApiService";
import { GetEmulatorApi } from "../../../components/api/emulator";
import { Tooltip } from "@mui/material";
import { useStates } from "../../../StateProvider";
import { CustomTablePagination } from "../../CustomTablePagination";

export default function EmulatorTable({
  handleAssignUserButtonClick,
  userAssingedEmulator,
  setUserAssingedEmulator,
  handleEmulatorTelephonePopup,
  emulatorEditedId,
  handleGeneratedIdButtonClick,
  emulatorData,
  updateSerial,
  handleCreateEmulator,
}) {
  const { showToast } = useStates();
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("calories");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  const [emulators, setEmulators] = React.useState([]);

  React.useEffect(() => {
    setEmulators(emulatorData);
  }, [emulatorData]);

  React.useEffect(() => {
    if (emulatorEditedId != null) {
      if (emulatorEditedId == 0) {
        fetchData();
      } else {
        refreshEditedEmulator(emulatorEditedId);
      }
    }
  }, [emulatorEditedId]);

  React.useEffect(() => {
    const updateSerialEmu = async () => {
      const { success, data, error } = await GetEmulatorApi();
      if (success) {
        setEmulators(data);
      }
    };
    updateSerialEmu();
  }, [updateSerial]);

  // Fetch data from API
  const refreshEditedEmulator = async (emulatorEditedId) => {
    const token = localStorage.getItem("token");
    const { success, data, error } = await ApiService.makeApiCall(
      EMULATOR_URL,
      "GET",
      null,
      token,
      emulatorEditedId
    );
    if (success) {
      const updatedData = emulators.map((item) => {
        if (item.id === data.id) {
          return data;
        }
        return item;
      });
      showToast(`Updated Emulator table!`, "success");
      setEmulators(updatedData);
    } else {
      showToast("Failed to update Emulator table" + error, "error");
      return { success: false, error: "Failed to unassign user" };
    }
  };

  //assign/unassign button
  const handleAssignButtonClick = async (row) => {
    if (row.user != null) {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(USER_ASSIGN_EMULATOR_URL + "/" + row.id, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok || response.status !== 200) {
          showToast("Failed to unassign user", "error");
          return { success: false, error: "Failed to unassign user" };
        }
        // Send the removed user ID to refresh in user table
        const userAssignedEmulator = {
          user: {
            id: row.user?.id,
          },
        };
        setUserAssingedEmulator(userAssignedEmulator);
        const updatedData = emulators.map((item) => {
          if (item.id === row.id) {
            return { ...item, user: null };
          }
          return item;
        });
        showToast(`User Un-Assigned`, "success");
        setEmulators(updatedData);
      } catch (error) {
        showToast(`Failed to unassign user ${error}`, "error");
      }
    } else {
      handleAssignUserButtonClick(row);
    }
  };

  // Fetch data from API // GET  API
  const fetchData = async () => {
    setLoading(true);
    const { success, data, error } = await GetEmulatorApi();

    if (success) {
      setEmulators(data);
      setLoading(false);
    } else {
      setError(error);
      setLoading(false);
    }
  };

  //delete button
  const handleDeleteButtonClick = async (emulator) => {
    const confirmed = window.confirm(
      "Delete this emulator : " + emulator.emulatorSsid + "?"
    );
    if (confirmed) {
      const token = localStorage.getItem("token");
      const { success, data, error } = await ApiService.makeApiCall(
        EMULATOR_DELETE_URL,
        "DELETE",
        null,
        token,
        emulator.id
      );

      if (success) {
        showToast("emulator deleted", "success");
        fetchData();
      } else {
        showToast("emulator not deleted", "error");
      }
    }
  };

  React.useEffect(() => {
    setLoading(true);
    const { success, error } = fetchData();
    if (success) {
      showToast("Fetched Emulators successfully", "success");
    } else {
      showToast(error, "error");
    }
  }, []);

  React.useEffect(() => {
    if (userAssingedEmulator != null) {
      const updatedData = emulators.map((item) => {
        if (item.id === userAssingedEmulator.id) {
          return { ...item, user: userAssingedEmulator.user };
        }
        return item;
      });
      setEmulators(updatedData);
    }
  }, [userAssingedEmulator]);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - emulators.length) : 0;

  const visibleRows = React.useMemo(
    () =>
      stableSort(emulators, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      ),
    [order, orderBy, page, emulators, rowsPerPage]
  );

  if (loading) {
    return (
      <>
        <h3>loading Emulators...</h3>
        <CircularProgress />
      </>
    );
  }

  if (error) {
    return (
      <>
        <div className="error">
          <h1>Something went wrong!</h1>
          <p>Error: {error}</p>
        </div>
      </>
    );
  }

  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", mb: 2 }}>
        <EnhancedTableToolbar handleOpen={handleCreateEmulator} />
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size={"small"}
          >
            <EnhancedTableHead
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              rowCount={emulators.length}
            />
            <TableBody>
              {visibleRows.map((row, index) => {
                const labelId = `enhanced-table-checkbox-${index}`;
                const createdAtDate = new Date(row.createdAt);
                const formattedDate = createdAtDate.toISOString().split("T")[0];
                return (
                  <TableRow hover tabIndex={-1} key={row.id}>
                    <TableCell align="left">
                      <div className="d-flex align-items-center justify-content-center flex-column">
                        <div className="d-flex align-items-center justify-content-center flex-sm-row">
                          <IconButton
                            size="small"
                            style={{
                              height: "40px",
                              width: "40px",
                              marginRight: "10px",
                              borderRadius: "50%",
                              backgroundColor: "red",
                              color: "#fff",
                            }}
                            aria-label="delete"
                            onClick={() => handleDeleteButtonClick(row)}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                          <button
                            className="btn btn-sm"
                            style={{
                              backgroundColor:
                                row.user === null ? "green" : "red",
                              color: "white",
                            }}
                            onClick={() => handleAssignButtonClick(row)}
                          >
                            {row.user === null ? "ASSIGN__" : "UNASSIGN"}
                          </button>
                        </div>
                        {/* can use for vertical */}
                      </div>
                    </TableCell>
                    {/* status */}
                    <TableCell id={labelId} scope="row">
                      {row.status || "N/A"}
                    </TableCell>
                    {/* serial code */}
                    <TableCell align="left">
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <div>
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
                              }}
                              align="left"
                            >
                              {row.emulatorSsid || "N/A"}
                            </div>
                          </Tooltip>
                        </div>

                        <div>
                          <IconButton
                            size="small"
                            style={{
                              height: "auto",
                              width: "35px",
                              float: "right",
                            }}
                            aria-label="edit"
                          >
                            <EditIcon
                              fontSize="small"
                              onClick={() => handleGeneratedIdButtonClick(row)}
                            />
                          </IconButton>
                        </div>
                      </div>
                    </TableCell>
                    {/* telephone */}
                    {/* FIXME: properly allign this */}
                    <TableCell align="left">
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <div>
                          <Tooltip
                            title={row.telephone || "N/A"}
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
                              align="left"
                            >
                              {row.telephone || "N/A"}
                            </div>
                          </Tooltip>
                        </div>

                        <div>
                          <IconButton
                            size="small"
                            style={{
                              height: "auto",
                              width: "35px",
                              float: "right",
                            }}
                            aria-label="edit"
                          >
                            <EditIcon
                              fontSize="small"
                              onClick={() => handleEmulatorTelephonePopup(row)}
                            />
                          </IconButton>
                        </div>
                      </div>
                    </TableCell>
                    {/* Assigned */}
                    <TableCell align="left">
                      <Tooltip
                        title={
                          (row.user?.firstName || "N/A") +
                          " " +
                          (row.user?.lastName || "N/A")
                        }
                        placement="top"
                        alignItems="start"
                        display="flex"
                      >
                        <div
                          style={{
                            textOverflow: "ellipsis",
                            overflow: "hidden",
                            whiteSpace: "nowrap",
                            maxWidth: "150px",
                            textAlign: "start",
                          }}
                          align="left"
                        >
                          {(row.user?.firstName || "N/A") +
                            " " +
                            (row.user?.lastName || "N/A")}
                        </div>
                      </Tooltip>
                    </TableCell>
                    {/* REGISTERED */}
                    <TableCell align="left">{formattedDate || "N/A"}</TableCell>
                  </TableRow>
                );
              })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: 33 * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <CustomTablePagination
          rowsPerPageOptions={[10, 30, 50]}
          count={emulators.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          style={{overflow:"hidden"}}
        />
      </Paper>
    </Box>
  );
}
