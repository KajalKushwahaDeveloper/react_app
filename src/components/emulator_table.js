import React, { useEffect, useState } from "react";

import  TablePagination,{
  tablePaginationClasses as classes,
} from "@mui/base/TablePagination";

import { styled } from "@mui/system";
import { EMULATOR_URL, USER_ASSIGN_EMULATOR_URL } from "../constants";
import "../scss/table.scss";
import "../scss/button.scss";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ApiService from "../ApiService";
import { EMULATOR_DELETE_URL } from "../constants";
import { GetEmulatorApi, deleteEmulatorApi } from "../components/api/emulator";
import { display } from "@material-ui/system";
import { Tooltip } from "@mui/material";
const EmulatorTable = ({
  showToast,
  handleAssignUserButtonClick,
  userAssingedEmulator,
  setUserAssingedEmulator,
  handleEmulatorTelephonePopup,
  handleGeneratedIdButtonClick,
  emulatorEditedId,
}) => {
  // State variables
  const [emulators, setEmulators] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(3); // Number of items to display per page
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (emulatorEditedId != null) {
      if (emulatorEditedId == 0) {
        fetchData();
      } else {
        refreshEditedEmulator(emulatorEditedId);
      }
    }
  }, [emulatorEditedId]);

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
      showToast(`Updated user table!`, "success");
      setEmulators(updatedData);
    } else {
      showToast("Failed to update user table" + error, "error");
      return { success: false, error: "Failed to unassign user" };
    }
  };

  //assign/unassign button
  const handleActionButtonClick = async (row) => {
    console.log("row data in emulator_page:", row);
    if (row.user != null) {
      const token = localStorage.getItem("token");
      console.log("token : ", token);
      try {
        const response = await fetch(USER_ASSIGN_EMULATOR_URL + "/" + row.id, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("response:", response);

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

        console.log("Data Previous : " + emulators);
        const result = await response.text();
        console.log("result:", result);
        const updatedData = emulators.map((item) => {
          if (item.id === row.id) {
            console.log("Data Found");
            return { ...item, user: null };
          }
          return item;
        });
        showToast(`User Un-Assigned`, "success");
        console.log("Data Updated : " + emulators);
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
        console.log("data45:", data);
        console.log("Data Updated : " + data);
        showToast("emulator deleted", "success");
        fetchData();
      } else {
        showToast("emulator not deleted", "error");
      }
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

  //Refresh component after 30000 ms/ 30 seconds
  // useEffect(() => {
  //   const fetchDataInterval = setInterval(() => {
  //     setLoading(true);
  //     const { success, error } = fetchData();
  //     if (success) {
  //       showToast("Fetched Emulators successfully", "success");
  //     } else {
  //       showToast(error, "error");
  //     }
  //   }, 30000);

  //   return () => {
  //     clearInterval(fetchDataInterval);
  //   };
  // }, []);

  useEffect(() => {
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

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, emulators.length - page * rowsPerPage);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="table-responsive tableBox">
 <table aria-label="custom pagination table" className="table shadow mb-0 n=">
        <thead style={{background:"#007dc6"}}>
          <tr>
            <th>STATUS</th>
            <th>SERIAL NO</th>
            <th>NUMBER</th>
            <th>ASSIGNED</th>
            <th>ACTION</th>
          </tr>
        </thead>
        <tbody>
          {(rowsPerPage > 0
            ? emulators.slice(
                page * rowsPerPage,
                page * rowsPerPage + rowsPerPage
              )
            : emulators
          ).map((row) => (
            <tr key={row.id || "N/A"}>
              <td>{row.status || "N/A"}</td>
              <td style={{  display: "flex",
              alignItems:"center",
              overflow: "hidden",
              whiteSpace: "nowrap",}}>
                <div
                  style={{
                    maxWidth: "60px",
                    marginTop:".8rem"
                  }}
                >
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
                      }}
                      align="right"
                    >
                      {row.emulatorSsid || "N/A"}
                    </div>
                  </Tooltip>
                </div>

                <IconButton
                  style={{
                    height: "auto",
                    width: "35px",
                    float: "right",
                  }}
                  aria-label="edit"
                >
                  <EditIcon onClick={() => handleGeneratedIdButtonClick(row)} />
                </IconButton>
              </td>
              <td  align="right">
                {row.telephone || "N/A"}
              </td>
              <td align="right">
                {row.user?.firstName || "N/A"} {row.user?.lastName || "N/A"}
              </td>
              <td
                style={{ display:"flex",width: "auto", padding:".5rem 0"}}
                align="right"
              >
                <IconButton aria-label="delete">
                  <EditIcon onClick={() => handleEmulatorTelephonePopup(row)} />
                </IconButton>
                <IconButton
                  style={{
                    margin: "2px",
                  }}
                  aria-label="delete"
                >
                  <DeleteIcon onClick={() => handleDeleteButtonClick(row)} />
                </IconButton>
                <button
                  style={{
                    backgroundColor: row.user === null ? "green" : "red",
                    // width: row.user === null ? "95px" : "",
                    width: "6.5rem",
                  }}
                  onClick={() => handleActionButtonClick(row)}
                >
                  {row.user === null ? "assign" : "unassign"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>

        <tfoot className="table_footer" style={{ border: "none" }}>
          <tr style={{ textAlign: "center" }}>
            <td colSpan={5} style={{ textAlign: "right", paddingTop:".5rem"}}>
              <CustomTablePagination
                rowsPerPageOptions={[10, 20, 30, { label: "All", value: -1 }]}
                colSpan={5}
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
              <span style={{ color: "#bbbaba", fontSize: ".9rem" }}>
                Emulator Table
              </span>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default EmulatorTable;

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
