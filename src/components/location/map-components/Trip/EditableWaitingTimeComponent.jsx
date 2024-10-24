import React, { useState } from "react";
import { Edit } from "@mui/icons-material";
import { Button, IconButton, TextField } from "@mui/material";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import "dayjs/locale/de";
import ApiService from "../../../../ApiService";
import { useStates } from "../../../../StateProvider";
import { TRIP_STOPS_UPDATE_WAIT_TIME_URL } from "../../../../constants";
import "./timePicker.css";

// Constants for time calculations
const HALF_HOUR_MS = 1800000; // 30 minutes in milliseconds

function EditableWaitingTimeComponent(props) {
  const { showToast } = useStates();
  dayjs.extend(utc);

  const waitTimeInMilliseconds = props.waitTime;

  // Initialize timeValue with separate hours and minutes
  const [timeValue, setTimeValue] = useState({
    timeInMilliseconds: waitTimeInMilliseconds,
    hours: Math.floor(waitTimeInMilliseconds / (60 * 60 * 1000)),
    minutes: Math.floor(
      (waitTimeInMilliseconds % (60 * 60 * 1000)) / (60 * 1000)
    ),
  });

  const [isEditing, setIsEditing] = useState(false);

  // Function to format hours and minutes into "HH:mm" where HH can exceed 24
  const formatDuration = (hours, minutes) => {
    const paddedHours = hours.toString().padStart(2, "0");
    const paddedMinutes = minutes.toString().padStart(2, "0");
    return `${paddedHours}:${paddedMinutes}`;
  };

  // Initialize humanReadableTime based on timeValue
  const [humanReadableTime, setHumanReadableTime] = useState(() => {
    return formatDuration(timeValue.hours, timeValue.minutes);
  });

  // Handler to cancel editing
  const handleCancelClick = () => {
    setIsEditing(false);
    // Reset timeValue to original waitTimeInMilliseconds
    const originalHours = Math.floor(waitTimeInMilliseconds / (60 * 60 * 1000));
    const originalMinutes = Math.floor(
      (waitTimeInMilliseconds % (60 * 60 * 1000)) / (60 * 1000)
    );
    setTimeValue({
      timeInMilliseconds: waitTimeInMilliseconds,
      hours: originalHours,
      minutes: originalMinutes,
    });
    setHumanReadableTime(formatDuration(originalHours, originalMinutes));
  };

  // Handler to apply changes
  const handleApplyClick = async () => {
    const newWaitTimeInMilliseconds =
      timeValue.hours * 60 * 60 * 1000 + timeValue.minutes * 60 * 1000;

    if (
      newWaitTimeInMilliseconds === waitTimeInMilliseconds ||
      props.connectedEmulatorId === null ||
      props.tripPointIndex === null
    ) {
      setIsEditing(false);
      return;
    }

    const formattedTime = formatDuration(timeValue.hours, timeValue.minutes);
    const shouldUpdateTime = window.confirm(
      `Are you sure you want to update the stop wait time to ${formattedTime} hours?`
    );
    if (!shouldUpdateTime) {
      return;
    }

    showToast("Updating Wait Time...", "info");
    const token = localStorage.getItem("token");
    const { success, error } = await ApiService.makeApiCall(
      TRIP_STOPS_UPDATE_WAIT_TIME_URL,
      "GET",
      null,
      token,
      props.connectedEmulatorId,
      new URLSearchParams({
        stopTripPointIndex: props.tripPointIndex,
        newWaitTime: newWaitTimeInMilliseconds,
      })
    );

    if (!success) {
      showToast(error, "error");
      console.error("handleApplyClick error : ", error);
    } else {
      showToast("Stop Wait Time Updated!", "success");
      setHumanReadableTime(formattedTime);
    }
    setIsEditing(false);
  };

  // Handler for hour input change
  const handleHoursChange = (e) => {
    const newHours = parseInt(e.target.value, 10);
    if (isNaN(newHours) || newHours < 0) return;
    setTimeValue((prev) => ({
      ...prev,
      hours: newHours,
      timeInMilliseconds: newHours * 60 * 60 * 1000 + prev.minutes * 60 * 1000,
    }));
    setHumanReadableTime(formatDuration(newHours, timeValue.minutes));
  };

  // Handler for minute input change
  const handleMinutesChange = (e) => {
    let newMinutes = parseInt(e.target.value, 10);
    if (isNaN(newMinutes) || newMinutes < 0) newMinutes = 0;
    if (newMinutes >= 60) newMinutes = 59;
    setTimeValue((prev) => ({
      ...prev,
      minutes: newMinutes,
      timeInMilliseconds: prev.hours * 60 * 60 * 1000 + newMinutes * 60 * 1000,
    }));
    setHumanReadableTime(formatDuration(timeValue.hours, newMinutes));
  };

  // Handler to increment time by 30 minutes
  const handleIncrement = () => {
    let { hours, minutes } = timeValue;
    minutes += 30;
    if (minutes >= 60) {
      hours += Math.floor(minutes / 60);
      minutes = minutes % 60;
    }
    setTimeValue({
      timeInMilliseconds: hours * 60 * 60 * 1000 + minutes * 60 * 1000,
      hours,
      minutes,
    });
    setHumanReadableTime(formatDuration(hours, minutes));
  };

  // Handler to decrement time by 30 minutes
  const handleDecrement = () => {
    let { hours, minutes } = timeValue;
    if (hours === 0 && minutes === 0) return;
    minutes -= 30;
    if (minutes < 0) {
      if (hours > 0) {
        hours -= 1;
        minutes += 60;
      } else {
        minutes = 0;
      }
    }
    setTimeValue({
      timeInMilliseconds: hours * 60 * 60 * 1000 + minutes * 60 * 1000,
      hours,
      minutes,
    });
    setHumanReadableTime(formatDuration(hours, minutes));
  };

  return (
    <div>
      <h6
        style={{
          color: "black",
          fontSize: ".9rem",
          fontWeight: "bold",
          textAlign: "left",
        }}
      >
        Stop Wait Time
      </h6>
      {isEditing ? (
        <>
          <div style={{ display: "flex", alignItems: "center" }}>
            <div>
              {/* Increment Button */}
              <button
                style={{
                  // height: '25px',
                  cursor: "pointer",
                  opacity: 1,
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  backgroundColor: "#007cd6",
                }}
                onClick={handleIncrement}
                title="Increase by 30 minutes"
              >
                +
              </button>

              {/* Decrement Button */}

              <button
                style={{
                  width: "23px",
                  // height: '25px',
                  cursor:
                    timeValue.hours === 0 && timeValue.minutes === 0
                      ? "not-allowed"
                      : "pointer",
                  opacity:
                    timeValue.hours === 0 && timeValue.minutes === 0 ? 0.5 : 1,
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  backgroundColor: "#007cd6",
                  marginRight: "10px",
                }}
                onClick={handleDecrement}
                disabled={timeValue.hours === 0 && timeValue.minutes === 0}
                title="Decrease by 30 minutes"
              >
                -
              </button>
            </div>

            {/* Hours and Minutes Inputs */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginRight: "10px",
              }}
            >
              <TextField
                label="HH"
                type="number"
                value={timeValue.hours}
                onChange={handleHoursChange}
                InputProps={{ inputProps: { min: 0 } }}
                style={{ width: "60px", marginRight: "10px" }}
                size="small"
              />
              <TextField
                label="MM"
                type="number"
                value={timeValue.minutes}
                onChange={handleMinutesChange}
                InputProps={{ inputProps: { min: 0, max: 59 } }}
                style={{ width: "60px" }}
                size="small"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              marginTop: "14px",
            }}
          >
            <Button
              variant="contained"
              size="small"
              sx={{ backgroundColor: "red !important", marginRight: "10px" }}
              onClick={handleCancelClick}
            >
              Cancel
            </Button>

            <Button variant="contained" size="small" onClick={handleApplyClick}>
              Apply
            </Button>
          </div>
        </>
      ) : (
        <>
          {/* Display Mode */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <p
              className="pt-2"
              style={{ color: "gray", fontSize: ".8rem", textAlign: "left" }}
            >
              {humanReadableTime} hours
            </p>
            <IconButton
              aria-label="edit"
              onClick={() => setIsEditing(true)}
              size="small"
            >
              <Edit fontSize="small" style={{ marginBottom: "10px" }} />
            </IconButton>
          </div>

          {/* Action Buttons */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              marginTop: "14px",
            }}
          >
            <Button
              variant="contained"
              size="small"
              sx={{ backgroundColor: "red !important", marginRight: "10px" }}
              onClick={() => props.handleDeleteStop()}
            >
              Delete
            </Button>
            <Button
              variant="contained"
              size="small"
              onClick={() => props.handleClose()}
            >
              Close
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

export default EditableWaitingTimeComponent;
