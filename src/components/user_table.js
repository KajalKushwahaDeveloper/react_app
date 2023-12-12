import React, { useEffect, useState } from "react";

import  TablePagination,{
  tablePaginationClasses as classes,
} from "@mui/base/TablePagination";

import { styled } from "@mui/system";
import { USER_URL } from "../constants";
import { USER_CHANGE_STATUS_URL } from "../constants";
import "../scss/table.scss";
import "../scss/button.scss";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ApiService from "../ApiService";
import { bottomNavigationActionClasses } from "@mui/material";

const UserTable = ({
  showToast,
  handleEditButtonClick,
  userEditedId,
  userAssingedEmulator,
}) => {
  // State variables
  const [userData, setUserData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // Number of items to display per page
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (userEditedId != null) {
      if (userEditedId == 0) {
        fetchUsers();
      } else {
        refreshEditedUser(userEditedId);
      }
    }
  }, [userEditedId]);

  useEffect(() => {
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

      if (!response.ok || response.status !== 200) {
        showToast("Failed to update user table", "error");
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
        fetchUsers();
        return { success: true, error: null };
      }
    } catch (error) {
      console.log("User Data Error: " + error);
      setError(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    const { success, error } = fetchUsers();
    if (success) {
      showToast("Fetched Users successfully", "success");
    } else {
      showToast(error, "error");
    }
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, userData.length - page * rowsPerPage);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <Root sx={{ width: "auto", maxWidth: "100%" }}>
      <div className="table-responsive">
      <table aria-label="custom pagination table" className="w-100 shadow">
        <tbody>
          {(rowsPerPage > 0
            ? userData.slice(
                page * rowsPerPage,
                page * rowsPerPage + rowsPerPage
              )
            : userData
          ).map((row) => {
            const createdAtDate = new Date(row.createdAt);
            const formattedDate = createdAtDate.toISOString().split("T")[0];

            return (
              <tr key={row.id}>
                <div></div>
                <td align="right">
                  <div className="spcBetween">
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <h5>{row.firstName + " " + row.lastName || "N/A"}</h5>
                      <ul>
                        <li>Email : {row.email || "N/A"}</li>
                        <li>Tel. # : {row.telephone || "N/A"}</li>
                        <li>Registration Date : {formattedDate}</li>
                        <li>
                          Active Emulators :
                          {row.emulatorCount?.activeEmulatorsCount !== undefined
                            ? row.emulatorCount?.activeEmulatorsCount
                            : "Err"}
                          /
                          {row.emulatorCount?.allEmulatorsCount !== undefined
                            ? row.emulatorCount?.allEmulatorsCount
                            : "Err"}
                        </li>
                      </ul>
                    </div>
                    <div className="d-flex align-items-center justify-content-center flex-column">
                      <div className="d-flex align-items-center justify-content-center flex-sm-row mb-2">
                      <IconButton
                      size="small"
                        className="roundIncon"
                        style={{
                          height: "40px",
                          width: "40px",
                          marginRight: "10px",
                          borderRadius: "50%",
                          backgroundColor: "#007dc6",
                          color: "#fff",
                        }}
                        aria-label="edit"
                      >
                        <EditIcon fontSize="small" onClick={() => handleEditButtonClick(row)} />
                      </IconButton>
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
                      >
                        <DeleteIcon
                        fontSize="small"
                          onClick={() => handleDeleteButtonClick(row)}
                        />
                      </IconButton>
                      </div>
                      <button
                        className="btn btn-sm"
                        style={{
                          backgroundColor:
                            row.status === "ENABLED" ? "green" : "red",
                          color: "white",
                          height: "40px",
                          width: "7rem",
                        }}
                        onClick={() =>
                          handleActionButtonClick(row.id, row.status)
                        }
                      >
                        {row.status}
                      </button>
                    </div>
                  </div>
                </td>
              </tr>
            );
          })}

          {/* {emptyRows > 0 && (
            <tr style={{ height: 34 * emptyRows }}>
              <td colSpan={3} />
            </tr>
          )} */}
        </tbody>

        <tfoot>
          <tr>
            <CustomTablePagination
              rowsPerPageOptions={[10,20, 30, { label: "All", value: -1 }]}
              colSpan={3}
              count={userData.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </tr>
        </tfoot>
      </table>
      </div>
    </Root>
  );
};

export default UserTable;

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

const Root = styled("div")(
  ({ theme }) => `
              table {
                font-family: 'Raleway', sans-serif;
                font-size: 0.875rem;
                border-collapse: collapse;
                width: auto;
                padding:0.5rem;
              }
              
              td,
              th {
                border: 1px solid ${
                  theme.palette.mode === "dark" ? grey[800] : grey[200]
                };
                text-align: left;
                padding: 12px;
              }
              
              th {
                background-color: ${
                  theme.palette.mode === "dark" ? grey[900] : grey[100]
                };
              }
              `
);

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
