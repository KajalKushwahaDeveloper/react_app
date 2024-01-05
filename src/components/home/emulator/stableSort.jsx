import * as React from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { visuallyHidden } from "@mui/utils";
import AddIcon from "@mui/icons-material/Add";

function descendingComparator(a, b, orderBy) {
  if (a[orderBy] === null || a[orderBy] === undefined) {
    return 1;
  }
  // special case for emulatorCount
  if (orderBy === "user") {
    // add check if user exist else return 0
    if (
      a[orderBy].user === null ||
      a[orderBy].user === undefined ||
      !a[orderBy].user?.firstName
    ) {
      return 0;
    }
    if (
      b[orderBy].user === null ||
      b[orderBy].user === undefined ||
      !b[orderBy].user?.firstName
    ) {
      return 1;
    }
    if (a[orderBy].user?.firstName < b[orderBy].user?.firstName) {
      return -1;
    }
    if (a[orderBy].user?.firstName > b[orderBy].user?.firstName) {
      return 1;
    }
  } else {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
  }
  return 0;
}

export function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}
// Since 2020 all major browsers ensure sort stability with Array.prototype.sort().
// stableSort() brings sort stability to non-modern browsers (notably IE11). If you
// only support modern browsers you can replace stableSort(exampleArray, exampleComparator)
// with exampleArray.slice().sort(exampleComparator)
export function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}
const headCells = [
  {
    id: "user",
    numeric: false,
    disablePadding: false,
    label: "ACTIONS",
  },
  {
    id: "status",
    numeric: false,
    disablePadding: true,
    label: "STATUS",
  },
  {
    id: "emulatorSsid",
    numeric: false,
    disablePadding: false,
    label: "SSID",
  },
  {
    id: "telephone",
    numeric: false,
    disablePadding: false,
    label: "TEL. #",
  },
  {
    id: "user",
    numeric: false,
    disablePadding: false,
    label: "ASSIGNED",
  },
  {
    id: "createdAt",
    numeric: false,
    disablePadding: false,
    label: "CREATED",
  },
];
export function EnhancedTableHead(props) {
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
              sx={{ fontWeight: "bold", color: "#007dc6" }}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}
EnhancedTableHead.propTypes = {
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};
export function EnhancedTableToolbar(props) {
  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        backgroundColor: "#007dc6",
        borderRadius: "5px 5px 0px 0px",
      }}
    >
      <Typography
        sx={{ flex: "1 1 100%", color: "white" }}
        variant="h6"
        id="tableTitle"
        component="div"
      >
        EMULATORS
      </Typography>
      <Tooltip title="ADD EMULATOR">
        <IconButton onClick={props.handleOpen} sx={{ color: "white" }}>
          <AddIcon />
        </IconButton>
      </Tooltip>
    </Toolbar>
  );
}
EnhancedTableToolbar.propTypes = {
  handleOpen: PropTypes.func.isRequired,
};
