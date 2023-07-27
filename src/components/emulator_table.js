import React, { useEffect, useState } from "react";

import TablePagination, {
  tablePaginationClasses as classes,
} from "@mui/base/TablePagination";
import { Button, Modal } from "@mui/material";
import { styled } from "@mui/system";
import { EMULATOR_URL, USER_ASSIGN_EMULATOR_URL } from "../constants";
import "../scss/table.scss";
import "../scss/button.scss";

const EmulatorTable = ({
  showToast,
  handleAssignUserButtonClick,
  userAssingedEmulator,
  setUserAssingedEmulator,
}) => {
  // State variables
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(3);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(3); // Number of items to display per page
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleActionButtonClick = async (row) => {
    console.log("row data in emulator_page:", row)
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

        console.log("Data Previous : " + data);
        const result = await response.text();
        console.log("result:", result);
        const updatedData = data.map((item) => {
          if (item.id === row.id) {
            console.log("Data Found");
            return { ...item, user: null };
          }
          return item;
        });
        showToast(`User Un-Assigned`, "success");
        console.log("Data Updated : " + data);
        setData(updatedData);
      } catch (error) {
        showToast(`Failed to unassign user ${error}`, "error");
      }
    } else {
      handleAssignUserButtonClick(row);
    }
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
        console.log("")
        setData(deserializedData);
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

  //Refresh component after 30000 ms/ 30 seconds
  useEffect(() => {
    const fetchDataInterval = setInterval(() => {
      setLoading(true);
      const { success, error } = fetchData();
      if (success) {
        showToast("Fetched Emulators successfully", "success");
      } else {
        showToast(error, "error");
      }
    }, 30000);

    return () => {
      clearInterval(fetchDataInterval);
    };
  }, []);

  useEffect(() => {
    if (userAssingedEmulator != null) {
      const updatedData = data.map((item) => {
        if (item.id === userAssingedEmulator.id) {
          return { ...item, user: userAssingedEmulator.user };
        }
        return item;
      });
      setData(updatedData);
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
    rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="table-responsive tableBox">
      <table aria-label="custom pagination table" className="table shadow mb-0 n=">
        <thead>
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
            ? data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            : data
          ).map((row) => (
            <tr key={row.id || "N/A"}>
              <td>{row.status || "N/A"}</td>
              <td style={{ width: 120 }} align="right">
                {row.emulatorSsid || "N/A"}
              </td>
              <td style={{ width: 120 }} align="right">
                {row.telephone || "N/A"}
              </td>
              <td style={{ width: 120 }} align="right">
                {row.user?.firstName || "N/A"} {row.user?.lastName || "N/A"}
              </td>
              <td style={{ width: 120 }} align="right">
                <button className="btn w-100"
                  style={{
                    height: "40px",
                    backgroundColor: row.user === null ? "green" : "red",
                    color: "white",
                  }}
                  onClick={() => handleActionButtonClick(row)}
                >
                  {row.user === null ? "assign" : "unassign"}
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
        border: 1px solid ${theme.palette.mode === "dark" ? grey[800] : grey[200]
    };
        border-radius: 50px;
        background-color: transparent;
    
        &:hover {
          background-color: ${theme.palette.mode === "dark" ? grey[800] : grey[50]
    };
        }
    
        &:focus {
          outline: 1px solid ${theme.palette.mode === "dark" ? blue[400] : blue[200]
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
