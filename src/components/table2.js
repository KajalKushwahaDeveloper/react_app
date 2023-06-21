import React, { useEffect, useState } from 'react';

import TablePagination, {
    tablePaginationClasses as classes,
  } from "@mui/base/TablePagination";
  
import { styled } from "@mui/system";
import { EMULATOR_URL } from '../constants';
import "../scss/table.scss";


const Table2 =  ({ showToast }) => {
  // State variables
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // Number of items to display per page
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data from API
  const fetchData = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(EMULATOR_URL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        }
      });
      if (!response.ok || response.status !== 200) {
        return { success: false, error: "Invalid credentials" };
      } else {
        const responseData = await response.text();
        const deserializedData = JSON.parse(responseData);
        console.log("Data : " + deserializedData);
        setData(deserializedData);
        setLoading(false);
        return { success: true, error: null };
      }
    } catch (error) {
        console.log("Data : " + error);
      setError(error.message);
      setLoading(false);
    }
  };

  
  useEffect(() => {
    setLoading(true);
    const { success, error } = fetchData();
    if(success){
        showToast("Fetched Emulators successfully", "success")
    }else{
        showToast(error, "error")
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
    rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }
    
  return (
    <Root sx={{ width: 500, maxWidth: '100%' }}>
      <table aria-label="custom pagination table">
        <thead>
          <tr>
            <th>Status</th>
            <th>MAC</th>
            <th>Number</th>
            <th>Assign</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {(rowsPerPage > 0
            ? data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            : data
          ).map((row) => (
            <tr key={row.id}>
              <td>{row.status}</td>
              <td style={{ width: 120 }} align="right">
                {row.emulatorSsid}
              </td>
              <td style={{ width: 120 }} align="right">
                {row.id}
              </td>
              <td style={{ width: 120 }} align="right">
                {row.user?.username || 'N/A'}
              </td>
              <td style={{ width: 120 }} align="right">
                {/* Action buttons */}
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
              rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
              colSpan={5}
              count={data.length}
              rowsPerPage={rowsPerPage}
              page={page}
              SelectProps={{
                inputProps: { 'aria-label': 'rows per page' },
                native: true,
              }}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </tr>
        </tfoot>
      </table>
    </Root>
  );
}

export default Table2;

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
      font-family: IBM Plex Sans, sans-serif;
      font-size: 0.875rem;
      border-collapse: collapse;
      width: auto;
      padding:0.5rem;
    }
  
    td,
    th {
      border: 1px solid ${theme.palette.mode === "dark" ? grey[800] : grey[200]};
      text-align: left;
      padding: 12px;
    }
  
    th {
      background-color: ${theme.palette.mode === "dark" ? grey[900] : grey[100]};
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