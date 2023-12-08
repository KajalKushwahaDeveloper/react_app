import React from "react";
import "../../../scss/map.scss";
import { useViewPort } from "../../../ViewportProvider.js";
import GpsTable from "./gps_page_table.js";
import { useStates } from "../../../StateProvider";

const AddressTable = ({
}) => {
  var fromAddress = null;
  var toAddress = null;
  var timeInHours = null;

  const { 
    tripData,
    emulator,
    setSelectedEmId,
    selectedEmId,
    hoveredMarker,
    emulators,
    setSelectedEmulator,
    selectedEmulator, 
    showToast,
    AssignedTelephoneNumber,
    setAssignedTelephoneNumber
  } = useStates();
    
  const { width, height } = useViewPort();
  const breakpoint = 620;
  const isMobile = width < breakpoint;

  if (tripData !== null && tripData !== undefined) {
    fromAddress =
      tripData?.fromAddress[0]?.long_name +
        ", " +
        tripData?.fromAddress[1]?.long_name +
        ", " +
        tripData?.fromAddress[2]?.long_name +
        ", " +
        tripData?.fromAddress[3]?.long_name || "N/A";

    toAddress =
      tripData?.toAddress[0]?.long_name +
        ", " +
        tripData?.toAddress[1]?.long_name +
        ", " +
        tripData?.toAddress[2]?.long_name +
        " ," +
        tripData?.toAddress[3]?.long_name || "N/A";

    timeInHours = tripData?.distance / tripData?.velocity;
  }

  var hours = Math.floor(timeInHours);
  var stopCount = 0;
  const minutes = Math.round((timeInHours - hours) * 60);

  tripData?.stops.forEach((stop) => {
    stopCount++;
    hours = hours + 12;
  });

  const totalTime = `~${hours} hours and ${minutes} minutes \n(Including ${stopCount} stops)`;

  const currentStop = tripData?.stops.find(
    (stop) => stop.tripPointIndex === emulator?.currentTripPointIndex + 1
  );
  var stopReachedTime = "N/A";
  var stopWaitingTillTime = "N/A";
  var stopRemainingTime = "N/A";
  if (currentStop) {
    // CALCULATING Stop Details Parse the reachedTime string into a Date object
    const reachedTime = new Date("2023-09-21T15:30:44.239");
    // Calculate the time after 12 hours
    const twelveHoursLater = new Date(reachedTime);
    twelveHoursLater.setHours(twelveHoursLater.getHours() + 12);
    // Calculate the time remaining to reach twelveHoursLater
    const now = new Date();
    const timeRemainingInMillis = twelveHoursLater - now;
    const timeRemainingInSeconds = Math.floor(timeRemainingInMillis / 1000);
    // Calculate hours, minutes, and seconds
    const hoursRemaining = Math.floor(timeRemainingInSeconds / 3600);
    const minutesRemaining = Math.floor((timeRemainingInSeconds % 3600) / 60);
    const secondsRemaining = timeRemainingInSeconds % 60;
    // Create a human-readable string
    const humanReadableTimeRemaining = `${hoursRemaining} hours, ${minutesRemaining} minutes, ${secondsRemaining} seconds`;
    stopReachedTime = `Reached Time: ${reachedTime.toLocaleString()}`;
    stopWaitingTillTime = `Waiting till ${twelveHoursLater.toLocaleString()}`;
    stopRemainingTime = `Time Remaining: ${humanReadableTimeRemaining}`;
  }

  return (
    <div className="container-fluid main-address-table">
      {isMobile ? (
        <div
          className="row"
          style={{
            height: "35px !important",
            background: "white",
          }}>
          {/* CURRENT ADDRESS*/}
          <div
            className="col-6 d-flex flex-column"
            style={{
              border: "2px solid",
              color: "black",
              alignItems: "center",
              padding: "0",
            }}>
            <div className="address-table-heading">Current location</div>
            <div
              className="addressTable"
              style={{
                height: "auto",
                fontSize: "10px",
                width: "calc(100% - 5px)",
              }}>
              {emulator && emulator.address ? emulator.address : "N/A"}
            </div>
          </div>
          {/* FROM ADDRESS*/}
          <div
            className="col-6 d-flex flex-column"
            style={{
              border: "2px solid",
              alignItems: "center",
              padding: "0",
            }}>
            <div className="address-table-heading">From address</div>
            <div
              className="addressTable"
              style={{
                height: "auto",
                fontSize: "10px",
                width: "calc(100% - 5px)",
              }}>
              {fromAddress ? fromAddress : "N/A"}
            </div>
          </div>
          {/* TO ADDRESS*/}
          <div
            className="col-5 d-flex flex-column"
            style={{
              border: "2px solid",
              alignItems: "center",
              padding: "0",
            }}>
            <div className="address-table-heading">To address</div>
            <div
              className="addressTable"
              style={{
                height: "auto",
                fontSize: "10px",
                width: "calc(100% - 5px)",
              }}>
              {toAddress ? toAddress : "N/A"}
            </div>
          </div>
          {/* TIME */}
          <div
            className="col-5 d-flex flex-column"
            style={{
              border: "2px solid",
              alignItems: "center",
              padding: "0px !important",
            }}>
            <div className="address-table-heading">Total Time </div>
            {tripData && emulator ? (
              <div
                style={{
                  marginTop: "5px !important",
                }}
                className="totalTimeSubContent">
                <div
                  className="addressTable"
                  style={{
                    wordWrap: "break-word",
                    height: "auto",
                    fontSize: "10px",
                    width: "calc(100% - 5px)",
                  }}>
                  {totalTime}
                </div>
                {tripData &&
                  emulator &&
                  emulator.tripStatus === "RESTING" &&
                  currentStop && (
                    <div
                      className="addressTable"
                      style={{ wordWrap: "break-word" }}>
                      <p>{stopReachedTime}</p>
                      <p>{stopWaitingTillTime}</p>
                      <p>{stopRemainingTime}</p>
                    </div>
                  )}
              </div>
            ) : (
              <div className="addressTable" style={{ height: "50px" }}>
                N/A
              </div>
            )}
          </div>
          {/* PLUS MINUS ICONS */}
          <div
            className="col-2 d-flex flex-column"
            style={{
              padding: "0",
            }}>
            <div className="btn-group">
              <button
                type="button"
                className="btn border-dark border-2 rounded-0 d-flex align-items-center justify-content-center"
                style={{
                  backgroundColor: "#ff0000",
                  margin: 0,
                  width: "50%",
                  height: "100%",
                }}>
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
                }}>
                <i className="fa-solid fa-minus text-dark fa-lg minusIcon"></i>
              </button>
            </div>
          </div>

          <GpsTable
            showToast={showToast}
            setSelectedEmId={setSelectedEmId}
            selectedEmId={selectedEmId}
            hoveredMarker={hoveredMarker}
            emulators={emulators}
            setSelectedEmulator={setSelectedEmulator}
            selectedEmulator={selectedEmulator}
            AssignedTelephoneNumber={AssignedTelephoneNumber}
            setAssignedTelephoneNumber={setAssignedTelephoneNumber}
          />
        </div>
      ) : (
        <div
          className="row"
          style={{
            height: "35px !important",
            background: "white",
          }}>
          {/* CURRENT ADDRESS*/}
          <div
            className="col d-flex flex-column"
            style={{
              border: "2px solid",
              color: "black",
              alignItems: "center",
              padding: "0",
            }}>
            <div className="address-table-heading">Current location</div>
            <div className="addressTable">
              {emulator && emulator.address ? emulator.address : "N/A"}
            </div>
          </div>

          {/* FROM ADDRESS*/}
          <div
            className="col d-flex flex-column"
            style={{
              border: "2px solid",
              alignItems: "center",
              padding: "0",
            }}>
            <div className="address-table-heading">From address</div>
            <div className="addressTable">
              {fromAddress ? fromAddress : "N/A"}
            </div>
          </div>

          {/* TO ADDRESS*/}
          <div
            className="col d-flex flex-column"
            style={{
              border: "2px solid",
              alignItems: "center",
              padding: "0",
            }}>
            <div className="address-table-heading">To address</div>
            <div className="addressTable">{toAddress ? toAddress : "N/A"}</div>
          </div>

          {/* TIME */}
          <div
            className="col d-flex flex-column"
            style={{
              border: "2px solid",
              alignItems: "center",
              padding: "0px !important",
            }}>
            <div className="address-table-heading">Total Time </div>
            {tripData && emulator ? (
              <div
                style={{
                  marginTop: "5px !important",
                  height: "30px",
                  textAlign: "center",
                  maxWidth: "20vw",
                }}
                className="totalTimeSubContent">
                <div
                  className="addressTable"
                  style={{ wordWrap: "break-word" }}>
                  {totalTime}
                </div>
                {tripData &&
                  emulator &&
                  emulator.tripStatus === "RESTING" &&
                  currentStop && (
                    <div
                      className="addressTable"
                      style={{ wordWrap: "break-word" }}>
                      <p>{stopReachedTime}</p>
                      <p>{stopWaitingTillTime}</p>
                      <p>{stopRemainingTime}</p>
                    </div>
                  )}
              </div>
            ) : (
              <div className="addressTable">N/A</div>
            )}
          </div>

          {/* PLUS MINUS ICONS */}
          <div
            className="col-1 d-flex flex-column"
            style={{
              padding: "0",
            }}>
            <div className="btn-group">
              <button
                type="button"
                className="btn border-dark border-2 rounded-0 d-flex align-items-center justify-content-center"
                style={{
                  backgroundColor: "#ff0000",
                  margin: 0,
                  width: "50%",
                  height: "100%",
                }}>
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
                }}>
                <i className="fa-solid fa-minus text-dark fa-lg minusIcon"></i>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddressTable;
