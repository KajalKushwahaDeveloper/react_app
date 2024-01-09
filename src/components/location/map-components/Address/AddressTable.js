import React, { useEffect, useRef } from "react";
import { useViewPort } from "../../../../ViewportProvider.js";
import CreateTripButton from "../CreateTripButton.jsx";
import { useEmulatorStore } from "../../../../stores/emulator/store.tsx";
import Tooltip from "@mui/material/Tooltip";
import {
  compareTripDataChangedNullOrId,
  compareSelectedEmulatorChangedNullOrId,
} from "./utils.tsx";
import ApiService from "../../../../ApiService.js";
import { TRIP_URL } from "../../../../constants.js";
import "./AddressTable.css";
import ColumnResizer from "react-table-column-resizer";
import AddIcon from "@mui/icons-material/Add";
import { IconButton } from "@mui/material";
import RemoveIcon from "@mui/icons-material/Remove";

const AddressTable = () => {
  const tableValues = useRef(null);

  const tripData = useEmulatorStore(
    (state) => state.tripData,
    (oldTripData, newTripData) => {
      compareTripDataChangedNullOrId(oldTripData, newTripData);
    }
  );

  const selectedEmulator = useEmulatorStore(
    (state) => state.selectedEmulator,
    (oldSelectedEmulator, newSelectedEmulator) => {
      compareSelectedEmulatorChangedNullOrId(
        oldSelectedEmulator,
        newSelectedEmulator
      );
    }
  );

  const hoveredEmulator = useEmulatorStore((state) => state.hoveredEmulator);

  const [isLoading, setIsLoading] = React.useState(false);

  function setTableValues(emulator, tripData) {
    const fromAddress =
      tripData.fromAddress[0]?.long_name +
        ", " +
        tripData.fromAddress[1]?.long_name +
        ", " +
        tripData.fromAddress[2]?.long_name +
        ", " +
        tripData.fromAddress[3]?.long_name || "N/A";

    const toAddress =
      tripData.toAddress[0]?.long_name +
        ", " +
        tripData.toAddress[1]?.long_name +
        ", " +
        tripData.toAddress[2]?.long_name +
        " ," +
        tripData.toAddress[3]?.long_name || "N/A";
    const arrivalTime = "TODO";
    const totalTime = "TODO";
    const remainingDistance = "TODO";

    tableValues.current = {
      fromAddress,
      toAddress,
      arrivalTime,
      totalTime,
      remainingDistance,
    };
  }

  useEffect(() => {
    async function updateTableValues(hoveredEmulator) {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      const { data, error } = await ApiService.makeApiCall(
        TRIP_URL,
        "POST",
        { distance: 0 },
        token,
        hoveredEmulator.id
      );
      if (error) {
        console.error("Error fetching trip data", error);
        tableValues.current = null;
        setIsLoading(false);
        return;
      }
      if (data === null || data === undefined) {
        console.error("Data is null or undefined");
        tableValues.current = null;
        setIsLoading(false);
        return;
      }
      if (
        data.data.tripPoints === null ||
        data.data.tripPoints === undefined ||
        data.data.tripPoints.length === 0
      ) {
        console.error("Trip points are null or undefined or empty");
        tableValues.current = null;
        setIsLoading(false);
        return;
      }
      if (hoveredEmulator !== null) {
        setTableValues(hoveredEmulator, data.data);
      }
      setIsLoading(false);
    }

    if (hoveredEmulator === null && selectedEmulator === null) {
      tableValues.current = null;
      setIsLoading(false);
      return;
    }
    // handle hovered emulator
    if (hoveredEmulator !== null && hoveredEmulator !== undefined) {
      //if hovered emulator is not selected emulator
      if (
        selectedEmulator === null ||
        selectedEmulator === undefined ||
        selectedEmulator.id !== hoveredEmulator.id
      ) {
        updateTableValues(hoveredEmulator);
      }
      // else do nothing
    }
  }, [selectedEmulator, hoveredEmulator]);

  useEffect(() => {
    if (
      selectedEmulator === null ||
      selectedEmulator === undefined ||
      tripData === null ||
      tripData === undefined
    ) {
      tableValues.current = null;
      return;
    }
    setTableValues(selectedEmulator, tripData);
  }, [selectedEmulator, tripData]);

  const { width } = useViewPort();
  const breakpoint = 620;
  const isMobile = width < breakpoint;

  if (isLoading) {
    return (
      <div className="main-address-table">
        <div
          style={{
            background:
              hoveredEmulator && hoveredEmulator !== selectedEmulator?.id
                ? "lightpink"
                : selectedEmulator
                ? "lightblue"
                : "white",
            textAlign: "center",
            justifyContent: "center",
          }}
        >
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="main-address-table">
      {isMobile ? (
        <div
          className="row"
          style={{
            height: "35px !important",
            background: "white",
          }}
        >
          {/* CURRENT ADDRESS*/}
          <div
            className="col-6 d-flex flex-column"
            style={{
              border: "2px solid",
              color: "black",
              alignItems: "center",
              padding: "0",
            }}
          >
            <div className="address-table-heading">Current location</div>
            <div
              className="addressTable"
              style={{
                height: "auto",
                fontSize: "10px",
                width: "calc(100% - 5px)",
              }}
            >
              {tableValues.current ? tableValues.current.address : "N/A"}
            </div>
          </div>
          {/* FROM ADDRESS*/}
          <div
            className="col-6 d-flex flex-column"
            style={{
              border: "2px solid",
              alignItems: "center",
              padding: "0",
            }}
          >
            <div className="address-table-heading">From address</div>
            <div
              className="addressTable"
              style={{
                height: "auto",
                fontSize: "10px",
                width: "calc(100% - 5px)",
              }}
            >
              {tableValues.current ? tableValues.current.fromAddress : "N/A"}
            </div>
          </div>
          {/* TO ADDRESS*/}
          <div
            className="col-5 d-flex flex-column"
            style={{
              border: "2px solid",
              alignItems: "center",
              padding: "0",
            }}
          >
            <div className="address-table-heading">To address</div>
            <div
              className="addressTable"
              style={{
                height: "auto",
                fontSize: "10px",
                width: "calc(100% - 5px)",
              }}
            >
              {tableValues.current ? tableValues.current.toAddress : "N/A"}
            </div>
          </div>

          {/* ARRIVAL TIME */}
          <div
            className="col d-flex flex-column"
            style={{
              border: "2px solid",
              alignItems: "center",
              padding: "0px !important",
            }}
          >
            <div className="address-table-heading">Arrival Time</div>
            {tableValues.current ? (
              <div
                style={{
                  marginTop: "5px !important",
                  height: "30px",
                  textAlign: "center",
                  maxWidth: "20vw",
                }}
                className="totalTimeSubContent"
              >
                <div
                  className="addressTable"
                  style={{ wordWrap: "break-word" }}
                >
                  {tableValues.current.arrivalTime}
                </div>
              </div>
            ) : (
              <div className="addressTable">N/A</div>
            )}
          </div>

          {/* TIME */}
          <div
            className="col-5 d-flex flex-column"
            style={{
              border: "2px solid",
              alignItems: "center",
              padding: "0px !important",
            }}
          >
            <div className="address-table-heading">Total Time</div>
            {tableValues.current ? (
              <div
                style={{
                  marginTop: "5px !important",
                }}
                className="totalTimeSubContent"
              >
                <div
                  className="addressTable"
                  style={{
                    wordWrap: "break-word",
                    height: "auto",
                    fontSize: "10px",
                    width: "calc(100% - 5px)",
                  }}
                >
                  {tableValues.current.totalTime}
                </div>
              </div>
            ) : (
              <div className="addressTable" style={{ height: "50px" }}>
                N/A
              </div>
            )}
          </div>

          {/* REMAING DISTANCE */}
          <div
            className="col d-flex flex-column"
            style={{
              border: "2px solid",
              alignItems: "center",
              padding: "0px !important",
            }}
          >
            <div className="address-table-heading">Remaining Distance</div>
            {tableValues.current ? (
              <div
                style={{
                  marginTop: "5px !important",
                  height: "30px",
                  textAlign: "center",
                  maxWidth: "20vw",
                }}
                className=""
              >
                <div
                  className="addressTable"
                  style={{ wordWrap: "break-word" }}
                >
                  {tableValues.current.remainingDistance} miles
                </div>
              </div>
            ) : (
              <div className="addressTable">N/A</div>
            )}
          </div>

          {/* PLUS MINUS ICONS */}
          <div
            className="col-2 d-flex flex-column"
            style={{
              padding: "0",
            }}
          >
            <div className="btn-group">
              <button
                type="button"
                className="btn border-dark border-2 rounded-0 d-flex align-items-center justify-content-center"
                style={{
                  backgroundColor: "#ff0000",
                  margin: 0,
                  width: "50%",
                  height: "100%",
                }}
              >
                <i className="fa-solid fa-plus text-dark fa-lg plusIcon"></i>
              </button>
              <button
                type="button"
                className="btn border-dark border-2 rounded-0 d-flex align-items-center justify-content-center"
                style={{
                  backgroundColor: "#39e600",
                  margin: 0,
                  width: "50%",
                  height: "100%",
                }}
              >
                <i className="fa-solid fa-minus text-dark fa-lg minusIcon"></i>
              </button>
            </div>
          </div>

          <CreateTripButton />
        </div>
      ) : (
        <table
          className="column_resize_table"
          style={{
             
display:"flex",
flexDirection:"row",
alignItems:"center",
justifyContent:"center",

            background:
              hoveredEmulator && hoveredEmulator !== selectedEmulator?.id
                ? "lightpink"
                : selectedEmulator
                ? "lightblue"
                : "white",
          }}
        >
          <thead> 
            <tr>
              {/* CURRENT ADDRESS*/}
              <div
                style={{
                  border: "2px solid",
                  height:"60px",
                }}
              >
                <div className="address-table-heading">Current location</div>
                <div className="addressTable ellipsisText">
                  <Tooltip
                    title={
                      tableValues.current &&
                      tableValues.current.address &&
                      tableValues.current.address
                    }
                    placement="top"
                  >
                    <div>
                      {tableValues.current && tableValues.current.address
                        ? tableValues.current.address
                        : "N/A"}
                    </div>
                  </Tooltip>
                </div>
              </div>
              <ColumnResizer
                id={1}
                className="columnResizer"
                minWidth={window.innerWidth / 7}
              />
              {/* FROM ADDRESS*/}
              <div
                style={{
                  border: "2px solid",
                  alignItems: "center",
                  height:"60px",
                }}
              >
                <div className="address-table-heading">From address</div>
                <div className="addressTable ellipsisText">
                  <Tooltip title={tableValues.current} placement="top">
                    <div>
                      {tableValues.current
                        ? tableValues.current.fromAddress
                        : "N/A"}
                    </div>
                  </Tooltip>
                </div>
              </div>
              <ColumnResizer
                id={2}
                className="columnResizer"
                minWidth={window.innerWidth / 7}
              />
              {/* TO ADDRESS*/}
              <div
                className="col d-flex flex-column"
                style={{
                  border: "2px solid",
                  alignItems: "center",
                  padding: "0",
                  height:"60px",
                }}
              >
                <div className="address-table-heading">To address</div>
                <div className="addressTable ellipsisText">
                  <Tooltip
                    title={tableValues.current && tableValues.current.toAddress}
                    placement="top"
                  >
                    <div>
                      {tableValues.current
                        ? tableValues.current.toAddress
                        : "N/A"}
                    </div>
                  </Tooltip>
                </div>
              </div>
              <ColumnResizer
                id={3}
                className="columnResizer"
                minWidth={window.innerWidth / 7}
              />
              {/* ARRIVAL TIME */}
              <div
                style={{
                  border: "2px solid",
                  alignItems: "center",
                  height:"60px",
                }}
              >
                <div className="address-table-heading">Final Arrival time </div>
                {tableValues.current ? (
                  <div
                    style={{
                      marginTop: "5px !important",
                      height: "30px",
                      textAlign: "center",
                      maxWidth: "20vw",
                    }}
                    className="totalTimeSubContent"
                  >
                    <div
                      className="addressTable"
                      style={{ wordWrap: "break-word" }}
                    >
                      {tableValues.current.arrivalTime}
                    </div>
                  </div>
                ) : (
                  <div className="addressTable">N/A</div>
                )}
              </div>
              <ColumnResizer
                id={4}
                className="columnResizer"
                minWidth={window.innerWidth / 7}
              />
              {/* TIME */}
              <div
                style={{
                  border: "2px solid",
                  alignItems: "center",
                  height:"60px",
                }}
              >
                <div className="address-table-heading">Total Time</div>
                {tableValues.current ? (
                  <div
                    style={{
                      marginTop: "5px !important",
                      height: "30px",
                      textAlign: "center",
                      maxWidth: "20vw",
                    }}
                    className="totalTimeSubContent"
                  >
                    <div
                      className="addressTable"
                      style={{ wordWrap: "break-word" }}
                    >
                      {tableValues.current.totalTime}
                    </div>
                  </div>
                ) : (
                  <div className="addressTable">N/A</div>
                )}
              </div>
              <ColumnResizer
                id={5}
                className="columnResizer"
                minWidth={window.innerWidth / 7}
              />
              {/* REMAING DISTANCE */}
              <div
                style={{
                  border: "2px solid",
                  alignItems: "center",
                  height:"60px",
                }}
              >
                <div className="address-table-heading">Remaining Distance</div>
                {tableValues.current ? (
                  <div
                    style={{
                      marginTop: "5px !important",
                      height: "30px",
                      textAlign: "center",
                      maxWidth: "20vw",
                    }}
                    className=""
                  >
                    <div
                      className="addressTable"
                      style={{ wordWrap: "break-word" }}
                    >
                      {tableValues.current.remainingDistance} miles
                    </div>
                  </div>
                ) : (
                  <div className="addressTable">N/A</div>
                )}
              </div>
              <ColumnResizer
                id={6}
                className="columnResizer"
                minWidth={window.innerWidth / 7}
              />
              {/* PLUS MINUS ICONS */}
              <div>
                <div>
                  <IconButton
                    aria-label="close"
                    sx={{
                      borderRadius: "0px",
                      color: "#ffffff",
                      backgroundColor: "#00ff00",
                    }}
                  >
                    <AddIcon />
                  </IconButton>
                  <IconButton
                    aria-label="close"
                    sx={{
                      borderRadius: "0px",
                      color: "#ffffff",
                      backgroundColor: "#ff0000",
                    }}
                  >
                    <RemoveIcon />
                  </IconButton>
                </div>
              </div>
              <ColumnResizer
                id={7}
                className="columnResizer"
                minWidth={window.innerWidth / 7}
              />
            </tr>
          </thead>
        </table>
      )}
    </div>
  );
};

export default AddressTable;
