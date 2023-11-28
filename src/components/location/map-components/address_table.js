import React from "react";
import "../../../scss/map.scss";
const AddressTable = ({ tripData, emulator }) => {
  var fromAddress = null;
  var toAddress = null;
  var timeInHours = null;

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
    <div
      className="container-fluid"
      style={{
        position: "fixed",
        top: "64px",
        zIndex: 3,
        background: "white",
      }}>
      <div className="row">
        {/* CURRENT ADDRESS*/}
        <div
          class="col-3 d-flex flex-column"
          style={{
            border: "2px solid",
            color: "black",
            alignItems: "center",
            justifyContent: "center",
          }}>
          <div>Current location</div>
          <div className="addressTable">
            {emulator && emulator.address ? emulator.address : "N/A"}
          </div>
        </div>

        {/* FROM ADDRESS*/}
        <div
          class="col-3 d-flex flex-column"
          style={{
            border: "2px solid",
            alignItems: "center",
            justifyContent: "center",
          }}>
          <div>From address</div>

          <div className="addressTable">
            {fromAddress ? fromAddress : "N/A"}
          </div>
        </div>

        {/* TO ADDRESS*/}
        <div
          class="col-3 d-flex flex-column"
          style={{
            border: "2px solid",
            alignItems: "center",
            justifyContent: "center",
          }}>
          <div>To address</div>
          <div className="addressTable">{toAddress ? toAddress : "N/A"}</div>
        </div>

        {/* TIME */}
        <div
          class="col-2 d-flex flex-column"
          style={{
            border: "2px solid",
            alignItems: "center",
            justifyContent: "center",
          }}>
          <div>Total Time</div>
          <div
            style={{
              marginTop: "5px !important",
              height: "15vh",
              textAlign: "center",
              maxWidth: "20vw",
            }}>
            <div className="addressTable" style={{ wordWrap: "break-word" }}>
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
        </div>

        {/* PLUS MINUS ICONS */}
        <div
          class="col-1 d-flex flex-column"
          style={{
            border: "2px solid",
            alignItems: "center",
            justifyContent: "center",
          }}>
          <div class="btn-group">
            <button
              type="button"
              class="btn btn-number border border-dark border-2 rounded-0"
              data-type="plus"
              data-field="quant[2]"
              style={{ backgroundColor: "#ff0000", margin: 0 }}>
              <i class="fa-solid fa-plus text-dark fa-lg"></i>
            </button>
            <button
              type="button"
              class="btn btn-success btn-number border border-dark border-2 rounded-0"
              data-type="minus"
              data-field="quant[2]"
              style={{ backgroundColor: "#39e600", margin: 0 }}>
              <i class="fa-solid fa-minus text-dark fa-lg"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddressTable;
