import React, { useEffect, useRef } from "react";
import { useViewPort } from "../../../../ViewportProvider.js";
import { useEmulatorStore } from "../../../../stores/emulator/store.tsx";
import {
  compareTripDataChangedNullOrId,
  compareSelectedEmulatorChangedNullOrId,
} from "./utils.tsx";
import ApiService from "../../../../ApiService.js";
import { TRIP_URL } from "../../../../constants.js";
import { Resize, ResizeHorizon } from 'react-resize-layout';
import "./ResizeContainer.css";
import { Tooltip } from '@mui/material';
import CreateTripButton from "../MapButtons.jsx";

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
  const arrWidth = width - 25;// 25 is the width of the handles between each 
  const widthArr =new Array(6).fill(arrWidth / 6);
  for (let i = 0; i < 6; i++) {
    let savedAddressWithI = localStorage.getItem(`addressWidth${i}`);
    if (savedAddressWithI === null || savedAddressWithI === undefined) {
      savedAddressWithI = arrWidth / 6;
      localStorage.setItem(`addressWidth${i}`, arrWidth / 6);
    }
    widthArr[i] = savedAddressWithI;
  }
  const elementRefs = useRef([React.createRef(), React.createRef(), React.createRef(), React.createRef(), React.createRef(), React.createRef()]);

  // Start observing the elements when the component is mounted
  useEffect(() => {
    let initialLoad = true;
    const observer = new ResizeObserver(entries => {
      if (initialLoad) {
        initialLoad = false;
        return;
      }
      for (let entry of entries) {
        // save the width in local storage unless they go to 0
        if (entry.target.clientWidth === 0) {
          return;
        }
        localStorage.setItem(`addressWidth${entry.target.id}`, entry.target.clientWidth);
      }
    });

    elementRefs.current.forEach(ref => {
      if (ref.current) {
        observer.observe(ref.current);
      }
    });

    return () => {
      // Cleanup the observer by unobserving all elements
      observer.disconnect();
    };
  }, []);

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
        <div
          style={{
            width: "100vw",
          }}>
          <Resize
            handleWidth={'5px'}
            handleColor={'#007DC66F'}
          >
            <ResizeHorizon
              // on size change, call a function with new size
              width={`${widthArr[0]}px`}
              minWidth={'50px'}
            >
              {/* CURRENT ADDRESS*/}
              <div
                id="0"
                ref={elementRefs.current[0]}
                style={{
                  border: "2px solid",
                  height: "64px",
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
            </ResizeHorizon>
            <ResizeHorizon
              width={`${widthArr[1]}px`}
              minWidth={'50px'}
            >
              {/* FROM ADDRESS*/}
              <div
                id="1"
                ref={elementRefs.current[1]}
                style={{
                  border: "2px solid",
                  alignItems: "center",
                  height: "64px",
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
            </ResizeHorizon>
            <ResizeHorizon
              width={`${widthArr[2]}px`}
              minWidth={'50px'}
            >

              {/* TO ADDRESS*/}
              <div
                id="2"
                ref={elementRefs.current[2]}
                className="col d-flex flex-column"
                style={{
                  border: "2px solid",
                  alignItems: "center",
                  padding: "0",
                  height: "64px",
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
            </ResizeHorizon>
            <ResizeHorizon
              width={`${widthArr[3]}px`}
              minWidth={'50px'}
            >

              {/* ARRIVAL TIME */}
              <div
                id="3"
                ref={elementRefs.current[3]}
                style={{
                  border: "2px solid",
                  alignItems: "center",
                  height: "64px",
                }}
              >
                <div className="address-table-heading">Final Arrival time </div>
                {tableValues.current ? (
                  <div
                    style={{
                      marginTop: "5px !important",
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
            </ResizeHorizon>
            <ResizeHorizon
              width={`${widthArr[4]}px`}
              minWidth={'50px'}
            >

              {/* TIME */}
              <div
                id="4"
                ref={elementRefs.current[4]}
                style={{
                  border: "2px solid",
                  alignItems: "center",
                  height: "64px",
                }}
              >
                <div className="address-table-heading">Total Time</div>
                {tableValues.current ? (
                  <div
                    style={{
                      marginTop: "5px !important",
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
            </ResizeHorizon>
            <ResizeHorizon
              width={`${widthArr[5]}px`}
              minWidth={'50px'}
            >

              {/* REMAING DISTANCE */}
              <div
                id="5"
                ref={elementRefs.current[5]}
                style={{
                  border: "2px solid",
                  alignItems: "center",
                  height: "64px",
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
            </ResizeHorizon>
          </Resize>
        </div>
      )
      }
    </div>
  );
};

export default AddressTable;
