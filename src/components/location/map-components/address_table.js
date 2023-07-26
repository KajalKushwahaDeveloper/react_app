import React, { useEffect, useState } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TablePagination from "@mui/material/TablePagination";
import { Checkbox } from "@mui/material";
import { styled } from "@mui/system";
import { EMULATOR_URL } from "../../../constants";
import "../../../scss/table.scss";
import "../../../scss/button.scss";

const columns = [
  { id: "fromAddress", label: "From Address", minWidth: "100%" },
  { id: "toAddress", label: "To Address", minWidth: " 100%" },
];

const AddressTable = ({ tripData }) => {
  const fromAddress =
    tripData?.fromAddress[0]?.long_name +
      ", " +
      tripData?.fromAddress[1]?.long_name +
      ", " +
      tripData?.fromAddress[2]?.long_name +
      ", " +
      tripData?.fromAddress[3]?.long_name || "N/A";
  const toAddress =
    tripData?.toAddress[0]?.long_name +
      ", " +
      tripData?.toAddress[1]?.long_name +
      ", " +
      tripData?.toAddress[2]?.long_name +
      " ," +
      tripData?.toAddress[3]?.long_name || "N/A";

  return (
    <div sx={{ width: "auto", maxWidth: "100%", fontSize: "1rem" }}>
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer sx={{ maxHeight: "auto" ,width:"42rem"}}>
          <Table stickyHeader aria-label="sticky" sx={{width:"100%",height:"5rem"}}>
            <TableHead>
              <TableRow>
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
            <TableBody style={{ border: "none" }}>
              <TableRow hover role="checkbox">
                <TableCell>{fromAddress || "N/A"}</TableCell>
                <TableCell  align="right">
                  {toAddress || "N/A"}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </div>
  );
};

export default AddressTable;
