import * as React from "react";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { CircularProgress } from "@mui/material";
import {
  stableSort,
  getComparator,
  EnhancedTableToolbar,
  EnhancedTableHead,
} from "./stableSort";
import ApiService from "../../ApiService";
import { USER_CHANGE_STATUS_URL, USER_URL } from "../../constants";
import OnlinePredictionIcon from '@mui/icons-material/OnlinePrediction';

export default function UserTable({
  showToast,
  handleEditButtonClick,
  userEditedId,
  userAssingedEmulator,
  updatedData,
}) {
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("calories");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  const [userData, setUserData] = React.useState([]);

  React.useEffect(() => {
    if (userEditedId != null) {
      if (userEditedId == 0) {
        fetchUsers();
      } else {
        refreshEditedUser(userEditedId);
      }
    }
  }, [userEditedId, updatedData]);

  React.useEffect(() => {
    if (userAssingedEmulator != null) {
      refreshUser(userAssingedEmulator.user?.id);
    }
  }, [userAssingedEmulator]);

  const handleActionButtonClick = async (id, status) => {
    if (status == "ENABLED") {
      status = "DISABLED";
    } else {
      status = "ENABLED";
    }
    const userStatusChange = {
      id,
      status,
    };

    const token = localStorage.getItem("token");
    console.log("token : ", token);
    const response = await fetch(USER_CHANGE_STATUS_URL, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(userStatusChange),
    });
    console.log("response:", response);
    if (!response.ok || response.status !== 200) {
      return { success: false, error: "Failed to add user" };
    }
    console.log("Data Previous : " + userData);
    const result = await response.text();
    console.log("result:", result);
    const updatedData = userData.map((item) => {
      if (item.id === id) {
        console.log("Data Found");
        return { ...item, status: userStatusChange.status };
      }
      return item;
    });
    console.log("Data Updated : " + userData);
    setUserData(updatedData);
  };

  //DELETED BUTTON
  const handleDeleteButtonClick = async (user) => {
    const confirmed = window.confirm(
      "Delete this user : " + user.firstName + " " + user.lastName + "?"
    );
    if (confirmed) {
      const token = localStorage.getItem("token");
      const { success, data, error } = await ApiService.makeApiCall(
        USER_URL,
        "DELETE",
        null,
        token,
        user.id
      );

      if (success) {
        const updatedData = userData.filter((item) => item.id !== user.id);
        console.log("Data Updated : " + data);
        setUserData(updatedData);
        showToast("User deleted", "success");
      } else {
        showToast("User not deleted", "error");
      }
    }
  };
  // Fetch data from API
  const refreshEditedUser = async (userId) => {
    const token = localStorage.getItem("token");
    const { success, data, error } = await ApiService.makeApiCall(
      USER_URL,
      "GET",
      null,
      token,
      userId
    );
    if (success) {
      const updatedData = userData.map((item) => {
        if (item.id === data.id) {
          return data;
        }
        return item;
      });
      showToast(`Updated user table!`, "success");
      setUserData(updatedData);
    } else {
      showToast("Failed to update user table", "error");
      return { success: false, error: "Failed to unassign user" };
    }
  };
  // Fetch data from API
  const refreshUser = async (userId) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(USER_URL + "/" + userId, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("refreshUser response:", response);

      // eslint-disable-next-line no-mixed-operators
      if (!response.ok || response.status !== 200) {
        if (userId !== undefined) {
          showToast("Failed to update user table1122", "error");
        }
        return { success: false, error: "Failed to unassign user" };
      }
      const responseData = await response.text();
      console.log("refreshUser  " + responseData);
      const result = JSON.parse(responseData);
      console.log("refreshUser result : " + result);
      console.log("refreshUser emulatorCount : " + result.emulatorCount);
      console.log(
        "refreshUser allEmulatorsCount : " +
          result.emulatorCount?.allEmulatorsCount
      );
      console.log(
        "refreshUser activeEmulatorsCount : " +
          result.emulatorCount?.activeEmulatorsCount
      );
      const updatedData = userData.map((item) => {
        if (item.id === result.id) {
          return {
            ...item,
            emulatorCount: {
              ...item.emulatorCount,
              allEmulatorsCount: result.emulatorCount?.allEmulatorsCount,
              activeEmulatorsCount: result.emulatorCount?.activeEmulatorsCount,
            },
          };
        }
        return item;
      });
      showToast(`Updated user table!`, "success");
      setUserData(updatedData);
    } catch (error) {
      console.log("refreshUser error : " + error);
      showToast(`Failed to update user table ${error}`, "error");
    }
  };

  // Fetch data from API
  const fetchUsers = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(USER_URL, {
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
        setUserData(deserializedData);
        setLoading(false);
        return { success: true, error: null };
      }
    } catch (error) {
      console.log("User Data Error: " + error);
      setError(error.message);
      setLoading(false);
    }
  };

  React.useEffect(() => {
    setLoading(true);
    const { success, error } = fetchUsers();
    if (success) {
      showToast("Fetched Users successfully", "success");
    } else {
      showToast(error, "error");
    }
  }, []);
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
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - userData.length) : 0;

  const visibleRows = React.useMemo(
    () =>
      stableSort(userData, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      ),
    [order, orderBy, page, userData, rowsPerPage]
  );

  if (loading) {
    return (
      <>
        <h3>loading Users...</h3>
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
        <EnhancedTableToolbar />
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size={"medium"}
          >
            <EnhancedTableHead
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              rowCount={userData.length}
            />
            <TableBody>
              {visibleRows.map((row, index) => {
                const labelId = `enhanced-table-checkbox-${index}`;
                const createdAtDate = new Date(row.createdAt);
                const formattedDate = createdAtDate.toISOString().split("T")[0];
                const onlineEmulator = row.emulatorCount?.activeEmulatorsCount ? row.emulatorCount?.activeEmulatorsCount : 0 ;
                const allEmulator = row.emulatorCount?.activeEmulatorsCount ? row.emulatorCount?.allEmulatorsCount : 0;
             
                return (
                  <TableRow
                    hover
                    role="checkbox"
                    tabIndex={-1}
                    key={row.id}
                    sx={{ cursor: "pointer" }}
                  >
                    <TableCell id={labelId} scope="row">
                      {row.firstName + " " + row.lastName || "N/A"}
                    </TableCell>
                    <TableCell align="left"> {row.email || "N/A"}</TableCell>
                    <TableCell align="left">{row.telephone || "N/A"}</TableCell>
                    <TableCell align="left">
                      {/** print online emulator, and if greater than 0, draw icon after number */}
                      {onlineEmulator > 0 ? onlineEmulator : 0}
                      {onlineEmulator > 0 ? <OnlinePredictionIcon color="success"/> : ""} 
                       /
                      {allEmulator} </TableCell>
                    <TableCell align="left">{formattedDate || "N/A"}</TableCell>
                  </TableRow>
                );
              })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: 53 * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 30, 50]}
          component="div"
          count={userData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
}
