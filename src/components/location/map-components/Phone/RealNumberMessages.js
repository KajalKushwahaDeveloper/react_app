import { Card, Grid, List, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import ApiService from "../../../../ApiService";
import { REAL_TELEPHONE_MESSAGES } from "../../../../constants";
import "./twilio/Phone.css";

export function RealNumberMessages({ dialogType, realNumber }) {
  const [numberMessage, setNumberMessage] = useState([]);

  const handleRealNumber = async () => {
    const token = localStorage.getItem("token");
    const { success, data, error } = await ApiService.makeApiCall(
      REAL_TELEPHONE_MESSAGES(realNumber),
      "GET",
      null,
      token
    );
    if (success) {
      // setLoading(false)
      setNumberMessage(data);
    } else {
      // setLoading(false)
      console.error("Error In real number data", error);
    }
  };

  useEffect(() => {
    handleRealNumber();
  }, []);

  return (
    <div>
      {numberMessage && numberMessage.length ? (
        dialogType === "message" ? (
          numberMessage.map((msgData, index) => {
            return (
              <List key={index} style={{ padding: "0px 5px" }}>
                <Card
                  style={{ padding: "0.5rem", boxShadow: "0px 0px 8px -4px" }}
                >
                  <Grid className="showHistory" container>
                    <Grid
                      item
                      xs={6}
                      display={"flex"}
                      direction={"row"}
                      gap={1}
                    >
                      <Typography fontWeight={800}>From:</Typography>
                      <Typography fontWeight={400}>
                        {msgData.From || "N/A"}
                      </Typography>
                    </Grid>
                    <Grid
                      item
                      xs={6}
                      display={"flex"}
                      direction={"row"}
                      gap={1}
                    >
                      <Typography fontWeight={800}>To:</Typography>
                      <Typography fontWeight={400}>
                        {msgData.To || "N/A"}
                      </Typography>
                    </Grid>
                  </Grid>
                  <Grid className="showHistory" container>
                    <Grid
                      item
                      xs={6}
                      display={"flex"}
                      direction={"row"}
                      gap={1}
                    >
                      <Typography fontWeight={800}>Sent Date:</Typography>
                      <Typography fontWeight={400}>
                        {new Date(msgData.SentDate).toLocaleDateString()}
                      </Typography>
                    </Grid>
                    <Grid
                      item
                      xs={6}
                      display={"flex"}
                      direction={"row"}
                      gap={1}
                    >
                      <Typography fontWeight={800}>Sent Time:</Typography>
                      <Typography fontWeight={400}>
                        {msgData.SentTime
                          ? new Date(
                              `1970-01-01T${msgData.SentTime}Z`
                            ).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                              second: "2-digit",
                            })
                          : "Invalid Time"}
                      </Typography>
                    </Grid>
                  </Grid>
                  <Grid className="showHistory" container>
                    <Grid
                      item
                      xs={6}
                      display={"flex"}
                      direction={"row"}
                      gap={1}
                    >
                      <Typography fontWeight={800}>Status:</Typography>
                      <Typography fontWeight={400}>{msgData.Status}</Typography>
                    </Grid>
                    <Grid
                      item
                      xs={6}
                      display={"flex"}
                      direction={"row"}
                      gap={1}
                    >
                      <Typography fontWeight={800}>Duration:</Typography>
                      <Typography fontWeight={400}>
                        {msgData.Duration}
                      </Typography>
                    </Grid>
                  </Grid>
                  <Grid className="showHistory" container>
                    <Grid
                      item
                      xs={6}
                      display={"flex"}
                      direction={"row"}
                      gap={1}
                    >
                      <Typography fontWeight={800}>Price:</Typography>
                      <Typography fontWeight={400}>{msgData.Price}</Typography>
                    </Grid>
                  </Grid>
                  <Grid className="showHistory" container>
                    <Grid item xs={12} display={"flex"} gap={1}>
                      <Typography fontWeight={800}>Message:</Typography>
                      <Typography
                        fontWeight={400}
                        style={{ wordBreak: "break-word" }}
                      >
                        {msgData.Message}
                      </Typography>
                    </Grid>
                  </Grid>
                </Card>
              </List>
            );
          })
        ) : null
      ) : (
        <Typography fontSize={20} display={"flex"} justifyContent={"center"}>
          No data found at present.
        </Typography>
      )}
    </div>
  );
}
