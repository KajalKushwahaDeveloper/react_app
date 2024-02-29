import { Edit } from '@mui/icons-material';
import { Button, IconButton, TextField } from '@mui/material';
import React, { useState } from 'react';
import ApiService from '../../../../ApiService';
import { TRIP_STOPS_UPDATE_WAIT_TIME_URL } from '../../../../constants';

function EditableWaitingTimeComponent(props) {

    const waitTimeInMilliseconds = props.waitTime;

    const [isEditing, setIsEditing] = useState(false);
    const [humanReadableTime, setHumanReadableTime] = useState(() => {
        let date = new Date(waitTimeInMilliseconds);
        let hours = date.getUTCHours();
        let minutes = date.getUTCMinutes();
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    });

    const [time, setTime] = useState(props.waitTime);

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleApplyClick = async () => {
        //TODO: Update the wait time in the database
        if (time === waitTimeInMilliseconds || props.connectedEmulatorId === null || props.tripPointIndex === null) {
            console.log("No change in wait time or connectedEmulatorId or tripPointIndex is null. Returning...");
            return;
        } else {
            // request on window for confirmation
            // if yes, update Stop Time
            // if no, do nothing

            const shouldUpdateTime = window.confirm(
                "Are you sure you want to delete this stop?"
            );
            if (!shouldUpdateTime) {
                return;
            }
            // showToast("Deleting stop...", "info");
            const token = localStorage.getItem("token");
            const { success, data, error } = await ApiService.makeApiCall(
                TRIP_STOPS_UPDATE_WAIT_TIME_URL,
                "GET",
                null,
                token,
                props.connectedEmulatorId,
                new URLSearchParams({
                    stopTripPointIndex: props.tripPointIndex,
                    newWaitTime: time,
                })
            );

            if (!success) {
                // showToast("Error updating stop wait time", "error");
                console.error("handleApplyClick error : ", error);
            } else {
                // setTripData(data); NOTE: THIS IS NOT NEEDED, THE SSE SHOULD BE ABLE TO RESPOND TO THIS CHANGE WITHIN 500 ms
                // showToast("Stop wait time Updated", "success");
                let date = new Date(time);
                let hours1 = date.getUTCHours();
                let minutes2 = date.getUTCMinutes();
                const humanReadableTime = hours1.toString().padStart(2, '0') + ":" + minutes2.toString().padStart(2, '0')
                setHumanReadableTime(humanReadableTime);
            }
        }
        setIsEditing(false);
    };

    const handleTimeChange = (event) => {
        console.log(event.target.value);
        //convert the time to milliseconds
        let timeArray = event.target.value.split(":");
        let hours = parseInt(timeArray[0]);
        let minutes = parseInt(timeArray[1]);
        let timeInMilliseconds = (hours * 3600000) + (minutes * 60000);
        setTime(timeInMilliseconds);
    };

    return (
        <div>
            {isEditing ? (
                <>
                    <TextField
                        id="time"
                        label="Stop Wait Time"
                        type="time"
                        defaultValue={humanReadableTime}   // convert waitTime in milliseconds to format "12:00"
                        onChange={handleTimeChange}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        inputProps={{
                            step: 300, // 5 min
                        }}
                    />
                    <Button variant="contained" color="primary" onClick={handleApplyClick}>
                        Apply
                    </Button>
                </>
            ) : (
                <>
                    <span>Stop wait Time: {humanReadableTime} hours</span>
                    <IconButton aria-label="edit" onClick={handleEditClick}>
                        <Edit />
                    </IconButton>
                </>
            )}
        </div>
    );
}

export default EditableWaitingTimeComponent;