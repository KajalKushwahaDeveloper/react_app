import  React,{useState, useEffect} from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles'; // Import styled from @mui/material/styles
import { EMULATOR_URL, USER_ASSIGN_EMULATOR_URL } from '../constants';

const columns = [
  { id: 'status', label: 'STATUS' },
  { id: 'emulatorSsid', label: 'SERIAL NO', minWidth: 120, align: 'right' },
  { id: 'telephone', label: 'NUMBER', minWidth: 120, align: 'right' },
  { id: 'user', label: 'ASSIGNED', minWidth: 120, align: 'right' },
  { id: 'action', label: 'ACTION', minWidth: 120, align: 'right' },
];

const EmulatorTable = ({
  showToast,
  handleAssignUserButtonClick,
  userAssingedEmulator,
  setUserAssingedEmulator,
}) => {
  // State variables
  const [data, setData] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(3);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [itemsPerPage] = React.useState(3); // Number of items to display per page
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);



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
      console.log("handleAssignUserButtonClick", row)
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
    setRowsPerPage(+event.target.value);
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
    <div style={{ width: '100%', maxWidth: '100%',borderRadius:"10rem"}}>
      <Paper sx={{ borderRadius: '1rem', border: 'none' }}>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow  style={{border:"none"}}>
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
            <TableBody style={{border:"none"}}>
              {data
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.id || 'N/A'}>
                    <TableCell>{row.status || 'N/A'}</TableCell>
                    <TableCell style={{ width: 120 }} align="right">
                      {row.emulatorSsid || 'N/A'}
                    </TableCell>
                    <TableCell style={{ width: 120 }} align="right">
                      {row.telephone || 'N/A'}
                    </TableCell>
                    <TableCell style={{ width: 120 }} align="right">
                      {row.user?.firstName || 'N/A'} {row.user?.lastName || 'N/A'}
                    </TableCell>
                    <TableCell style={{ width: 120 }} align="right">
                      <Button
                        style={{
                          height: '45px',
                          width: '85px',
                          backgroundColor: row.user === null ? 'green' : 'red',
                          color: 'white',
                        }}
                        onClick={() => handleActionButtonClick(row)}
                      >
                        {row.user === null ? 'assign' : 'unassign'}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}

              {emptyRows > 0 && (
                <TableRow style={{ height: 34 * emptyRows }}>
                  <TableCell colSpan={1} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
       <TablePagination
        // rowsPerPageOptions={[3]}
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
};

export default EmulatorTable;

