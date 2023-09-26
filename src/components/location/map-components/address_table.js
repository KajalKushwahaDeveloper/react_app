import React from "react";
import "../../../scss/map.scss";
const AddressTable = ({ tripData , emulator }) => {
 
  const fromAddress =
    tripData?.fromAddress[0]?.long_name +
    ", " +
    tripData?.fromAddress[1]?.long_name +
    ", " +
    tripData?.fromAddress[2]?.long_name +
    ", " +
    tripData?.fromAddress[3]?.long_name ||
    "N/A";
  const toAddress =
    tripData?.toAddress[0]?.long_name +
    ", " +
    tripData?.toAddress[1]?.long_name +
    ", " +
    tripData?.toAddress[2]?.long_name +
    " ," +
    tripData?.toAddress[3]?.long_name ||
    "N/A";
    const timeInHours = tripData?.distance / tripData?.velocity;
    var hours = Math.floor(timeInHours);
    var stopCount = 0;
    const minutes = Math.round((timeInHours - hours) * 60);

    tripData?.stops.forEach(stop => {
      stopCount++
      hours = hours + 12
    });
    
    const totalTime = `~${hours} hours and ${minutes} minutes \n(Including ${stopCount} stops)`;

    const currentStop = tripData?.stops.find(
      (stop) => stop.tripPointIndex === emulator?.currentTripPointIndex + 1
    );
    var stopReachedTime = "N/A"
    var stopWaitingTillTime = "N/A"
    var stopRemainingTime = "N/A"
    if(currentStop) {
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
    <div className="table-responsive tableBox" style={{ position:"relative",bottom:"0"}}>
      <table aria-label="custom pagination table" className="table shadow mb-0 n=">
        <thead>
          <tr>
            <th scope="col">From Address</th>
            <th scope="col">To Address</th>
            <th scope="col">Total Time</th>
            {emulator && emulator.tripStatus === "RESTING" && currentStop && (
              <th scope="col">Stop Details</th>
            )}
          </tr>
        </thead>
        <tbody style={{ width: "100vh"}}>
          <tr>
            <td align="right" style={{ wordWrap: "break-word" }}>
              {fromAddress}
            </td>
            <td align="right" style={{ wordWrap: "break-word" }}>
              {toAddress}
            </td>
            <td align="right" style={{ wordWrap: "break-word" }}>
             {totalTime}
            </td>
            {emulator && emulator.tripStatus === "RESTING" && currentStop && (
              <td align="right" style={{ wordWrap: "break-word" }}>
              <p>
                {stopReachedTime}
              </p>
              <p>
                {stopWaitingTillTime}
              </p>
              <p>
                {stopRemainingTime}
              </p>
              </td>
            )}
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default AddressTable;