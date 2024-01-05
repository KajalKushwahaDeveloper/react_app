import React, { useEffect, useState } from "react";

import { USER_URL } from "../constants";
import { USER_CHANGE_STATUS_URL } from "../constants";
import "../scss/button.scss";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ApiService from "../ApiService";
import { Root, CustomTablePagination } from "./CustomTablePagination";

const UserTable = ({
  showToast,
  handleEditButtonClick,
  userEditedId,
  userAssingedEmulator,
  updatedData,
}) => {
  // State variables
  const [userData, setUserData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
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
  }, [userEditedId, updatedData]);

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
    const response = await fetch(USER_CHANGE_STATUS_URL, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(userStatusChange),
    });
    if (!response.ok || response.status !== 200) {
      return { success: false, error: "Failed to add user" };
    }
    const updatedData = userData.map((item) => {
      if (item.id === id) {
        return { ...item, status: userStatusChange.status };
      }
      return item;
    });
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

      // eslint-disable-next-line no-mixed-operators
      if (!response.ok || response.status !== 200) {
        if (userId !== undefined) {
          showToast("Failed to update user table1122", "error");
        }
        return { success: false, error: "Failed to unassign user" };
      }
      const responseData = await response.text();
      const result = JSON.parse(responseData);
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
      console.error("refreshUser error : " + error);
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
      console.error("User Data Error: " + error);
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
                            {row.emulatorCount?.activeEmulatorsCount !==
                            undefined
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
                            style={{
                              height: "40px",
                              width: "40px",
                              marginRight: "10px",
                              borderRadius: "50%",
                              backgroundColor: "#007dc6",
                              color: "#fff",
                            }}
                            aria-label="edit"
                            onClick={() => handleEditButtonClick(row)}
                          >
                            <EditIcon fontSize="small" />
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
                            onClick={() => handleDeleteButtonClick(row)}
                          >
                            <DeleteIcon fontSize="small" />
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
                rowsPerPageOptions={[10, 20, 30, { label: "All", value: -1 }]}
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
