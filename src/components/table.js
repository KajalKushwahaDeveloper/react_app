import * as React from "react";
import { styled } from "@mui/system";
import TablePagination, {
  tablePaginationClasses as classes,
} from "@mui/base/TablePagination";
import "../scss/table.scss";
const GpsTable = () => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(3);

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    //Driver table start//
    <div sx={{ width: 'auto', maxWidth: "100%"}}>
      <table aria-label="custom pagination table">
        <thead>
          <tr>
            <th>Status</th>
            <th>ID</th>
            <th>Number</th>
            <th>Driver</th>
            <th>Truck</th>
            <th>Trailer</th>
          </tr>
        </thead>
        <tbody>
        <tr>
              <td style={{background:"limegreen"}}>online</td>
              <td style={{ width: "4rem", padding:"0 .5rem" }} align="right">
               EML1
              </td>
              <td style={{ width: "4rem", padding:"0 .5rem" }} align="right">
                123-456-7890
              </td>
              <td style={{ width: "4rem", padding:"0 .5rem" }} align="right">
               Viktor vovk
              </td>
              <td style={{ width: "4rem", padding:"0 .5rem" }} align="right">
               11
              </td>
              <td style={{ width: "4rem", padding:"0 .5rem" }} align="right">
               33452
              </td>
            </tr>
          {/* {(rowsPerPage > 0
            ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            : rows
          ).map((row) => (
            <tr key={row.status}>
              <td>{row.status}</td>
              <td style={{ width: 120 }} align="right">
                {row.mac}
              </td>
              <td style={{ width: 120 }} align="right">
                {row.number}
              </td>
              <td style={{ width: 120 }} align="right">
                {row.assign}
              </td>
              <td style={{ width: 120 }} align="right">
                {row.action}
              </td>
            </tr>
          ))} */}

          {emptyRows > 0 && (
            <tr style={{ height: 34 * emptyRows }}>
              <td colSpan={3} />
            </tr>
          )}
        </tbody>
        <tfoot>
          <tr>
            <CustomTablePagination
              rowsPerPageOptions={[3, 5, { label: "All", value: -1 }]}
              colSpan={rows.length}
              count={rows.length}
              rowsPerPage={rowsPerPage}
              page={page}
              slotProps={{
                select: {
                  "aria-label": "rows per page",
                },
                actions: {
                  showFirstButton: true,
                  showLastButton: true,
                },
              }}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </tr>
        </tfoot>
      </table>
    </div>
    //Driver table ui end//
  );
};
export default GpsTable;

function createData(status, mac, number, assign, action) {
  return { status, mac, number, assign, action };
}

const rows = [
 
];


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
    & .${classes.actions} {
      padding: 2px;
 
   border-radius: 50px;
      text-align: center;
      display:flex;
      align-items:center;
      justify-content:center;
  
      /* Hide the sort button */
      & button {
        display: none;
      }
  
      /* Show only the navigation buttons */
      & > :not(:first-child):not(:last-child) {
        display: block;
      }
    }
  
    /* Update the displayed rows styles */
    & .${classes.displayedRows} {
      margin-left: 2rem;
    }
    `
);
